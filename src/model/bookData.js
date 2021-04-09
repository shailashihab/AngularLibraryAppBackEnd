const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://userone:userone@anglibapp.xcifr.mongodb.net/ANGLIBAPP?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const BookSchema = new Schema({
    title:String,
    author:String,
    genre:String,
    img:String,
    cloudinary_id:String
});

var BookData = mongoose.model('bookdata',BookSchema);

module.exports = BookData;