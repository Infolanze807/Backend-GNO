const Wallet = require('../Models/walletmodel');

const createTransaction = async (req, res) => {
  const { from, to, txHash, amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ address: from });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    wallet.transaction.push({ from, to, txHash, amount });
    await wallet.save();

    res.status(200).json({ message: "Transaction saved successfully" });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTransactions = async (req, res) => {
  const { address } = req.params;

  try {
    const wallet = await Wallet.findOne({ address });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.status(200).json(wallet.transaction);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// More controller functions for other endpoints...

module.exports = { createTransaction, getTransactions };
