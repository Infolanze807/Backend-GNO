const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  address: { type: String, unique: true },
  encryptedPrivateKey: String,
  password: String,
  transaction: [
    {
      from: { type: String },
      to: { type: String },
      txHash: { type: String },
      amount: { type: String },
    },
  ],
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
