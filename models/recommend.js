const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendSchema = new Schema({
    art_id : {type: Schema.Types.ObjectId, ref: 'Art'}
})

module.exports = mongoose.model('Recommend', recommendSchema);