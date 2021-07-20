const express = require('express');
const router = express.Router();
const Art = require('../models/art');


router.get('/', (req, res)=> {
    Art.find()
        .then((arts) => {
        res.send(arts);
        console.log(arts);
    })
        .catch((err) => {
            console.error(err);
        })

});

router.post('/',(req, res) =>{
    Art.create(req.body)
        .then(art => res.send(art))
        .catch(err => res.status(500).send(err));
})

router.delete('/:id', (req, res)=> {
    Art.findByIdAndDelete(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));

});

router.put('/:id', (req, res) => {
    Art.findByIdAndUpdate(req.params.id, req.body)
        .then(art => res.send(art))
        .catch(err => res.status(500).send(err));
});


module.exports = router;
