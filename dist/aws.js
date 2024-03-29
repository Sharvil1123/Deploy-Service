"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFinalDist = exports.downloadS3Folder = void 0;
const fs = __importStar(require("fs"));
const aws_sdk_1 = require("aws-sdk");
const path = require("path");
const s3 = new aws_sdk_1.S3({
    accessKeyId: "a15e4ff7159459f3722bd989844d7378",
    secretAccessKey: "2cff98ebc425c50e5f92dfadbb8f4042aeec87c6ba0f5d92dc3e6c90b4aa83e4",
    endpoint: "https://83ae6a046fbb74ba0a860706c6af3430.r2.cloudflarestorage.com",
});
function downloadS3Folder(prefix) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const allFiles = yield s3.listObjectsV2({
            Bucket: "vercel",
            Prefix: prefix
        }).promise();
        // 
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map(({ Key }) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
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
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "vercel",
                    Key
                }).createReadStream().pipe(outputFile).on("finish", () => {
                    resolve("");
                });
            }));
        }))) || [];
        console.log("awaiting");
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter(x => x !== undefined));
    });
}
exports.downloadS3Folder = downloadS3Folder;
function copyFinalDist(id) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
}
exports.copyFinalDist = copyFinalDist;
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            // response = response.concat(getAllFiles(fullFilePath))
            if (!file.startsWith(".git")) {
                response = response.concat(getAllFiles(fullFilePath));
            }
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs.readFileSync(localFilePath);
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
});
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
