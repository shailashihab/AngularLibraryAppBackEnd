const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://userone:userone@anglibapp.xcifr.mongodb.net/ANGLIBAPP?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const SignUpSchema = new Schema({
    Name:String,
    PhNumber:String,
    Email:String,
    Password:String
});

var SignUpData = mongoose.model('signupdata',SignUpSchema);

module.exports = SignUpData;