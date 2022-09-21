export abstract class TaskModel {
    createdAt : number;
    completedAt : number;
    status : string;
    instance_id : string;
    key : string;
    inputData : object;
    outputData : object;
    taskName : string;
    version : number;


    constructor(){
        this.createdAt = Date.now();

    }
}