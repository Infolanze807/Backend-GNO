const mongoose = require('mongoose');

const mongoURI = process.env.REACT_APP_DB_URI;
console.log(mongoURI)

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
