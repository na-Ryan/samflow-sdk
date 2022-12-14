export let processedWorker :string =
`{
    "type": "record",
    "name": "processedWorker",
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
            "name": "createdAt",
            "type": "string"
        },
        {
            "name": "status",
            "type": "string"
        },
        {
            "name": "outputData",
            "type": "string"
        },
        {
            "name": "completedAt",
            "type": "string"
            
        },
        {
            "name": "metadata",
            "type": {
                "type" : "record",
                "name" : "metadata",
                "namespace": "in.samflow.workersdk.metadata",
                "fields" : [
                    {
                        "name" : "name",
                        "type" : "string"
                    },
                    {
                        "name" : "category",
                        "type" : "string"
                    },
                    {
                        "name" : "version",
                        "type" : "string"
                    }
                ]
            }
        }
        
    ]
}`;