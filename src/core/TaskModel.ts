import { STATUS } from "./STATUS";

export abstract class TaskModel {
    createdAt : number;
    completedAt : number;
    status : string;
    instanceId : string;
    taskId : string;
    inputData : object;
    outputData : object;
    taskName : string;
    version : string;
    
    constructor(options : { instanceId: string, inputData : any, taskName : string, version : string }){
        this.createdAt = Date.now();
        this.completedAt = null;
        this.status = STATUS.STARTED;
        this.instanceId = options.instanceId;
        this.taskId = "1"; // create new id we can use some lib here 
        this.inputData = options.inputData;
        this.taskName = options.taskName;
        this.version = options.version;

    }
}