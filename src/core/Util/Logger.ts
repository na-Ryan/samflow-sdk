export class Logger {
    private constructor(){

    }
    static log(value : string){
        console.log('Log: ' + value);
    }
    static warn(value : string){
        console.log("Warning: " + value);
    }
    static error(value : string){
        console.log("Error: " + value);
    }
    static debug(value : string){
        if(process.env.DEBUG_MODE == "true"){
            console.log('Log: ' + value);
        }
    }
    
}