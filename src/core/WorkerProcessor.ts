import { WorkerModel } from "./WorkerModel";

export abstract class WorkerProcessor<T extends WorkerModel> {
    model : T;
    abstract executeTask( modelObj : T) : Object;
    constructor(){
        
    }
}