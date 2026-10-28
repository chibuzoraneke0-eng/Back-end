require("dotenv").config();

const express = require("express");
const { Paystack } = require("@paystack/paystack-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

app.use(express.json());

app.post("/pay", async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        message: "Email and amount are required",
      });
    }

    // Call Paystack to initialize the transaction
    const response = await paystack.transaction.initialize({
      email,
      amount: Math.round(amount * 100), // naira to kobo
    });

    return res.status(200).json({
      message: "Payment initialized",
      authorization_url: response.data.authorization_url,
      reference: response.data.reference,
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    return res.status(500).json({
      message: "Could not initialize payment",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
