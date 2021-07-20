const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: 'public/images/'});

router.post('/', upload.single('aaa'), (req, res) => {
    console.log('몬가... 몬가 일어나고 잇슴...');
    res.redirect('/');
});



module.exports = router;