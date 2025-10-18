package model;

public class Date {
    protected int dia;
    protected int mes;
    protected int ano;

    private Date(int dia, int mes, int ano){
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
    }

    public static Date getInstance(int dia, int mes, int ano){
        if ((dia >= 1 && dia <= 31) && (mes >= 1 && mes <= 12) && (ano >= 1900 && ano <= 2100)){
            return new Date(dia, mes, ano);
        }
        return null;
    }

}
