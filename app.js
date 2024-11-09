const express = require('express');
const morgan = require('morgan');
// const router = express.Router();

const booksRouter = require('./Routes/bookroutes')
let app = express();
app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/api/v1/books', booksRouter);

module.exports = app;