const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

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
  address: String,
  encryptedPrivateKey: String,
  password: String,
});

const Wallet = mongoose.model("Wallet", walletSchema);

app.post("/wallet", async (req, res) => {
  const { address, encryptedPrivateKey, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

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
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(400).send("Error creating wallet.");
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


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

