import { WorkerModel } from "./WorkerModel";
import { RedisClient } from "./redisClient/RedisClient";
import { Logger } from "./Util/Logger";
import { v4 as uuidv4 } from 'uuid';


export abstract class WorkerProcessor<T extends WorkerModel> {
    model : T;
    abstract executeTask( modelObj : T) : Object;
    private redisClient: RedisClient;
    constructor(){
        this.redisClient = RedisClient.getInstance();
    }
    onStart(model : T){
        this.model = model;
        let task_id = "task_" + uuidv4();
        this.model.taskId = task_id;
        this.redisClient.setValue(task_id,"IN_PROGRESS");
        Logger.log("task :" + task_id + " started");
        this.model.status = "IN_PROGRESS";
    }

    finish(){
        this.redisClient.setValue(this.model.taskId, "COMPLETED");
        this.model.status = "COMPLETED";
        this.model.completedAt = Date.now();
    }

    errored(){
        this.redisClient.setValue(this.model.taskId, "ERROR");
        this.model.status = "ERROR";
        this.model.completedAt = Date.now();
    }
}