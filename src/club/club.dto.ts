import {IsNotEmpty, IsString, IsUrl, MaxLength} from 'class-validator';

export class ClubDTO {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
   
    @IsString()
    @IsNotEmpty()
    @MaxLength(100) 
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly image: string;

    @IsString()
    @IsNotEmpty()
    readonly foundationDate: string;
}
