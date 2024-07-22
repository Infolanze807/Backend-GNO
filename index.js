const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const CryptoJS = require('crypto-js');
const { ethers } = require('ethers');

const app = express();
const port = 5000;

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

// MongoDB connection
const mongoURI =
  "mongodb+srv://kmbmevada2343:pro2wnEJusERya71@gnosiswallet.oq1wvwv.mongodb.net/Users";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const walletSchema = new mongoose.Schema({
  address: { type: String, unique: true },
  encryptedPrivateKey: String,
  password: String,
});

const Wallet = mongoose.model("Wallet", walletSchema);

// Encryption function
const encryptPrivateKey = (privateKey, password) => {
  return CryptoJS.AES.encrypt(privateKey, password).toString();
};

// Decryption function
const decryptPrivateKey = (encryptedPrivateKey, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
    const decryptedPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPrivateKey;
  } catch (error) {
    console.error('Error decrypting private key:', error);
    return null;
  }
};

app.get("/", (req, res) => res.send("GNO BACKEND RUN....."));

app.post("/wallet", async (req, res) => {
  const { address, encryptedPrivateKey, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find wallet by address
    const existingWallet = await Wallet.findOne({ address });

    if (existingWallet) {
      // Update password
      existingWallet.password = hashedPassword;
      await existingWallet.save();

      res.status(200).json({
        message: "Password updated successfully!",
        wallet: {
          address: existingWallet.address,
          _id: existingWallet._id,
        },
      });
    } else {
      // Create new wallet
      const newWallet = new Wallet({
        address,
        encryptedPrivateKey,
        password: hashedPassword,
      });

      const savedWallet = await newWallet.save();

      res.status(201).json({
        message: "Wallet created successfully!",
        wallet: {
          address: savedWallet.address,
          _id: savedWallet._id,
        },
      });
    }
  } catch (error) {
    console.error("Error creating/updating wallet:", error);
    res.status(400).send("Error creating/updating wallet.");
  }
});

app.get("/wallet/:address/:password", async (req, res) => {
    const { address, password } = req.params;
    console.log("API called For:","Wallet:",address, "password:",password);
  
    try {
      const WalletData = await Wallet.findOne({ address });
      if (!WalletData) {
        return res.status(404).json({ message: "Address not found" });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, WalletData.password);
      if (isPasswordMatch) {
        res.json({
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
  });

app.post('/validate-seed-phrase', (req, res) => {
  const { seedPhrase } = req.body;
  if (seedPhrase && seedPhrase.split(' ').length === 12) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid seed phrase.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
