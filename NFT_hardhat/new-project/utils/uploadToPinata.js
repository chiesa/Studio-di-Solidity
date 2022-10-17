const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
const { read } = require("fs")
require("dotenv").config

const pinataKey = process.env.PINATA_API_KEY
const pinataSecret = process.env.PINATA_API_Secret
const pinata = pinataSDK(pinataKey,pinataSecret)

async function storeImages(imagesFilePath){
    // create the path, the sync and create stream to upload how images
    const fullImagesPath = path.resolve(imageFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log("Uploading")
    
    let responses = []
    // create stram for every file in files
    for(file in files){
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[file]}`)
        try{
            // pinata.cloud > profile > api keys > new keys
            const res = await pinata.pinFiletoIPFS(readableStreamForFile)
            responses.push(response)
        } catch (err){
            console.log(err)
        }
    }
    return { responses,files}
}
module.exports = {storeImages}