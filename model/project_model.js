const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    technology: [{
            name: {type: String}
        }],
    link: {
        type: String
    }

})

module.exports = mongoose.model('Project_Model', projectSchema);