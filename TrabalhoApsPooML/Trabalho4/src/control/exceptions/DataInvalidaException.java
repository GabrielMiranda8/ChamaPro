package control.exceptions;

public class DataInvalidaException extends RuntimeException{
    public DataInvalidaException(){
        super("Data invalida!");
    }
    
    public DataInvalidaException(String message){
        super(message);
    }   

}
