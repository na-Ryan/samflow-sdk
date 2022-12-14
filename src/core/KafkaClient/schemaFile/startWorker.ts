export let startWorker: string = 
`{
    "type": "record",
    "name": "startWorker",
    "namespace": "in.samflow.workersdk",
    "fields": [
        {
            "name": "instanceId",
            "type": "string"
        },
        {
            "name": "taskId",
            "type": "string"
        },
        {
            "name": "inputData",
            "type": "string"
        }
    ]
}`;