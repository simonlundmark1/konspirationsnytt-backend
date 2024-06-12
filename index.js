require('dotenv').config();  // Lägger till detta för att hantera miljövariabler
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));  // Antag att 'public' är mappen där din HTML-fil och andra resurser finns

// Ange vilka origins som ska tillåtas
const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
        optionsSuccessStatus: 200, // vissa legacy webbläsare (IE11, olika SmartTVs) hanterar 204-statusen dåligt
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true // Om du använder cookies eller autentisering med sessions
      
  };


  app.use(cors(corsOptions)); // Använd dessa CORS-inställningar

// Importera authenticateToken middleware
const authenticateToken = require('./middleware/authenticateToken');

// Import routes
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');

// Använd authenticateToken middleware för att skydda postsRoutes
app.use('/users', usersRoutes);
app.use('/posts', authenticateToken, postsRoutes);  // Skydda denna route med JWT

const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
