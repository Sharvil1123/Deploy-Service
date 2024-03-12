import path from "path";
import * as fs from 'fs';
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "a15e4ff7159459f3722bd989844d7378",
    secretAccessKey:"2cff98ebc425c50e5f92dfadbb8f4042aeec87c6ba0f5d92dc3e6c90b4aa83e4",
    endpoint: "https://83ae6a046fbb74ba0a860706c6af3430.r2.cloudflarestorage.com",
});


export async function downloadS3Folder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
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
            console.log(finalOutputPath);
            const outputFile = fs.createWriteStream(finalOutputPath);
            console.log(outputFile);

            const dirName = path.dirname(finalOutputPath);
            console.log(dirName);

            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}















































































































































// output/asdasd
// export async function downloadS3Folder(prefix: string) {
//     const allFiles = await s3.listObjectsV2({
//         Bucket: "vercel",
//         Prefix: prefix
//     }).promise();
    
//     // 
//     const allPromises = allFiles.Contents?.map(async ({Key}) => {
//         return new Promise(async (resolve) => {
//             if (!Key) {
//                 resolve("");
//                 return;
//             }
//             const finalOutputPath = path.join(__dirname, Key);
//             const outputFile = fs.createWriteStream(finalOutputPath);
//             const dirName = path.dirname(finalOutputPath);
//             if (!fs.existsSync(dirName)){
//                 fs.mkdirSync(dirName, { recursive: true });
//             }
//             s3.getObject({
//                 Bucket: "vercel",
//                 Key
//             }).createReadStream().pipe(outputFile).on("finish", () => {
//                 resolve("");
//             })
//         })
//     }) || []
//     console.log("awaiting");

//     await Promise.all(allPromises?.filter(x => x !== undefined));
// }

// // export function copyFinalDist(id: string) {
// //     const folderPath = path.join(__dirname, `output/${id}/dist`);
// //     const allFiles = getAllFiles(folderPath);
// //     allFiles.forEach(file => {
// //         uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
// //     })
// // }

// export function copyFinalDist(id: string) {
//     const folderPath = path.join(__dirname, `output/${id}/dist`);
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//     }

//     const allFiles = getAllFiles(folderPath);
//     allFiles.forEach(file => {
//         uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
//     });
// }

// const getAllFiles = (folderPath: string) => {
//     let response: string[] = [];

//     const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
//         const fullFilePath = path.join(folderPath, file);
//         if (fs.statSync(fullFilePath).isDirectory()) {
//             response = response.concat(getAllFiles(fullFilePath))
//         } else {
//             response.push(fullFilePath);
//         }
//     });
//     return response;
// }

// const uploadFile = async (fileName: string, localFilePath: string) => {
//     const fileContent = fs.readFileSync(localFilePath);
//     const response = await s3.upload({
//         Body: fileContent,
//         Bucket: "vercel",
//         Key: fileName,
//     }).promise();
//     console.log(response);
// }