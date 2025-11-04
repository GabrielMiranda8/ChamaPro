package control.exceptions;

public class ValorInvalidoException extends Exception {
	public ValorInvalidoException() {
	super("Valor invalido");
	}
	
	public ValorInvalidoException(String mensagem) {
		super(mensagem);
	}
}
