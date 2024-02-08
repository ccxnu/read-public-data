import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Solicitud
{
    processDate: string;

    idRequest: string; // identificativo de cada solicitud

    @IsNumber()
    idUser: number = 0;

    @IsString()
    process: string = '';

    @IsNumber()
    @IsNotEmpty()
    idInstitution: number;

    @IsNumber()
    @IsNotEmpty()
    idSolution: number;

    brand: string = ''; //marca del dispositivo

    model: string; //modelo del dispositivo

    systemVersion: string; //version del sistema operativo

    operatingSystem: string; //sistema operativo 

    @IsString()
    @IsNotEmpty()
    ipDevice: string; //ip del dispositivo

    @IsString()
    @IsNotEmpty()
    ipPublic: string; //ip publica 

    @IsString()
    mac: string; //mac del dispositivo 

    @IsString()
    @IsNotEmpty()
    uid: string; //identificador unico del dispositivo

    gms: boolean; //si tiene los servicios de google

    hms: boolean; //si tiene los servicios de huawei

    platform: number; //numero de plataforma 0:android 1: ios 2:huawei

    //info app

    @IsString()
    appName: string; //nombre del app

    @IsString()
    @IsNotEmpty()
    appVersion: string; //version del app

    @IsString()
    appBuildNumber: string; //numero de compilacion de la app 

    @IsString()
    appBuildSignature: string; //firma del app

    @IsString()
    @IsNotEmpty()
    ispName: string; //nombre dle isp

    //info adicional
    @IsString()
    @IsNotEmpty()
    sender: string;// ejm app , web et..

    @IsString()
    login: string; //login usuario

    @IsString()
    @IsNotEmpty()
    latitude: string;

    @IsString()
    @IsNotEmpty()
    longitude: string;

    secretKey: string;
    
    @IsString()
    @IsNotEmpty()
    country: string; //ejm 'EC'

    @IsString()
    sessionId: string; //ejm 'asdkasda5sd45sa'

    @IsString()
    identificationNumber: string; //:string cedula, ente, other
}
