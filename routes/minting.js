const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const _Abi = require('../config/abi.json');


router.get('/', ((req, res) => {
    const url = 'wss://ws-mumbai.matic.today/';
    const web3 = new Web3(url);
    const account = web3.eth.accounts.wallet.add(process.env.METAMASK_PRIVATE_KEY);
    const contract = new web3.eth.Contract(
        _Abi,
        '0xccB95F21386f753455F7F2A37E7920a4EBE7DdaF'
    );



    contract.methods.mintNFT(req.body.useraddress, req.body.metadata).send({from: account.address, gas: 3000000})
        .then(result => {
            res.send(result);
        });
}))

module.exports = router;