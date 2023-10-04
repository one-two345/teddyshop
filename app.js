const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose  = require('mongoose')
const config = require("./config/database");
const bodyParser = require('body-parser');
const session = require('express-session')
const expressValidator = require('express-validator')

const app =  express();
const port = 4000;

// Add this line at the beginning of your script
delete require.cache[require.resolve('express')];

main().catch(err =>{ console.log(err)})
      .then(console.log('connected'));

async function main() {
  await mongoose.connect(config.database);
 

}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//set global error variables
app.locals.errors = null;

//middlewares

//body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//express-session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//express-validator middleware
app.use(expressValidator({
  errorFormatter: (param,msg, value)=>{
    let namespace = param.split('.')
    , root = namespace.shift()
    ,formParam = root;

  while(namespace.length){
    formParam += '['+ namespace.shift() + ']';
  }  
  return {
    param: formParam,
    msg: msg,
    value: value,
  };
  }
}));

//express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

const pages = require('./routes/pages');
const admin_pages = require('./routes/adminpages');

app.use('/', pages);
app.use('/admin/pages', admin_pages);

app.listen(port, ()=>{console.log('server started on: ' + port)});