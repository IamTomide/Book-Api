const Book = require('../Models/bookmodel');

exports.getAllBooks = async(req, res) => {
    try{
        const filterFields = ['sort', 'fields', 'limit', 'page'];
        const queryCopy = {...req.query};

        filterFields.forEach((elem) => {
            delete queryCopy[elem];
        })

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryStr);
        
        if (req.query.price) {
            if (queryObj.price.$lte){
                queryObj.price.$lte *= 100;
            } else if(queryObj.price.$gte) {
                queryObj.price.$gte *= 100;
            }else if(queryObj.price.$lt) {
                queryObj.price.$gt *= 100;
            } else{
                queryObj.price.$lt *= 100;
            }
            }
        
        let query = Book.find(queryObj);
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join('');
            query = query.sort(sortBy);
        }else{
            query = query.sort('title');
        }

        
        if(req.query.fields) {
            fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }


        
        const page = req.query.page*1 || 1;
        const limit = req.query.limit*1 || 10;
        const skip = (page-1) * limit;
        query = query.skip(skip).limit(limit);
        
        

        if(req.query.page){
            const booksCount = await Book.countDocuments();
            if (skip >= booksCount) {
                throw new Error("This page is not found!");
            }
        }

        const books = await query;
        res.status(200).json({
            status: 'success',
            length: books.length,
            data: {
                books
            }
        })


    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    } 
}

exports.getBook = async(req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    } 
}

exports.createBook = async(req, res) => {
    try{
        const book = await Book.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                book
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateBook = async(req, res) => {
    try{
        const updatedbook = await Book.findByIdAndUpdate(req.params._id, req.body, {new: true, runValidators: true});
        res.status(200).json({
            status: 'success',
            data: {
                book: updatedbook
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteBook = async(req, res) => {
    try{
        console.log(req.params.id);
        await Book.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: {
                book: null
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}