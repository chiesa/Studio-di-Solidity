const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

async function storeImages(imagesFilePath){
    // create the path, the sync and create stream to upload how images
    const fullImagesPath = path.resolve(imageFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log(files)
    /*
    let responses = []
    // create stram for every file in files
    for(file in files){
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[file]}`)
        try{
            // pinata.cloud > profile > api keys > new keys
            const res = await 
        }
 

    }
    */ 
}
module.exports = {storeImages}