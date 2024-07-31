const express = require('express');
const router = express.Router();
const { getExchangeRate, initiateSwap } = require('../Controllers/exchangeController');

router.get('/wallet/exchange-balance', getExchangeRate);
router.post('/wallet/initiate-swap', initiateSwap);

module.exports = router;
