import { Consumer, Kafka, Partitioners, Producer } from "kafkajs";
import { Logger } from "../Util/Logger";
import { WorkerMetadata } from '../Util/WorkerMetadata';
import  { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import { startWorker } from "./schemaFile/startWorker";
import { processedWorker } from "./schemaFile/processedWorker";


export class KafkaClient {
    private static consumerClient: Consumer;
    private static instance : KafkaClient;
    private static producerClient : Producer;
    private static signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    private callBack:any = {};
    private static schemaRegistry : SchemaRegistry;
    private static PROCESSED_REGISTRY_SUBJECT_NAME = 'in.samflow.workersdk.processedWorker';
    private static STARTWORKER_REGISTRY_SUBJECT_NAME = 'in.samflow.workersdk.startWorker';

    private constructor(metaData: WorkerMetadata){
        const kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_NAME || 'my-app2',
            brokers : [(process.env.KAFKA_HOST_NAME || '127.0.0.1')+ ":" +  (process.env.KAFKA_HOST_PORT || '9092') ]
        });
        KafkaClient.consumerClient = kafka.consumer({ groupId: "group-" + metaData.category + "_" + metaData.name + '_' + metaData.version });
        KafkaClient.producerClient = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner  });
        process.on('exit', function(code) { 
            KafkaClient.disconnect();
            return console.log(`exiting the code implicitly ${code}`); 
        });
    }
    public static async registerSchema(){
        KafkaClient.schemaRegistry = new SchemaRegistry({ host: 'http://localhost:8085' });
        await KafkaClient.schemaRegistry.register({ type: SchemaType.AVRO, schema : startWorker });
        await KafkaClient.schemaRegistry.register({ type: SchemaType.AVRO, schema : processedWorker});

    }

    public static getInstance(metadata: WorkerMetadata): KafkaClient{
        if(KafkaClient.instance == undefined){
            KafkaClient.instance = new KafkaClient(metadata);
            KafkaClient.registerSchema().then();
        }
        return KafkaClient.instance;
    }

    public async subscribe(metaData: WorkerMetadata, callBack : Function){
        const topic = "topic-" + metaData.category + "_" + metaData.name + '_' + metaData.version;
        this.callBack[topic] = callBack;
        await KafkaClient.consumerClient.subscribe({ topics: ["topic-" + metaData.category + "_" + metaData.name + '_' + metaData.version], fromBeginning: true });
        await KafkaClient.consumerClient.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                let incomingData = await KafkaClient.schemaRegistry.decode(message.value);
                Logger.debug(incomingData);
                this.callBack[topic](incomingData);
            },
        })
    }
    public async publishValue(metaData: WorkerMetadata, value : Object){
        const id = await KafkaClient.schemaRegistry.getLatestSchemaId(KafkaClient.PROCESSED_REGISTRY_SUBJECT_NAME);
        Logger.debug(JSON.stringify(value));
        await KafkaClient.producerClient.connect();
        await KafkaClient.producerClient.send({
            topic : "processed-task",
            messages : [{"value" : await KafkaClient.schemaRegistry.encode(id, value)}]
        });
    }
    public static async disconnect(){
        await KafkaClient.consumerClient.disconnect();
        await KafkaClient.producerClient.disconnect();
    }
    
}