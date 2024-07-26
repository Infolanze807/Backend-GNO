// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const CryptoJS = require('crypto-js');
// const { ethers } = require('ethers');
// const { Transaction } = require("ethers");

// const app = express();
// const port = 5000;

// app.use(bodyParser.json());

// const corsOptions = {
//   // origin: process.env.REACT_APP_FRONTEND,
//   origin:'http://localhost:3000',
//   optionsSuccessStatus: 200 
// };

// app.use(cors(corsOptions));

// // MongoDB connection
// const mongoURI =
//   "mongodb+srv://kmbmevada2343:pro2wnEJusERya71@gnosiswallet.oq1wvwv.mongodb.net/Users";
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const walletSchema = new mongoose.Schema({
//   address: { type: String, unique: true },
//   encryptedPrivateKey: String,
//   password: String,
// });

// const Wallet = mongoose.model("Wallet", walletSchema);

// // Encryption function
// const encryptPrivateKey = (privateKey, password) => {
//   return CryptoJS.AES.encrypt(privateKey, password).toString();
// };

// // Decryption function
// const decryptPrivateKey = (encryptedPrivateKey, password) => {
//   try {
//     const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
//     const decryptedPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
//     return decryptedPrivateKey;
//   } catch (error) {
//     console.error('Error decrypting private key:', error);
//     return null;
//   }
// };

// app.get("/", (req, res) => res.send("GNO BACKEND RUN....."));

// app.post("/wallet", async (req, res) => {
//   const { address, encryptedPrivateKey, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Find wallet by address
//     const existingWallet = await Wallet.findOne({ address });

//     if (existingWallet) {
//       // Update password
//       existingWallet.password = hashedPassword;
//       await existingWallet.save();

//       res.status(200).json({
//         message: "Password updated successfully!",
//         wallet: {
//           address: existingWallet.address,
//           _id: existingWallet._id,
//         },
//       });
//     } else {
//       // Create new wallet
//       const newWallet = new Wallet({
//         address,
//         encryptedPrivateKey,
//         password: hashedPassword,
//       });

//       const savedWallet = await newWallet.save();

//       res.status(201).json({
//         message: "Wallet created successfully!",
//         wallet: {
//           address: savedWallet.address,
//           _id: savedWallet._id,
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error creating/updating wallet:", error);
//     res.status(400).send("Error creating/updating wallet.");
//   }
// });

// app.get("/wallet/:address/:password", async (req, res) => {
//   const { address, password } = req.params;
//   console.log("API called For:","Wallet:",address, "password:",password);

//   try {
//     const WalletData = await Wallet.findOne({ address });
//     if (!WalletData) {
//       return res.status(404).json({ message: "Address not found" });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, WalletData.password);
//     if (isPasswordMatch) {
//       res.status(200).json({
//         success: true,
//         address: WalletData.address,
//         encryptedPrivateKey: WalletData.encryptedPrivateKey,
//       });
//     } else {
//       res.status(401).json({ message: "Wrong password" });
//     }
//   } catch (error) {
//     console.error("Error during authentication:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.post('/validate-seed-phrase', (req, res) => {
//   const { seedPhrase } = req.body;
//   if (seedPhrase && seedPhrase.split(' ').length === 12) {
//     res.json({ valid: true });
//   } else {
//     res.status(400).json({ valid: false, message: 'Invalid seed phrase.' });
//   }
// });

// app.post('/wallet/transaction', async (req, res) => {
//   const { from, to, txHash, amount } = req.body;

//   try {
//     // Find the wallet by the `from` address
//     const wallet = await Wallet.findOne({ address: from });

//     if (!wallet) {
//       return res.status(404).json({ error: 'Wallet not found' });
//     }

//     // Add the transaction to the wallet's transaction array
//     wallet.transaction.push({ from, to, txHash, amount });

//     // Save the updated wallet document
//     await wallet.save();

//     res.status(200).json({ message: 'Transaction saved successfully' });
//   } catch (error) {
//     console.error("Error saving transaction:", error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/wallet/transactions/:address', async (req, res) => {
//   const { address } = req.params;

//   console.log("hello", address)
  

//   try {
//     // Find the wallet by address
//     const wallet = await Wallet.findOne({ address });

//     if (!wallet) {
//       return res.status(404).json({ error: 'Wallet not found' });
//     }

//     // Return the transactions array
//     res.status(200).json(wallet.transaction);
//   } catch (error) {
//     console.error("Error retrieving transactions:", error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const CryptoJS = require('crypto-js');
const { ethers } = require('ethers');
const { Transaction } = require("ethers");

const app = express();
const port = 5000;

app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.REACT_APP_FRONTEND,
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
  transaction: [{
    from: {type:String},
    to: {type:String},
    txHash:{type:String},
    amount:{type:String},
  }]
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

app.get('/wallet/transactions/:address', async (req, res) => {
  const { address } = req.params;

  console.log("hello", address)
  

  try {
    // Find the wallet by address
    const wallet = await Wallet.findOne({ address });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Return the transactions array
    res.status(200).json(wallet.transaction);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({ error: 'Internal server error' });
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

app.post('/wallet/transaction', async (req, res) => {
  const { from, to, txHash, amount } = req.body;

  try {
    // Find the wallet by the `from` address
    const wallet = await Wallet.findOne({ address: from });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Add the transaction to the wallet's transaction array
    wallet.transaction.push({ from, to, txHash, amount });

    // Save the updated wallet document
    await wallet.save();

    res.status(200).json({ message: 'Transaction saved successfully' });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/wallet/transactions', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const wallet = await Wallet.findOne({ address });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json(wallet.transaction);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({ error: 'Internal server error' });
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
  });

  app.get("/wallet/exchange-balance", async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.diadata.org/v1/assetQuotation/Ethereum/0x6810e776880C02933D47DB1b9fc05908e5386b96"
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
