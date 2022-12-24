import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import { isAssertClause } from "typescript";
import {stdout} from 'test-console';
import { Logger } from "../../../src/core/Util/Logger";

chai.use(chaiAsPromised);
let expect = chai.expect;

describe('Test Kafka log', ()=>{
    

    it('Test regular log',  async ()=>{
        const output = stdout.inspectSync(() => {
            Logger.log("test")
        });
       return  assert.deepEqual(output, [ "Log: test\n"]);     
    } );
    it('Test Warning log',  async ()=>{
        const output = stdout.inspectSync(() => {
            Logger.warn("test")
        });
       return  assert.deepEqual(output, [ "Warning: test\n"]);     
    } );
    it('Test Error log',  async ()=>{
        const output = stdout.inspectSync(() => {
            Logger.error("test")
        });
       return  assert.deepEqual(output, [ "Error: test\n"]);     
    } );
    it('Test debug log',  async ()=>{
        const output = stdout.inspectSync(() => {
            Logger.debug("test")
        });
       return  assert.deepEqual(output, []);     
    } );
   

    
});