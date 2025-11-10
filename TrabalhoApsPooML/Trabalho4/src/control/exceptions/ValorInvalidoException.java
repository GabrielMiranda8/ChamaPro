package control.exceptions;

public class ValorInvalidoException extends RuntimeException {
	public ValorInvalidoException() {
	super("Valor invalido");
	}
	
	public ValorInvalidoException(String mensagem) {
		super(mensagem);
	}
}
