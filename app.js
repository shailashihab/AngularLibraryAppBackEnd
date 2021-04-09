const express = require('express');
const app = new express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const adminEmail = 'admin@gmail.com';
const adminPassword = '123456';
function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return res.status(401).send('Unauthorized request');
    }
    jwt.verify(token, 'secretKey',(err,payload)=>{
        if(err){
            return res.sendStatus(403)
        } 
        else{  
        req.payload=payload;
        console.log(payload);
        next()
        }
    })
}

const PORT = process.env.PORT || 4000;
const BookData = require('./src/model/bookData');
const SignUpData = require('./src/model/signupData');
const AuthorData = require('./src/model/authorData');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req,res){
    res.send('Backend is working');
})
app.get('/books',async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

    await BookData.find()
    .then(function(books){
        console.log(books)
        res.send(books);
    });
});
app.post('/addNewBook',verifyToken, async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
            // Text data from the form
            console.log(req.body);

                var newAddedBook = {};
                newAddedBook.title=req.body.NewBook.title;
                newAddedBook.author=req.body.NewBook.author;
                newAddedBook.genre=req.body.NewBook.genre;
                newAddedBook.img=req.body.NewBook.img;

                var book = BookData(newAddedBook);
                await book.save();

})
app.get('/books/:id',async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.params.id)
    const id = req.params.id;
    await BookData.findOne({_id:id})
    .then(function(book){
        console.log(book);
        if (book==null) {
            return Promise.reject('Book not found');
        }
        res.send(book);
    })
    .catch(err=>{res.send(err);})
});
app.delete('/books/:id', async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.params.id)
    const id = req.params.id;
    await BookData.deleteOne({_id:id})
    .then(function(err){
        console.log(err);
    })
})
app.put('/books/:id', async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.params.id)
    const id = req.params.id;
    console.log(req.body);
    var title = req.body.bookToEdit.title;
    var author = req.body.bookToEdit.author;
    var genre = req.body.bookToEdit.genre;
    var img = req.body.bookToEdit.img;
    await BookData.findOneAndUpdate({_id:id},{$set:{
        title,
        author,
        genre,
        img
        // cloudinary_id
    }},{new:true})
    .then (function(book){
        console.log(book);
        res.send(book);
    })
})
app.post('/login',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
            // Text data from the form
            console.log(req.body);
            var loginEmail=req.body.loggedInUser.Email;
            var loginPassword=req.body.loggedInUser.Password;
            if (loginEmail===adminEmail && loginPassword===adminPassword) {
                console.log('admin');
                let payload = {subject:adminEmail+adminPassword};
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({token});
            } else {
                SignUpData.findOne({Email:loginEmail,Password:loginPassword})
                .then(function(data){
                    console.log(data)
                    res.send(data);
                    if (data==null) {
                       res.send('Please signup first');
                    }
                })
                .catch(err=>{res.send(err)})
            }

});
app.post('/signup',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
            // Text data from the form
            console.log(req.body);
            var newUser = {};
            newUser.Name=req.body.NewUser.Name;
            newUser.PhNumber=req.body.NewUser.PhNumber;
            newUser.Email=req.body.NewUser.Email;
            newUser.Password=req.body.NewUser.Password;

            var user = SignUpData(newUser);
            user.save();
})
app.get('/authors',async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    await AuthorData.find()
    .then(function(authors){
        res.send(authors);
    });
});
app.post('/addAuthor',verifyToken, async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log("req for add author received")
            // Text data from the form
            console.log(req.body);
            // Details about the uploaded file
            // console.log(req.file);

                // const result = await cloudinary.uploader.upload(req.file.path);
                var newAddedAuthor = {};
                newAddedAuthor.name=req.body.NewAuthor.name;
                newAddedAuthor.title=req.body.NewAuthor.title;
                newAddedAuthor.works=req.body.NewAuthor.works;
                // newAddedBook.img=  result.secure_url;
                // newAddedBook.cloudinary_id=result.public_id;
                newAddedAuthor.img=req.body.NewAuthor.img;
    
                var author = AuthorData(newAddedAuthor);
                await author.save();

})
app.get('/authors/:id',async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.params.id)
    const id = req.params.id;
    await AuthorData.findOne({_id:id})
    .then(function(author){
        console.log(author);
        if (author==null) {
            return Promise.reject('Author not found');
        }
        res.send(author);
    })
    .catch(err=>{res.send(err);})
});
app.put('/authors/:id', async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.params.id)
    const id = req.params.id;
    console.log(req.body);
    var name = req.body.AuthorToEdit.name;
    var title = req.body.AuthorToEdit.title;
    var works = req.body.AuthorToEdit.works;
    var img = req.body.AuthorToEdit.img;
    await AuthorData.findOneAndUpdate({_id:id},{$set:{
        name,
        title,
        works,
        img
    }},{new:true})
    .then (function(author){
        console.log(author);
        res.send(author);
    })
})
app.delete('/authors/:id', async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.params.id)
    const id = req.params.id;
    await AuthorData.deleteOne({_id:id})
    .then(function(result){
        console.log(result);
    })
})

app.listen(PORT,()=>{console.log('Server at 4000')});