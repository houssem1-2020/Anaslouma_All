const express = require('express')
const app = express()
const port = 3005
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
	cors:{
		origin:"http://localhost:3000", 
		methods:["GET" , "POST"]
	}
});


// io.on('connection', (socket) => {
  
//   socket.on('cmd-saved' , (data) => {
//   	socket.broadcast.emit('cmd-saved-notif', data)
//   })
// });



app.use(express.json());
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});



app.get('/', (req, res) => {
  res.send('ANASLOUMA.TN')
})


//Point de vente en gros 
const AnasloumaRouter = require('./Anaslouma/Anaslouma')
app.use('/Ansl', AnasloumaRouter)

//Point de vente en gros 
const AdminRouter = require('./Admin/Admin')
app.use('/Admin', AdminRouter)

//Point de vente en gros 
const PtVenteGrosRouter = require('./System/System')
app.use('/System', PtVenteGrosRouter)

//Point de vente en gros 
const PtVenteGrosInputRouter = require('./System/Camion')
app.use('/Camion', PtVenteGrosInputRouter)

//Point de vente en gros 
const CommandePtvGros = require('./System/Commandes')
app.use('/Commande', CommandePtvGros)


//Point de vente en gros 
const MgazinRouter = require('./Magazin/Magazin')
app.use('/Magazin', MgazinRouter)

//Point de vente en gros 
const CaisseRouter = require('./Magazin/Caisse')
app.use('/Caisse', CaisseRouter)

//Point de vente en gros 
const GerantRouter = require('./Magazin/Gerant')
app.use('/Gerant', GerantRouter)


//Point de vente en gros 
const Integration = require('./System/Integration')
app.use('/integ', Integration)


server.listen(port, () => {
  console.log(`Anaslouma API On Port:  ${port}`)
})