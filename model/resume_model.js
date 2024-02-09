const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true
    },
    url: String
    
})

module.exports = mongoose.model('Resume_Model', resumeSchema);