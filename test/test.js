const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
app.use(bodyParser.urlencoded({ extended: true }));
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cmscart", { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

main();

app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
  res.render('test');
});

const schema1 = new mongoose.Schema({ name: String, age: Number });
const model = mongoose.model('pagegeges', schema1);

app.post('/', (req, res) => {
  let name = req.body.name;
  let age = req.body.age;
  let document = new model({ name: name, age: age });
  document.save()
  .then(() => {
      console.log('Document saved successfully');
      res.status(200).send('Document saved successfully');
    })
  .catch((err) => {
      console.error('Error saving document:', err);
      res.status(500).send('Error saving document');
  });


});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
