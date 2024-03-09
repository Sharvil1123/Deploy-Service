
import {createClient, commandOptions} from "redis";
import { downloadS3Folder } from "./aws";
const subscriber = createClient();
subscriber.connect();

async function main() {
    while(1){
        const response = await subscriber.brPop(
            commandOptions({isolated: true}),
            'build-queue',
            0
        );

        //@ts-ignore
        // console.log(response);
        const id = res.element
        await downloadS3Folder(`output.${id}`)
    }
}

main();