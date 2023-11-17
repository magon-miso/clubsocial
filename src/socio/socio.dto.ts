import {IsNotEmpty, IsString, IsEmail} from 'class-validator';

export class SocioDTO {

    @IsString()
    @IsNotEmpty()
    readonly username: string;
   
    @IsEmail()
    readonly email: string; 

    @IsString()
    @IsNotEmpty()
    readonly birthdate: string;  
}
