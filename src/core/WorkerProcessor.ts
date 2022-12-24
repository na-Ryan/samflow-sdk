import { WorkerModel } from "./WorkerModel";
import { Logger } from "./Util/Logger";
import { v4 as uuidv4 } from 'uuid';


export abstract class WorkerProcessor<T extends WorkerModel> {
    model : T;
    abstract executeTask( modelObj : T) : Object;
    constructor(){
    }
    onStart(model : T){
        this.model = model;
        let taskId = model.taskId;
        Logger.log("task :" + taskId + " started");
        this.model.status = "IN_PROGRESS";
    }

    finish(){
        this.model.status = "COMPLETED";
        this.model.completedAt = Date.now();
    }

    errored(){
        this.model.status = "ERROR";
        this.model.completedAt = Date.now();
    }
}