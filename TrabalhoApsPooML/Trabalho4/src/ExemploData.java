import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

public class ExemploData {
	public static void main(String[] args) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date data = new Date(); // pega hora do sistema
		System.out.println(data);
		System.out.println(sdf.format(data));
		
		Scanner scn = new Scanner(System.in);
		System.out.print("Digite a data (dd/mm/yyyy): ");
		String dataS = scn.nextLine();
		
		try {
			Date data2 = sdf.parse(dataS);
			System.out.println("pq não deu erro");
			System.out.println(data2);
		} catch (ParseException e) {
			System.err.println("deu erro");
//			System.err.println(e.getMessage());
			//e.printStackTrace();			
		}
		
		System.out.println("continua o programa...");
	}
}








