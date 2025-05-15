const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const {verifyJWT} = require('./middleware/verifyJWT');
const { logger } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const app = express();
const http = require("http");
const authRoutes = require('./routes/api');
const Routes = require('./routes/api');
const { setupSocket } = require('./socket/socketIO');
//app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes); 
app.use('/api/changePass',authRoutes);
app.use('/ImageRealisation', express.static('ImageRealisation'));
app.use(verifyJWT);
app.use('/api', Routes); 
//app.use('/api/messages', Routes); // Assuming your authentication routes are under '/api/messages'
/*   socket io  */
const server = http.createServer(app);
setupSocket(server);
/*   fin socket  */
app.use('/api/messages', Routes); // Assuming your authentication routes are under '/api/addmessages'
app.use('/api/uploadfile', Routes);
// Start the server
const PORT = process.env.PORT;// You can change the port number as needed
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






