const express = require('express');
const cors = require('cors');
//const conectarBaseDeDatos = require('./dbConfig'); // Ajusta la ruta correctamente
const sql = require ('mssql');
const bodyParser = require('body-parser');
const app = express();
const dbConfig = require('./dbConfig');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
}));


app.get('/Inventory', async (req, res) => {
    try {
        console.log('GETGET');
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'SELECT * FROM inventory';

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});


app.post('/Inventory', async(req,res)=>{

    
    try {

    await sql.connect(dbConfig);
    
        const { d_type, modelo, num, purchase, version, location } = req.body;

       // console.log(d_type + "::" + modelo + "::" + num + "::" + purchase + "::" + version + "::" + location)
       const query = `
       INSERT INTO inventory (D_type, modelo, num, purchase, version, location)
       VALUES ('${d_type}', '${modelo}', '${num}', '${purchase}' , '${version}' , '${location}')
     `;

     // Ejecutar la consulta
        const result = await sql.query(query);

        // Verificar los resultados
        console.log('Número de filas afectadas:', result.rowsAffected);
        console.log('Filas devueltas:', result.recordset);

        res.status(200).send('Inserción exitosa');


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
        
    }
})

app.listen(4000, () => {
    console.log('Servidor escuchando en el puerto 4000');
});
