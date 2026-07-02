package com.cefet.chamapro.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequestDTO {
	
	private String email;
    private String senha; 
    
    public LoginRequestDTO(String email, String senha) {
    	this.email = email;
        this.senha = senha;
    }  	

}
