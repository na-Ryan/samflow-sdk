export type ProcessedWorker = {
    instanceId:string;
    taskId : string,
    createdAt : string,
    status : string,
    outputData: string,
    completedAt : string,
    metadata : { name : string, category : string, version : string}
}