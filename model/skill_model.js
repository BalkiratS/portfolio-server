const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    projects: [{
            name: {type: String},
            link: {type: String}
        }],
    courses: [{
        name: {type: String},
        link: {type: String}
        }],
    logo: {
        key: String,
        url: String
    },
    category: {
        type: String
    }

})

module.exports = mongoose.model('Skill_Model', skillSchema);