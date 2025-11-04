package control.exceptions;

public class NomeNuloException extends Exception{
    public NomeNuloException(){
        super("Nome nulo ou vazio!");
    }
    
    public NomeNuloException(String message){
        super(message);
    }

}
