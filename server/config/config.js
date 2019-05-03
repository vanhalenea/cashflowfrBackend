process.env.PORT = process.env.PORT || 8080;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDb;

if(process.env.NODE_ENV === 'dev') {
    urldb = 'mongodb+srv://vanhalen:123pormi@clusterprueba-vzysj.mongodb.net/cashflowfr?retryWrites=true';
} else {
    urldb = process.env.DB_URL;
}

//============//
// Vencimiento del token
//=============//
//60 segundos
//60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 ;
process.env.CADUCIDAD_TOKEN_MAIL_PASS_RESTORE = 60 * 60 * 24 * 30;

process.env.GOOGLE_CLIENT_ID = '944893093627-q3lhlq3ujpg8qm9fpgbnn0vekbcq01lj.apps.googleusercontent.com';


//============//
// SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//=============//

//=========//
// mail config para recuperar passowrd
process.env.USER_MAIL_SENDER = process.env.USER_MAIL_SENDER || "fabia.rojas.a@gmail.com";
process.env.USER_PASSWORD_MAIL_SENDER = process.env.USER_PASSWORD_MAIL_SENDER || "Pilotolocosu27";
process.env.MAIL_SERVICE = process.env.MAIL_SERVICE || "Gmail";
process.env.MAIL_REMITENTE = process.env.MAIL_REMITENTE || "Soporte CashFlowFr";
process.env.MAIL_SUBJECT = process.env.MAIL_SUBJECT || "Reactivacion de contraseña";
// ===========//



process.env.URLDB = urldb;