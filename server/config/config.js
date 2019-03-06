process.env.PORT = process.env.PORT || 8080;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDb;

if(process.env.NODE_ENV === 'dev') {
    urldb = 'mongodb+srv://vanhalen:123pormi@clusterprueba-vzysj.mongodb.net/cashflowfr?retryWrites=true';
} else {
    urldb = 'mongodb+srv://vanhalen:123pormi@clusterprueba-vzysj.mongodb.net/cashflowfr?retryWrites=true';
}

process.env.URLDB = urldb;