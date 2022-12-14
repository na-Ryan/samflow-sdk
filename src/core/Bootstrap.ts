import { KafkaClient } from "./KafkaClient/KafkaClient";
import { RedisClient } from "./redisClient/RedisClient";
import { Logger } from "./Util/Logger";
import { WorkerMetadata } from "./Util/WorkerMetadata";
import { WorkerModel } from "./WorkerModel";
import { WorkerProcessor } from "./WorkerProcessor";

export class Bootstrap{

    private static instance : Bootstrap;
    private static serviceObjs: Array<any>;
    private static redisClient: RedisClient;
    private static kafkaClient: KafkaClient;
    

    private constructor(){
        //Bootstrap.redisClient = RedisClient.getInstance();
        
    }

    static getInstance(){
        if(Bootstrap.instance == undefined){
            Bootstrap.instance = new Bootstrap();
        }
        return Bootstrap.instance;
    }

    static register<T extends WorkerModel>(processor : {new() : WorkerProcessor<WorkerModel>}, model : {new() : T extends WorkerModel? any : any}){
        if(Bootstrap.instance == undefined){
            Bootstrap.instance = new Bootstrap();
        }
        const proc = new processor();
        const mod = new model();
        Bootstrap.instance.registerTask(mod, proc);
    }

    public registerTask(model : WorkerModel, proc : WorkerProcessor<any>){
        const metadata = model.getMetadata();
        let appName = metadata.nameSpace + ":" + metadata.category + ":task:" + metadata.name + ":" + metadata.version;
        //Bootstrap.redisClient.setValue(appName, JSON.stringify(metadata));
        Bootstrap.kafkaClient = KafkaClient.getInstance(metadata);
        Bootstrap.kafkaClient.subscribe(metadata, function(message : any){
            model.initData(message);
            model.feedData(JSON.parse(message.inputData));
            proc.onStart(model);
            try{
                let data = proc.executeTask(model);
                model.outputData = data;
                proc.finish();
                Bootstrap.kafkaClient.publishValue(metadata, model.getSimplifiedModel());
            }catch(e){
                proc.errored();
                Logger.log(model.taskId + " Failed to execute with " + e.message);
                Bootstrap.kafkaClient.publishValue(metadata, model);
            }
        })

    }
    public degisterTask(metadata : WorkerMetadata){
        let appName = metadata.nameSpace + ":" + metadata.category + ":task:" + metadata.name + ":" + metadata.version;
        //Bootstrap.redisClient.setValue(appName, "");
    }


}