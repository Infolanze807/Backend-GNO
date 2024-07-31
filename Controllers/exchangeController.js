const axios = require('axios');

const getExchangeRate = async (req, res) => {
  try {
    const response = await axios.get("https://api.diadata.org/v1/assetQuotation/Ethereum/0x6810e776880C02933D47DB1b9fc05908e5386b96");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const initiateSwap = async (req, res) => {
  const { fiatAmount } = req.body;

  try {
    const response = await axios.get("https://api.diadata.org/v1/assetQuotation/Ethereum/0x6810e776880C02933D47DB1b9fc05908e5386b96");
    const exchangeRate = response.data.Price;

    if (typeof exchangeRate === 'number' && exchangeRate > 0) {
      const cryptoValue = fiatAmount / exchangeRate;
      res.json({
        success: true,
        message: `Swapped $${fiatAmount} to crypto successfully!`,
        cryptoValue: cryptoValue.toFixed(4),
        exchangeRate
      });
    } else {
      throw new Error("Invalid or missing exchange rate");
    }
  } catch (error) {
    console.error("Error initiating swap:", error);
    res.status(500).json({ error: error.message });
  }
};

// More controller functions for exchange balance and other endpoints...

module.exports = { getExchangeRate, initiateSwap };
