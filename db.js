const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://aryanvaish03:Aryan1805@cluster0.wvhmkhb.mongodb.net/"
const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => {
        console.log('Connected to Mongo');
    })
}

module.exports = connectToMongo;