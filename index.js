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
//-------------------------INVENTORY SOURCE CRUD--------------------->
app.get('/Inventory', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'Exec [dbo].[Search] ';

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
        const {d_type, modelo, num, purchase, version, location } = req.body;
       // console.log(d_type + "::" + modelo + "::" + num + "::" + purchase + "::" + version + "::" + location)
       const query = `
       INSERT INTO inventory (D_type_id, SerialNo, PurchaseDate, Location_id, Version_id, Model_id)
       VALUES ('${d_type}', '${num}', '${purchase}', '${location}' , '${version}' , '${modelo}')
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
});
app.delete('/Inventory', async (req, res) => {
    try {
        console.log(req.body)
        const {itemId} = req.body
        await sql.connect(dbConfig);
        console.log('ID recibido en el backend:', itemId);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `DELETE FROM inventory WHERE Inventory_id = ${itemId} `;

        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }

        console.log(result)

        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
app.put('/Inventory', async (req, res) => {
    try {
        const { itemId, d_type, modelo, num, purchase, version, location } = req.body;
        console.log("XDDDDDDDD",req.body);
        if (itemId === undefined) {
            throw new Error("itemId is not defined in the request body");
          }
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query =`UPDATE inventory SET D_type_id='${d_type}', SerialNo= '${num}', PurchaseDate= '${purchase}', Location_id='${location}', Version_id='${version}', Model_id='${modelo}'
        WHERE Inventory_id = ${itemId}`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }
        console.log(result)
        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
//-------------------------INVENTORY SOURCE CRUD--------------------->
//-------------------------ProductsTable SOURCE CRUD MANAGEPRODUCTS--------------------->
app.get('/ProductsTable', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'SELECT D_type_id, D_type_description FROM DeviceType WHERE Active = 1';

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
//-------------------------ProductsTable SOURCE CRUD MANAGEPRODUCTS--------------------->
//-------------------------DeviceTypeTable SOURCE CRUD MANAGEPRODUCTS--------------------->
app.get('/DeviceTypeTable', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'SELECT D_type_id, D_type_description FROM DeviceType WHERE Active = 1 ';

        // Ejecutar la consulta
        const result = await sql.query(query);

        

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/DeviceTypeTable', async(req,res)=>{   
    try {
    await sql.connect(dbConfig);
        const {d_type} = req.body;
       const query = `If NOT exists (SELECT D_type_description FROM DeviceType WHERE D_type_description = '${d_type}' and ACTIVE = 1) 
       INSERT INTO DeviceType (D_type_description, Active) VALUES ('${d_type}', 1)`;
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
});
app.delete('/DeviceTypeTable', async (req, res) => {
    try {
        console.log(req.body)
        const {itemId} = req.body
        await sql.connect(dbConfig);
        console.log('ID recibido en el backend:', itemId);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `UPDATE DeviceType SET Active = 0 WHERE D_type_id = ${itemId} `;

        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }

        console.log(result)

        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
app.put('/DeviceTypeTable', async (req, res) => {
    try {
        const { itemId, d_type} = req.body;
        if (itemId === undefined) {
            throw new Error("itemId is not defined in the request body");
          }
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query =`UPDATE DeviceType SET D_type_description='${d_type}' WHERE D_type_id = ${itemId}`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }
        console.log(result)
        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
//-------------------------DeviceTypeTable SOURCE CRUD MANAGEPRODUCTS--------------------->
//-------------------------VersionTable SOURCE CRUD MANAGEPRODUCTS--------------------->
app.get('/VersionTable', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'SELECT Version_id, Version_description FROM Version WHERE Active = 1';

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.post('/VersionTable', async(req,res)=>{   
    try {
    await sql.connect(dbConfig);
        const {version} = req.body;
        console.log("VERSION: ", version);
       const query = `INSERT INTO Version (Version_description, Active) VALUES ('${version}', 1)`;
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
});
app.delete('/VersionTable', async (req, res) => {
    try {
        console.log(req.body)
        const {itemId} = req.body
        await sql.connect(dbConfig);
        console.log('ID recibido en el backend:', itemId);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `UPDATE Version SET Active = 0 WHERE Version_id = ${itemId}  `;

        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }

        console.log(result)

        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
app.put('/VersionTable', async (req, res) => {
    try {
        const { itemId, version} = req.body;
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query =`UPDATE Version SET Version_description='${version}' WHERE Version_id = ${itemId}`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }
        console.log(result)
        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
//-------------------------VersionTable SOURCE CRUD MANAGEPRODUCTS--------------------->
//-------------------------ModelsTable SOURCE CRUD MANAGEPRODUCTS--------------------->
app.get('/ModelsTable', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'SELECT Model_id, Model_description FROM Model WHERE Active = 1 ';

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.post('/ModelsTable', async(req,res)=>{   
    try {
    await sql.connect(dbConfig);
        const {modelo, d_type} = req.body;
        console.log("_-_-_", d_type);
       const query = `INSERT INTO Model (Model_description, Active) VALUES ('${modelo}', 1)`;
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
});
app.delete('/ModelsTable', async (req, res) => {
    try {
        console.log(req.body)
        const {itemId} = req.body
        await sql.connect(dbConfig);
        console.log('ID recibido en el backend:', itemId);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `UPDATE Model SET Active = 0 WHERE Model_id = ${itemId} `;

        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }

        console.log(result)

        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
app.put('/ModelsTable', async (req, res) => {
    try {
        const { itemId, modelo} = req.body;
        if (itemId === undefined) {
            throw new Error("itemId is not defined in the request body");
          }
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query =`UPDATE Model SET Model_description='${modelo}' WHERE Model_id = ${itemId}`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }
        console.log(result)
        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
//-------------------------ModelsTable SOURCE CRUD MANAGEPRODUCTS--------------------->
//-------------------------ModelsTable SOURCE CRUD MANAGEPRODUCTS--------------------->
app.post('/CategoriesModel', async(req,res)=>{   
    try {
    await sql.connect(dbConfig);
        const {modelo, d_type} = req.body;
        console.log("_-_-_", d_type);
       const query = `INSERT INTO [ModelDT] (Model_id, D_type_id) VALUES ('${modelo}', '${d_type}')`;
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
});
app.post('/CategoriesVersion', async(req,res)=>{   
    try {
    await sql.connect(dbConfig);
        const {version, d_type} = req.body;
        console.log("_-_-_", d_type);
       const query = `INSERT INTO [VersionDT] (Version_id, D_type_id) VALUES ('${version}', '${d_type}')`;
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
});
//-------------------------ModelsTable SOURCE CRUD MANAGEPRODUCTS--------------------->
//-------------------------LocationTable SOURCE CRUD MANAGEPRODUCTS--------------------->
app.get('/LocationTable', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = 'SELECT Location_id, Location_description FROM Location WHERE Active = 1';

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.post('/LocationTable', async(req,res)=>{   
    try {
    await sql.connect(dbConfig);
        const {location} = req.body;
       const query = `INSERT INTO Location (Location_description, Active) VALUES ('${location}', 1)`;
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
});
app.delete('/LocationTable', async (req, res) => {
    try {
        console.log(req.body)
        const {itemId} = req.body
        await sql.connect(dbConfig);
        console.log('ID recibido en el backend:', itemId);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `UPDATE Location SET Active = 0 WHERE Location_id = ${itemId} `;
        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }

        console.log(result)

        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
app.put('/LocationTable', async (req, res) => {
    try {
        const { itemId, location} = req.body;
        if (itemId === undefined) {
            throw new Error("itemId is not defined in the request body");
          }
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query =`UPDATE Location SET Location_description='${location}' WHERE Location_id = ${itemId}`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        if(result.rowsAffected == 0) {
            throw new Error("Not found")
        }
        console.log(result)
        // Enviar los resultados al cliente
        res.status(200).json({
            success: true,
            result: result.recordset
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});
//-------------------------LocationTable SOURCE CRUD MANAGEPRODUCTS--------------------->
//------------------------------APIS PARA SELECTS -------------------------->
app.get('/DeviceType', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT D_type_id, D_type_description FROM DeviceType WHERE Active = 1`;

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.get('/Location', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        

        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT Location_id, Location_description FROM Location WHERE Active = 1`;

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.get('/Model/:d_type', async (req, res) => {
    try {
        const {d_type}=req.params;
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `Select M.[Model_id], [Model_description] FROM [Nissan].[dbo].[Model] M
        inner join  [Nissan].[dbo].[ModelDT] MDT on M.Model_id = mdt.Model_id
        where mdt.D_type_id = ${d_type}`;
        // Ejecutar la consulta
        const result = await sql.query(query);
        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.get('/Version/:d_type', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const {d_type}=req.params;
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `Select V.[Version_id], [Version_description] FROM [Nissan].[dbo].[Version] V
        inner join  [Nissan].[dbo].[VersionDT] VDT on v.Version_id = vdt.Version_id
        where vdt.D_type_id = ${d_type}`;

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/ModelBasic', async (req, res) => {
    try {
        const {d_type}=req.params;
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT [Model_id]
        ,[Model_description]
    FROM [Nissan].[dbo].[Model]`;
        // Ejecutar la consulta
        const result = await sql.query(query);
        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
app.get('/VersionBasic', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const {d_type}=req.params;
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT [Version_id]
        ,[Version_description]
    FROM [Nissan].[dbo].[Version]`;

        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
//------------------------------APIS PARA SELECTS-------------------------->
app.listen(4000, () => {
    console.log('Servidor escuchando en el puerto 4000');
});

//------------------------------APIS PARA Módulo Security-------------------------->
app.get('/GovernGV', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 2`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/IdentifyID', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 3`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/ProtectPR', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 4`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/DetectDE', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 5`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/RespondsRS', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 6`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/RecoverRC', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 7`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});



app.get('/GovernGV', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 2`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/IdentifyID', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Aquí construyes tu consulta SELECT según tus necesidades
        const query = `SELECT F.[Function_description], C.[Category_name]
        ,C.[Category_description] , I.[CategoryIdentifier_name], F.Function_id  FROM [Function] F
        INNER JOIN [Categories] C on F.Function_id = C.Function_id
        INNER JOIN [CategoryIdentifier] I on I.Category_id = C.Category_id WHERE F.Function_id = 3`;
        // Ejecutar la consulta
        const result = await sql.query(query);

        // Enviar los resultados al cliente
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});




//------------------------------APIS PARA Módulo Security-------------------------->
