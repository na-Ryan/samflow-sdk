export class Logger {

    private constructor(){

    }

    static log(value : string){
        console.log('Log: ' + value);
    }
    static warn(value : string){
        console.warn("Warning: " + value);
    }
    static error(value : string){
        console.error("Error" + value);
    }
    
}