import {STATUS} from './Util/STATUS';
import { WorkerMetadata } from './Util/WorkerMetadata';

export abstract class WorkerModel {
    createdAt : number;
    completedAt : number | null;
    status : string;
    instanceId : string;
    taskId : string;
    inputData : object;
    outputData : object | undefined;
    taskName : string;
    version : string;
    metadata : WorkerMetadata ;
    constructor(metadata: WorkerMetadata ){
        this.metadata = metadata;
    }

    public getMetadata() : WorkerMetadata {
        return this.metadata;
    }
    public abstract feedData(model:Object):void;

}