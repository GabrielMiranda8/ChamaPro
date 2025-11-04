package src.control.exceptions;

public class UsuarioNaoEncontradoException extends Exception {
    public UsuarioNaoEncontradoException() {
        super("Usuario não encontrado!");
    }

    public UsuarioNaoEncontradoException(String message) {
        super(message);
    }   
}
