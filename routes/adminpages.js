const express = require('express') 
const router =  express.Router()
//pages model
const pages = require('../models/pages')

router.get('/', (req, res) => {
  pages.find({}).sort({sorting: 1}).exec((err, pages) => {
    res.render('admin/pages', {pages: pages});
  });
});

router.get('/add-pages', (req, res) => {
  
  res.render('admin/add_pages', {
                               title: '',
                               slug: '',
                               content: '',
  });
});

router.post('/add-pages', (req, res) => {

  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('content', 'Content must have a value').notEmpty();
  
  let title = req.body.title;
  let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
  let content = req.body.content;
  if(slug = '') { slug = title.replace(/\s+/g,'-').toLowerCase();}

  let errors = req.validationErrors();

  if (errors) {
    console.log('errors');
    res.render('admin/add_pages', {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
    });
  } else {
    pages.findOne({slug: slug}, (err, page) => {
      if(page) {
        req.flash('danger','page slug already exists, choose another');
        res.render('admin/add_pages', {
          title: title,
          slug: slug,
          content: content,
        });
      } else {
          let page = new pages({
            title: title,
            slug: slug,
            content: content,
            sorting: 100,
          });
          page.save((err) => {
            if(err)
              return console.log(err);

            req.flash('success', 'page added');
            res.redirect('/admin/pages');  
            
          });
      }
      
    });
  }
  
});

module.exports = router