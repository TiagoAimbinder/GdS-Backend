import { connection } from './src/config/db.js'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { config } from 'dotenv'
import { routeIndex } from './src/routes/route.Index.js'
import path from 'path'
import { fileURLToPath } from 'url'

config();

// Express configuration: 
const app = express(); 

// Middlewares:
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MDS. Content-Type, Date, X-Api-Version, Authorization',
    credentials: true,
    optionsSuccessStatus: 200,
}; 

app.use(cors(corsOptions)); 

// Body parsers: 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handling OPTIONS requests
app.options('*', cors(corsOptions));  

// Routes API Configuration
app.use('/', routeIndex);

// Directory where the images will be stored
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const PORT = process.env.PORT || 3003;
server.listen(PORT, ()=> {
    console.log(`Servidor express escuchando en el puerto: ${PORT}`);
});

connection();