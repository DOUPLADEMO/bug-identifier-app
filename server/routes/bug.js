
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const router = express.Router();

// Set up multer for image upload
const upload = multer({ dest: 'uploads/' });

// Route to upload an image and get bug prediction
router.post('/identify', upload.single('bugImage'), (req, res) => {
    const filePath = req.file.path;

    // Run Python script to predict the bug
    exec(`python ../ai-model/model.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send('Error in AI prediction');
        }
        res.send(`Prediction result: ${stdout}`);
    });
});

module.exports = router;
