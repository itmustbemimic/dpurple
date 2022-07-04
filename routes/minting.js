const express = require('express');
const router = express.Router();
const nft = require('nft.storage');
const NFTStorage = nft.NFTStorage;
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {


    async function getImage() {
        const imageOriginUrl = "https://bafkreieifvfgcyjpbbccaxtdoafvggrddvlzquydquv44vd33fhw3qzvym.ipfs.nftstorage.link/"
        const r = await fetch(imageOriginUrl)
        if (!r.ok) {
            throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`)
        }
        return r.blob()
    }

    const image = await getImage()

    console.log(image)

    const nft = {
        image,
        name: 'test name',
        description: 'test desc',
        authors: 'test authors',
    }

    const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })
    const metadata = await client.store(nft)

    console.log('nft data stored')
    console.log('metadata uri: ', metadata.url)

    res.send('hi')


})

module.exports = router;