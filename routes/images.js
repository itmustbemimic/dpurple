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


//이미지 업로드
router.post('/', upload.single('aaa'), (req, res) => {
    console.log('몬가... 몬가 일어나고 잇슴...');

    sharp(req.file.path)
        .resize({width:400}) //썸네일용 이미지 리사이즈
        .toFile('public/images/thumbnail/' + req.file.filename, function (err) {
            if (err) console.error(err);
            else console.log(req.file.filename + 'thumbnail generated!');
        });


    res.send(req.file.filename);
});


router.post('/test', (req, res) => {

})


module.exports = router;