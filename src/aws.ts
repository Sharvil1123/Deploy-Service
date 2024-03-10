import path from "path";
import * as fs from 'node:fs';
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "9df3479b2d467af57e35d7cb5c142a2f",
    secretAccessKey:"e4f2eca53696ddb158edf9e59a2888fc798992af5de232ac5e40f905925fd374",
    endpoint: "https://83ae6a046fbb74ba0a860706c6af3430.r2.cloudflarestorage.com",
});



// output/asdasd
export async function downloadS3Folder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel-bucket",
        Prefix: prefix
    }).promise();
    
    // 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel-bucket",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}