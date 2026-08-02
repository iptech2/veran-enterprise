const axios = require("axios");
const moment = require("moment");

/* ==========================================
   GET MPESA ACCESS TOKEN
========================================== */
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return data.access_token;

  } catch (err) {
    console.log("========== TOKEN ERROR ==========");
    console.log(err.response?.data || err.message);
    throw err;
  }
};

/* ==========================================
   STK PUSH
========================================== */
const stkPush = async (phone, amount, reference) => {
  try {
    const token = await getAccessToken();

    const timestamp = moment().format("YYYYMMDDHHmmss");

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: reference,
      TransactionDesc: "Wallet Deposit",
    };

    console.log("==================================");
    console.log("MPESA REQUEST");
    console.log(payload);
    console.log("==================================");

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("==================================");
    console.log("MPESA RESPONSE");
    console.log(data);
    console.log("==================================");

    return data;

  } catch (err) {
    console.log("========== STK PUSH ERROR ==========");
    console.log(err.response?.data || err.message);
    throw err;
  }
};

module.exports = {
  stkPush,
};