const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://gno-f-rontend.vercel.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// MongoDB connection
const mongoURI = 'mongodb+srv://kmbmevada2343:pro2wnEJusERya71@gnosiswallet.oq1wvwv.mongodb.net/Users';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const walletSchema = new mongoose.Schema({
  address: String,
  encryptedPrivateKey: String,
  password: String,
});

const Wallet = mongoose.model('Wallet', walletSchema);

app.post('/wallet', async (req, res) => {
  const { address, encryptedPrivateKey, password } = req.body;

  const newWallet = new Wallet({
    address,
    encryptedPrivateKey,
    password,
  });

  try {
    await newWallet.save();
    res.status(201).send('Wallet created successfully!');
  } catch (error) {
    res.status(400).send('Error creating wallet.');
  }
});

app.get('/wallet/:address/:password', async (req, res) => {
    const { address, password } = req.params;
  
    try {
      const walletData = await Wallet.findOne({ address, password });
      if (!walletData) {
        return res.status(404).send('Wallet not found.');
      }
      res.json(walletData);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      res.status(500).send('Error fetching wallet data.');
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
