const bcrypt = require('bcrypt');
const { ethers } = require("ethers");
const Wallet = require('../Models/walletmodel');
// const { encryptPrivateKey, decryptPrivateKey } = require('../config/crypto');

const createOrUpdateWallet = async (req, res) => {
  const { address, encryptedPrivateKey, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingWallet = await Wallet.findOne({ address });

    if (existingWallet) {
      existingWallet.password = hashedPassword;
      await existingWallet.save();
      res.status(200).json({
        message: "Password updated successfully!",
        wallet: { address: existingWallet.address, _id: existingWallet._id },
      });
    } else {
      const newWallet = new Wallet({ address, encryptedPrivateKey, password: hashedPassword });
      const savedWallet = await newWallet.save();
      res.status(201).json({
        message: "Wallet created successfully!",
        wallet: { address: savedWallet.address, _id: savedWallet._id },
      });
    }
  } catch (error) {
    console.error("Error creating/updating wallet:", error);
    res.status(400).send("Error creating/updating wallet.");
  }
};

const LoginOrPrivateKey = async (req,res) =>
{
    const { address, password } = req.params;
      console.log("API called For:", "Wallet:", address, "password:", password);
    
      try {
        const WalletData = await Wallet.findOne({ address });
        if (!WalletData) {
          return res.status(404).json({ message: "Address not found" });
        }
    
        const isPasswordMatch = await bcrypt.compare(password, WalletData.password);
        if (isPasswordMatch) {
          res.status(200).json({
            success: true,
            address: WalletData.address,
            encryptedPrivateKey: WalletData.encryptedPrivateKey,
          });
        } else {
          res.status(401).json({ message: "Wrong password" });
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({ message: "Internal server error" });
      }
} 

// const validateSeedPhrase = (req, res) => {
//   const { seedPhrase } = req.body;
//   if (seedPhrase && seedPhrase.split(" ").length === 12) {
//     res.json({ valid: true });
//   } else {
//     res.status(400).json({ valid: false, message: "Invalid seed phrase." });
//   }
// };

// const validateSeedPhrase = (req, res) => {
//   const { seedPhrase } = req.body;
//   if (seedPhrase && seedPhrase.split(" ").length === 12) {
//     // Assuming you have a function to get wallet details from the seed phrase
//     const walletDetails = ethers.Wallet.fromPhrase(seedPhrase);
//     res.json({ valid: true, walletDetails });
//   } else {
//     res.status(400).json({ valid: false, message: "Invalid seed phrase." });
//   }
// };

const validateSeedPhrase = (req, res) => {
  const { seedPhrase } = req.body;

  if (!seedPhrase || seedPhrase.split(" ").length !== 12) {
    return res.status(400).json({ valid: false, message: "Invalid seed phrase format. Seed phrase must be 12 words." });
  }

  try {
    // Assuming you have a function to get wallet details from the seed phrase
    const walletDetails = ethers.Wallet.fromPhrase(seedPhrase);
    res.json({ valid: true, walletDetails });
  } catch (error) {
    // Catch any errors from ethers.js and return a user-friendly message
    if (error.message.includes('invalid mnemonic word')) {
      res.status(400).json({ valid: false, message: "Invalid mnemonic word detected in the seed phrase." });
    } else {
      res.status(500).json({ valid: false, message: "An error occurred while validating the seed phrase." });
    }
  }
};

// More controller functions for transactions and other endpoints...

module.exports = { createOrUpdateWallet, validateSeedPhrase ,LoginOrPrivateKey };
