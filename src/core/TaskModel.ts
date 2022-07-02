export abstract class TaskModel {
    createdAt : number;
    status : string;
    
    constructor(){
        this.createdAt = Date.now();
    }
}