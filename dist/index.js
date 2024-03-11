"use strict";
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
const redis_1 = require("redis");
const aws_1 = require("./aws");
// import { buildProject } from "./utils"; //copyFinalDist
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
// const publisher = createClient();
// publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            // @ts-ignore;
            const id = res.element;
            yield (0, aws_1.downloadS3Folder)(`output/${id}`);
            // await buildProject(id);
            // copyFinalDist(id);
            // publisher.hSet("status", id, "deployed")
        }
    });
}
main();
// import {createClient, commandOptions} from "redis";
// import { downloadS3Folder } from "./aws";
// const subscriber = createClient();
// subscriber.connect();
// async function main() {
//     while(1){
//         const res = await subscriber.brPop(
//             commandOptions({isolated: true}),
//             'build-queue',
//             0
//         );
//             //@ts-ignore
//         // console.log(response);
//         const id = res.element;
//         await downloadS3Folder(`output/${id}`);
//         console.log("downloaded");
//     }
// }
// main();
