import { ProcessedWorker } from './KafkaClient/model/typeProcessedWorker';
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
    public getSimplifiedModel() : ProcessedWorker{
        let model = this;
        return {
            instanceId: model.instanceId,
            taskId: model.taskId,
            createdAt: model.createdAt.toString(),
            status: model.status,
            outputData: JSON.stringify(model.outputData),
            completedAt: model.completedAt.toString(),
            metadata: {
                name: model.metadata.name,
                category: model.metadata.category,
                version: model.metadata.version
            }
        };
        
    }
    public abstract feedData(model:Object):void;

}