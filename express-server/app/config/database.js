const environment = require('../config/environment');
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
};
const connect = () => {
    mongoose.connect(environment.databaseURI, options)
        .then(() => console.log('Connection successfully established to MongoDB'))
        .catch(() => console.log('Unable to connect to MongoDB, automatic retry in 5s'));
};

mongoose.set('debug', true);
mongoose.connection.on('disconnected', connect);
connect();