const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: ".env"});

const fs = require('fs');
const Book = require('../Models/bookmodel');

mongoose.connect(process.env.CONN_STR)
.then((conn) => {
    console.log("DB connection succesful");
}).catch((error) => {
console.log('Some error has occured' + error);
});

const books = JSON.parse(fs.readFileSync('Data/books.json', 'utf-8'));

const deleteBooks = async () => {
    try{
        await Book.deleteMany();
        console.log('Data successfully deleted');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
};

const importBooks = async () => {
    try{
        await Book.create(books);
        console.log('Data successfully imported');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
};

if (process.argv[2] === '--import'){
    importBooks();
};
if (process.argv[2] === '--delete'){
    deleteBooks();
};

