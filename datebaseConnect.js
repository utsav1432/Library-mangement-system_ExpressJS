const mongoose = require('mongoose');

function connectDB(){
    const mongoDBUrl = process.env.MONGO_URL;

    mongoose.connect(mongoDBUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection error'))
    db.once('open', function(){
        console.log('DB connected successfully');
    })
}

module.exports = connectDB;