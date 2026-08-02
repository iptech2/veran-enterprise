// const crypto = require("crypto");
// exports.initiatePayment = async (req,res)=>{
// try{
// let {phone, amount}=req.body;

// if(phone.startsWith("0")){
//  phone="254"+phone.substring(1);
// }
// const reference =
// "DEP-" + crypto.randomBytes(4).toString("hex");


// const response =
// await stkPush(
//  phone,
//  amount,
//  reference
// );


// const transaction =
// await Transaction.create({

//  user:req.user._id,

//  type:"deposit",

//  amount:Number(amount),

//  phone,

//  checkoutRequestID:
//  response.CheckoutRequestID,

//  status:"pending",

//  description:
//  "M-Pesa Deposit",

//  reference

// });


// res.json({

// message:"STK Push sent",

// data:response,

// transactionId:transaction._id

// });


// }catch(err){

// console.log(err);

// res.status(500).json({
// message:err.message
// });

// }

// };

const crypto = require("crypto");

const { stkPush } = require("../services/mpesa");
const Transaction = require("../models/Transaction");

exports.initiatePayment = async (req, res) => {
  try {
    let { phone, amount } = req.body;

    // Validate input
    if (!phone || !amount) {
      return res.status(400).json({
        message: "Phone and amount are required",
      });
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    // Format phone number
    phone = String(phone).trim();

    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    }

    if (phone.startsWith("+254")) {
      phone = phone.replace("+", "");
    }

    // Generate unique reference
    const reference =
      "DEP-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    console.log("========== STK PUSH ==========");
    console.log({
      phone,
      amount,
      reference,
    });
 console.log("Reference before stkPush:", reference);
    // Send STK Push
    const response = await stkPush(
      phone,
      amount,
      reference
    );

    console.log("========== SAFARICOM RESPONSE ==========");
    console.log(response);

    if (response.ResponseCode !== "0") {
      return res.status(400).json({
        message:
          response.ResponseDescription ||
          "Failed to initiate payment",
      });
    }

    // Save pending transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: "deposit",
      amount,
      phone,
      reference,
      checkoutRequestID: response.CheckoutRequestID,
      status: "pending",
      description: "M-Pesa Deposit",
    });

    console.log("Transaction saved:", transaction._id);

    return res.json({
      success: true,
      message: "STK Push sent successfully.",
      transactionId: transaction._id,
      checkoutRequestID: response.CheckoutRequestID,
    });

  } catch (err) {
    console.log("MPESA CONTROLLER ERROR");
    console.log(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: err.response?.data?.errorMessage || err.message,
    });
  }
};