const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/restaurants', { useNewUrlParser: true });

mongoose.connection.on('connected', () => console.log('db donnected'));

module.exports = mongoose.connection;