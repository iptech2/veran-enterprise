const { stkPush } = require("../services/mpesa");
const crypto = require("crypto");

exports.initiatePayment = async (req, res) => {
  try {
    let { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        message: "Phone and amount required",
      });
    }

    // format phone (2547XXXXXXXX)
    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    }

    const reference = crypto.randomBytes(6).toString("hex");

    const response = await stkPush(phone, amount, reference);

    res.json({
      message: "STK Push sent",
      data: response,
      reference,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};