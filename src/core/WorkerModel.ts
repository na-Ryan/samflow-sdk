import {STATUS} from './Util/STATUS';
import { WorkerMetadata } from './Util/WorkerMetadata';

export abstract class WorkerModel {
    createdAt : number;
    completedAt : number | null;
    status : string;
    instanceId : string;
    taskId : string;
    inputData : object | undefined;
    outputData : object | undefined;
    taskName : string;
    version : string;
    metadata : WorkerMetadata ;
    constructor(metadata: WorkerMetadata ){
        this.metadata = metadata;
    }
    public initData(model : any){
        this.instanceId = model.instanceId;
        this.taskId = model.taskId;
        this.createdAt = Date.now();
    }

    public getMetadata() : WorkerMetadata {
        return this.metadata;
    }
    public abstract feedData(model:Object):void;

}