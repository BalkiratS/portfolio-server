var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const Skill_modal = require('../model/skill_model');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const authMiddleware = require('../middleware/authenticate');
var getSecret = require('../secrets')

const {PutObjectCommand, DeleteObjectCommand, S3Client} = require('@aws-sdk/client-s3')
const { fromEnv } = require("@aws-sdk/credential-providers");

const initializeS3Client = async () => {
    const s3Creds = await getSecret("pserver/s3-creds");
    return new S3Client({
        region: 'us-west-2',
        credentials: fromEnv(),
    });
};

const upload_logo = async (file) => {
    const client = await initializeS3Client();

    const secretValue = await getSecret("pserver/bucket-name");

    const bucket = secretValue.AWS_BUCKET_NAME;

    const command = new PutObjectCommand({
        Bucket:bucket,
        Key: file.originalname,
        Body:file.buffer,
        ACL:"public-read",
        ContentType:file.mimetype
      });

      try {
        await client.send(command);
        const url = `https://${bucket}.s3.us-west-2.amazonaws.com/${encodeURIComponent(file.originalname)}`
        return {key: file.originalname,
                url: url}
      } catch (err) {
        return null
      }
}


/* Get all the Skills */
router.get('/', async function(req, res)  {
    try {
        const data = await Skill_modal.find({});

        // Check for empty results
        if (!data.length) {
            return res.status(404).json({ message: 'No skills found' });
        }
        res.json(data)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Get the skill by name
router.get('/auth/get/:name', authMiddleware, async function(req, res) {
    const name = req.params.name;

    if (!name.length){
        return res.status(400).json({message: 'No name entered'})
    }

    try {
        const data = await Skill_modal.find({name: req.params.name}).exec();
        if (!data.length) {
            return res.status(404).json({message: 'No skill found'})
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//  Add a new skill
router.post('/auth/add', authMiddleware, upload.single('logo'), async function(req, res) {

    if (!(req.body.name).length){
        return res.status(400).json({message: 'No name entered'})
    }
    let logoData = null;


    if (req.file) {
     logoData = await upload_logo(req.file)
    }

    const skill_data = new Skill_modal({
        name: req.body.name,
        projects: JSON.parse(req.body.projects),
        courses: JSON.parse(req.body.courses),
        logo: logoData,
        category: req.body.category
    })

    try {
        const dataToSave = await skill_data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }

})

// Delete the skill by name
router.delete('/auth/delete/:name', authMiddleware, async function(req, res) {
    if (!(req.params.name).length){
        return res.status(400).json({message: 'No name entered'})
    }

    const query = {name: req.params.name};

    try {
        const data = await Skill_modal.find(query);
        console.log(data)
        const logo_key = data[0].logo.key;
        const client = await initializeS3Client();

        const secretValue = await getSecret("pserver/bucket-name");

        const bucket = secretValue.AWS_BUCKET_NAME;

        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: logo_key,
          });

          try {
            const response = await client.send(command);
          } catch (err) {
            console.error(err);
          }

        await Skill_modal.findOneAndDelete(query);
        res.send(`${req.params.name} skill has been deleted`)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// Update the skill by name
router.patch('/auth/update/:name', authMiddleware, upload.single('logo'), async function(req, res) {
    if (!(req.body.name).length) {
        return res.status(400).json({ message: 'No name entered' });
    }

    let logoData = null;

    // Check if a new logo file is provided
    if (req.file) {
        logoData = await upload_logo(req.file)
       }

    const query = { name: req.params.name };
    const existingSkill = await Skill_modal.findOne(query);

    // Prepare the updated data by merging with existing data
    const updatedData = {
        name: req.body.name || existingSkill.name, // If name is not provided, use the existing name
        projects: JSON.parse(req.body.projects) || existingSkill.projects,
        courses: JSON.parse(req.body.courses) || existingSkill.courses,
        logo: logoData || existingSkill.logo, // If logoData is not provided, use the existing logo
        category: req.body.category || existingSkill.category
    };

    const options = { new: true };

    try {
        const result = await Skill_modal.findOneAndUpdate(query, updatedData, options);
        res.send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
