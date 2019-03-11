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


//============//
// SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//=============//




process.env.URLDB = urldb;