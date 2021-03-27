const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.S3();
 
exports.handler = async (event, context, callback) => {
    //TODO: check JSON body param whether is right
    console.log('Received event:', JSON.stringify(event, null, 2));

    const srcKey = event.srckey;
    const srcBucket = event.srcBucket;
    const sanitizedSrcKey = srcKey.replace(/\+/g, " ");

    const destKey = event.destKey;
    const destBucket = event.destBucket;
    const sanitizedDestKey = destKey.replace(/\+/g," ");

    try {
        const image = await s3.getObject({
            Bucket: srcBucket, 
            Key: sanitizedSrcKey 
        }).promise();
        
        const resizedImg = await sharp(image.Body)
        .resize({ width: event.width, height: event.height })
        .jpeg({ quality: 90, force: false })
        .png({ compressionLevel: 9, force: false })
        .toBuffer();
        
        await s3.putObject({
            Bucket: destBucket,
            Body: resizedImg,
            Key: sanitizedDestKey
        }).promise();
        
        callback(null, `Success`);
    } catch (err) {
         //TODO: well defined error handling & response
        callback(`Error resizing files: ${err}`);
    }
};
 