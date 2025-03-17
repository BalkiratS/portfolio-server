var express = require('express')
var router = express.Router();
const multer = require('multer');
var mongoose = require('mongoose');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const authMiddleware = require('../middleware/authenticate');
const Resume_model = require('../model/resume_model');
const getSecret = require('../secrets');

const {PutObjectCommand, DeleteObjectCommand, S3Client} = require('@aws-sdk/client-s3');
const { fromEnv } = require("@aws-sdk/credential-providers");

const initializeS3Client = async () => {
    const s3Creds = await getSecret("pserver/s3-creds");
    return new S3Client({
        region: 'us-west-2',
        credentials: fromEnv(),
    });
};

const upload_resume = async (file) => {
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

// get a resume
router.get('/', async function(req, res) {
    try {
        const data = await Resume_model.find({});

        // Check for empty results
        if (!data.length) {
            return res.status(404).json({ message: 'No resume found' });
        }
        console.log(data[0].url)
        res.redirect(data[0].url);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// uplaod a resume (replace the old resume)
router.post('/upload', authMiddleware,  upload.single('resume'),  async function(req, res) {
    if (!(req.file)){
        return res.status(400).json({message: 'No file submitted'})
    }

    const resumeData = await upload_resume(req.file)

       const resume_data = new Resume_model({
        key: resumeData.key,
        url: resumeData.url
    })

    var oldResumeKey = null

    const oldResume = await Resume_model.find({});
        if (oldResume.length > 0) {
            oldResumeKey = oldResume[0].key;
        }


    try {
        const client = await initializeS3Client();

        const result = await Resume_model.findOneAndReplace({}, resumeData, { upsert: true, new: true });

        const secretValue = await getSecret("pserver/bucket-name");

        const bucket = secretValue.AWS_BUCKET_NAME;


        // delete old resume from the S3
        if (oldResumeKey != null){
            const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: oldResumeKey,
          });

          try {
            const response = await client.send(command);
          } catch (err) {
            console.error(err);
          }
        }

        res.status(200).json(result)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = router;
