// Setting Basic Node Requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Express Middleware
const app = module.exports = express();
// Connection To The Database
mongoose.connect('mongodb://localhost/urlshort');
// Setting db Variable For Database Use
const db = mongoose.connection;
// Setting Public Folder
app.use('/public', express.static(__dirname, 'public'));
// Database Schema
var UrlShort = mongoose.Schema({
    'Original Url': String,
    'Short Url': String
});



