var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
        search: String,
        name: String,
        url: String,
        image_url: String,
        address: Array,
        rating: String,
        price: String,
    });
    
module.exports = mongoose.model('Bar', Bar);