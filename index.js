require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const mongoose = require('./Config/database');
const walletRoutes = require('./Routes/walletRoutes');
const exchangeRoutes = require('./Routes/exchangeRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');

app.use(express.json());

const corsOptions = {
  origin: process.env.REACT_APP_FRONTEND,
  optionsSuccessStatus: 200,
};
// console.log(corsOptions.origin)

app.get("/", (req, res) => res.send("GNO BACKEND RUN..."));

app.use(cors(corsOptions));

app.use('/', walletRoutes);
app.use('/', exchangeRoutes);
app.use('/', transactionRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
