// Setting Basic Node Requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
// Express Middleware
const app = module.exports = express();
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Connection To The Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urlshort');
// Setting db Variable For Database Use
const db = module.exports = mongoose.connection;
mongoose.Promise = global.Promise;
// Setting Public Folder
app.use('/public', express.static(__dirname + 'public'));
// Database Schema
var UrlShortSchema = mongoose.Schema({
    OriginalUrl: String,
    ShortUrl: String
});
var UrlShort = mongoose.model('UrlShort', UrlShortSchema);
// HomePage GET Request
app.get('/', (req, res, next) => {
    res.sendFile('./public/index.html', {root: __dirname});
});
// URL Submit POST Request
app.post('/', (req, res) => {
    let url = req.body.urlOriginal;
    if(!url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)){
        res.redirect('/error');
    } else {
        var short = Math.floor(Math.random()*100000).toString();
        var validUrl = new UrlShort({
            OriginalUrl: url,
            ShortUrl: short
        });
        validUrl.save(function (err) {
            if (err) {
              console.log(err);
            } else {
                db.collection('urlshorts').insert(UrlShort);
                res.redirect('/new/' + url);
            }
          });
    }
});
// Redirect Page For The Short Url
// Page GET request
app.get('/:shorturl', (req, res) => {
    UrlShort.findOne({'ShortUrl': req.params.shorturl}, (err, doc) => {
        if(err) return res.send('Error Reading Database!');
        var re = new RegExp("^(http|https)://", "i");
        if(!re.test(doc.OriginalUrl)){
            res.redirect(301, 'https://' + doc.OriginalUrl);
        } else {
            res.redirect(301, doc.OriginalUrl);
        }
    });
});
// URL Show GET Request
app.get('/new/:url(*)', (req, res) => {
    UrlShort.findOne({'OriginalUrl': req.params.url}, (err, doc) => {
        //var dataQueries = Object.assign({OriginalUrl: doc.OriginalUrl, ShortUrl: doc.ShortUrl});
        res.json(doc);
    });
});
// Invalid Url Page GET Request
app.get('/error', (req, res) => {
    res.send('URL is invalid. Please try another one.');
});
// Server Start
app.listen(process.env.PORT || 3000, () => {
    console.log('Server Is On.');
});