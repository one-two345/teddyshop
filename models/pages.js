const mongoose = require('mongoose')

//pages schema
const pages_schema = new mongoose.Schema({
   title: {type: String,
           required: true },

    slug: {type: String, },

    content: {type: String,
              required: true },
 
    sorting: {type: Number,},
  
  });
  
  const pages = module.exports = mongoose.model('pages', pages_schema);