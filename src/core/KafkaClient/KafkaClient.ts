import { Consumer, Kafka, Partitioners, Producer } from "kafkajs";
import { Logger } from "../Util/Logger";
import { WorkerMetadata } from '../Util/WorkerMetadata';

export class KafkaClient {
    private static consumerClient: Consumer;
    private static instance : KafkaClient;
    private static producerClient : Producer;
    private static signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    private constructor(metaData: WorkerMetadata){
        const kafka = new Kafka({
            clientId: 'my-app2',
            brokers : [(process.env.KAFKA_HOST_NAME || '127.0.0.1')+ ":" +  (process.env.KAFKA_PORT || '9092') ]
        });
        KafkaClient.consumerClient = kafka.consumer({ groupId: "group-" + metaData.category + "_" + metaData.name + '_' + metaData.version });
        KafkaClient.producerClient = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner  });
        process.on('exit', function(code) { 
            KafkaClient.disconnect();
            return console.log(`exiting the code implicitly ${code}`); 
        });
    }

    public static getInstance(metadata: WorkerMetadata): KafkaClient{
        if(KafkaClient.instance == undefined){
            KafkaClient.instance = new KafkaClient(metadata);
        }
        return KafkaClient.instance;
    }

    public async subscribe(metaData: WorkerMetadata, callBack : Function){
        await KafkaClient.consumerClient.subscribe({ topics: ["topic-" + metaData.category + "_" + metaData.name + '_' + metaData.version], fromBeginning: true });
        await KafkaClient.consumerClient.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                Logger.log(message.value.toString());
                callBack(JSON.parse(message.value.toString()));
            },
        })
    }
    public async publishValue(metaData: WorkerMetadata, value : Object){
        await KafkaClient.producerClient.connect();
        await KafkaClient.producerClient.send({
            topic : "processed-" + metaData.category + "_" + metaData.name + '_' + metaData.version,
            messages : [{value : JSON.stringify(value) || value.toString()}]
        });
    }
    public static async disconnect(){
        await KafkaClient.consumerClient.disconnect();
        await KafkaClient.producerClient.disconnect();
    }
    
}