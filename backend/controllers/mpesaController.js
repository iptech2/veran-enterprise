// const { stkPush } = require("../services/mpesa");
// const crypto = require("crypto");

// exports.initiatePayment = async (req, res) => {
//   try {
//     let { phone, amount } = req.body;

//     if (!phone || !amount) {
//       return res.status(400).json({
//         message: "Phone and amount required",
//       });
//     }

//     // format phone (2547XXXXXXXX)
//     if (phone.startsWith("0")) {
//       phone = "254" + phone.substring(1);
//     }

//     const reference = crypto.randomBytes(6).toString("hex");

//     const response = await stkPush(phone, amount, reference);

//     res.json({
//       message: "STK Push sent",
//       data: response,
//       reference,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };


// const { stkPush } = require("../services/mpesa");
// const crypto = require("crypto");

// const Transaction = require("../models/Transaction");


// exports.initiatePayment = async (req, res) => {

//   try {

//     let { phone, amount } = req.body;


//     if (!phone || !amount) {

//       return res.status(400).json({
//         message: "Phone and amount required"
//       });

//     }


//     // FORMAT PHONE NUMBER

//     if (phone.startsWith("0")) {

//       phone = "254" + phone.substring(1);

//     }


//     // CREATE UNIQUE REFERENCE

//     const reference =
//       crypto.randomBytes(8).toString("hex");



//     // SEND STK PUSH

//     const response = await stkPush(
//       phone,
//       amount,
//       reference
//     );


//     const checkoutRequestID =
//       response.CheckoutRequestID;



//     if (!checkoutRequestID) {

//       return res.status(400).json({
//         message:"STK Push failed. No CheckoutRequestID received"
//       });

//     }



//     // SAVE TRANSACTION

//     const transaction =
//       await Transaction.create({

//         user:req.user._id,

//         type:"deposit",

//         amount:Number(amount),

//         phone,

//         reference,

//         checkoutRequestID,

//         status:"pending",

//         description:"M-Pesa Deposit"

//       });



//     console.log(
//       "Transaction created:",
//       transaction._id
//     );

//     console.log(
//       "Checkout ID:",
//       checkoutRequestID
//     );



//     res.json({

//       message:"STK Push sent",

//       data:response,

//       transactionId:transaction._id,

//       checkoutRequestID

//     });



//   } catch(err){


//     console.log(err);


//     res.status(500).json({

//       message:err.message

//     });


//   }

// };
const crypto = require("crypto");


exports.initiatePayment = async (req,res)=>{

try{

let {phone, amount}=req.body;


if(phone.startsWith("0")){
 phone="254"+phone.substring(1);
}


const reference =
"DEP-" + crypto.randomBytes(4).toString("hex");


const response =
await stkPush(
 phone,
 amount,
 reference
);


const transaction =
await Transaction.create({

 user:req.user._id,

 type:"deposit",

 amount:Number(amount),

 phone,

 checkoutRequestID:
 response.CheckoutRequestID,

 status:"pending",

 description:
 "M-Pesa Deposit",

 reference

});


res.json({

message:"STK Push sent",

data:response,

transactionId:transaction._id

});


}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

};