export abstract class TaskProcess<T>{
    model : T;
    abstract executeTask( modelObj : T) : Object;
}