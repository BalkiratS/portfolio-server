var express = require('express')
var mongoose = require('mongoose')
var router = express.Router();
const Project_Model = require('../model/project_model');
const authMiddleware = require('../middleware/authenticate');


/* Get all the Projects */
router.get('/', async function(req, res)  {
    try {
        const data = await Project_Model.find({});

        // Check for empty results
        if (!data.length) {
            return res.status(404).json({ message: 'No Projects found' });
        }
        res.json(data)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Get the Project by name
router.get('/auth/get/:name', authMiddleware, async function(req, res) {
    const name = req.params.name;

    if (!name.length){
        return res.status(400).json({message: 'No name entered'})
    }

    try {
        const data = await Project_Model.find({name: req.params.name}).exec();
        if (!data.length) {
            return res.status(404).json({message: 'No Project found'})
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//  Add a new Project
router.post('/auth/add', authMiddleware, async function(req, res) {

    console.log(req.body)
    
    if (!(req.body.name).length){
        return res.status(400).json({message: 'No name entered'})
    }
    
    const ProjectData = new Project_Model({
        name: req.body.name,
        description: req.body.description,
        technology: req.body.technology,
        link: req.body.link
    })

    try {
        const dataToSave = await ProjectData.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }

})

// Delete the project by name
router.delete('/auth/delete/:name', authMiddleware, async function(req, res) {
    if (!(req.params.name).length){
        return res.status(400).json({message: 'No name entered'})
    }

    const query = {name: req.params.name};

    try {
        await Project_Model.findOneAndDelete(query);
        res.send(`${req.params.name} project has been deleted`)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// Update the project by name
router.patch('/auth/update/:name', authMiddleware, async function(req, res) {
    if (!(req.body.name).length) {
        return res.status(400).json({ message: 'No name entered' });
    }

    const query = { name: req.params.name };
    const existingProject = await Project_Model.findOne(query);

    // Prepare the updated data by merging with existing data
    const updatedData = {
        name: req.body.name || existingProject.name, // If name is not provided, use the existing name
        description: req.body.description || existingProject.description,
        technology: req.body.technology || existingProject.technology,
        link: req.body.link || existingProject.link
        
    };

    const options = { new: true };

    try {
        const result = await Project_Model.findOneAndUpdate(query, updatedData, options);
        res.send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;