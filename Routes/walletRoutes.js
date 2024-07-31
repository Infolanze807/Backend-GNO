const express = require('express');
const router = express.Router();
const { createOrUpdateWallet, validateSeedPhrase ,LoginOrPrivateKey } = require('../Controllers/walletController');

router.post('/wallet', createOrUpdateWallet);
router.get('/wallet/:address/:password',LoginOrPrivateKey)
router.post('/validate-seed-phrase', validateSeedPhrase);

module.exports = router;
