const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: String,

    userEmail: String,

    stripeSessionId: String,

    paymentIntent: String,

    amount: Number,

    currency: String,

    paymentStatus: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;