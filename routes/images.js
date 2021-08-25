const express = require('express');
const multer = require('multer');
const router = express.Router();
const sharp = require('sharp');

const limits = {
    fileSize: 16777216 //16MB
}
const upload = multer({
    dest: 'public/images/origin',
    limits: limits
});

router.post('/', upload.single('aaa'), (req, res) => {
    console.log('몬가... 몬가 일어나고 잇슴...');

    sharp(req.file.path)
        .resize({width:400})
        .toFile('public/images/thumbnail/' + req.file.filename, function (err) {
            if (err) console.error(err);
            else console.log(req.file.filename + 'thumbnail generated!');
        });


    res.sendStatus(200);
});


router.post('/test', (req, res) => {

})


module.exports = router;