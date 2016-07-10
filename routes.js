module.exports = function(app, db) {



    app.get('/racehtml', function(req, res) {
        res.sendFile(__dirname + '/fe/chapter1/animation.html')
    });

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


};

//req.params
//req.params(name)
//req.query
//req.body
//req.get(header)
//req.path
//req.url
//res.status(code): The HTTP response code.
//res.attachment([filename]): The response HTTP header Content-Disposition to attachment.
//res.sendfile(path, [options], Sends a file to the client [callback]).
//res.download(path, [filename], Prompts the client to download from [callback]).
//res.render(view, [locals], Renders a view callback).
