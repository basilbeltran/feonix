console.log('starting app.js in node')

const express = require('express');
const app = express();
const bodyParser= require('body-parser');

app.use(express.static('public'))                 // set public accesible
app.use(bodyParser.json())                        // read JSON for the put / update
app.use(bodyParser.urlencoded({extended: true}));
//urlencoded tells body-parser to extract data from the <form> element and add them
//to the body property in the request object.
app.set('view engine', 'ejs')

var db
const MongoClient = require('mongodb').MongoClient; // mongodb://<fuser2>:<mongodb777>@ds017165.mlab.com:17165/foenix_db1
MongoClient.connect('mongodb://fuser:password1@ds017165.mlab.com:17165/foenix_db1', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {              //only listen if we have a db
    console.log('listening on 3000')
  });
});


//const routes = require('./routes')(app, db)    // ERROR DEFINING COLLECTION
app.get('/race', function(req, res) {
   res.render('animation.ejs')
});


app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => { //toArray is a function of the cursor returned by find
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})  //  express CONVENTION is 'views' dir under my express
  })
})



app.post('/quotes', (req, res) => {                         // WHAT WITH /QUOTES AND / ?
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to the database '+ result)
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)                  //sends the results back to the fetch request, index.ejs
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
