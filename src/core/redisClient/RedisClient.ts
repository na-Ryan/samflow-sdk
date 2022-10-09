import { createClient } from "redis";
import { Logger } from "../Util/Logger";

export class RedisClient {
    private static instance: RedisClient;
    private static client: any;
    

    private constructor(){
        RedisClient.client = createClient({ url: 'redis://' + process.env.REDIS_HOST_NAME || '127.0.0.1' + ':' + process.env.REDIS_PORT || '6379'});
        RedisClient.client.on('error', (err: any) => Logger.error('Redis Client Error '+ JSON.stringify(err)));
        RedisClient.client.connect().then(
            ()=>{Logger.log("Redis initilized");}
        );
    }

    public static getInstance() : RedisClient {
        if(!RedisClient.instance){
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public async setValue(key : string, value : string){
        try{
            await RedisClient.client.set(key, value);
            Logger.log("Successfully set "+ key);
            return true
        }catch(e){
            Logger.error("Unable to set "+ key + "as value " + value);
            setTimeout(async function(){
                await RedisClient.instance.setValue(key, value);
            }, 2000)
        }
    }

    public async getValue(key: string) : Promise<any>{
        try{
            return await RedisClient.client.get(key);
        }catch(e){
            Logger.error("Unable to get "+ key + "as value retrying..");
            setTimeout(async function(){
                await RedisClient.instance.getValue(key);
            }, 2000)
        }
    }
    public  disconnect(){
        RedisClient.client.disconnect();
    }
}