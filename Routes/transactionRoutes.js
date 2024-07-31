const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../Controllers/transactionController');

router.post('/wallet/transaction', createTransaction);
router.get('/wallet/auth/transactions/:address', getTransactions);

module.exports = router;
