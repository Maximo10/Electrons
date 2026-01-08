const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(express.json());

const uri="";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB Atlas");
    const db = client.db('Expendedora');
    return {      
      usuarios: db.collection('Productos') 
    };
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw new Error('Error al conectar a la base de datos');
  }
}
// Middleware para manejar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Ruta para obtener todos los empleados
app.get('/api/usuarios',async (req, res) => { 
  try {
    const { usuarios } = await connectToMongoDB();
    const empleados = await usuarios.find().toArray();
    console.log("lista"+empleados);    
    res.json(empleados);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: 'Error al obtener empleados' });    
  }
});

module.exports = app;