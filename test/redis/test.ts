import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { isAssertClause } from "typescript";
import {RedisClient} from "../../src/core/redisClient/RedisClient";

chai.use(chaiAsPromised);
let expect = chai.expect;

describe('Redis client testing', ()=>{
    let client : RedisClient;
    before(function(){
        process.env.REDIS_HOST_NAME = '127.0.0.1';
        process.env.REDIS_PORT = '6379';
        client = RedisClient.getInstance();

    });

    it('should able to get connection',  async ()=>{
       return  expect(client.setValue("test", "value")).to.eventually.equal(true);      
    } );
    it('should able to get value',  async ()=>{
        return expect(client.getValue("test")).to.eventually.deep.equal("value");
    } );

    after(function(){
        client.disconnect();
    });

    
});