const sql = require('mssql');

/*const config = {
  server: 'localhost',
  port: 1433,
  user: 'Nissan',
  password: '012345',
  database: 'Nissan',
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    // No necesitas instancename si estás usando la instancia predeterminada
  },
};*/

// dbConfig.js
module.exports = {
  user: 'Nissan',
  password: '012345',
  server: 'localhost',
  database: 'Nissan',
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};
/*async function conectarBaseDeDatos() {
  try {
    console.log('Intentando conectar a la base de datos...');
    await sql.connect(config);
    console.log('Conexión exitosa a la base de datos');
    // Aquí puedes realizar operaciones en la base de datos
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  } finally {
    console.log('Cerrando la conexión...');
    await sql.close();
  }
}*/







// Llamas a la función para conectar la base de datos
//module.exports = conectarBaseDeDatos;
