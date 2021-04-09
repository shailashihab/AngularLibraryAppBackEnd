const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://userone:userone@anglibapp.xcifr.mongodb.net/ANGLIBAPP?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
    name:String,
    title:String,
    works:String,
    img:String
});


var AuthorData = mongoose.model('authordata',AuthorSchema);

module.exports = AuthorData;