const express = require('express');
const app = express();
const session = require('express-session');

const { collection , getDocs , updateDoc , doc , deleteDoc , getDoc, setDoc } = require('firebase/firestore/lite');
const clientsListImport = require('./clients')
const firebase = require('./firebase/configFirebase')
const db = firebase.db


const path = require('path');
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'd21193809',
  resave: false,
  saveUninitialized: true
}));


app.get('/', (req, res) => {

  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);

});

app.post('/', (req, res) => {
  try {
    const {email , key} = req.body

    if(email === 'diegotesteprog@gmail.com' && key === 'Teste193809'){
      res.redirect('/clientes')
    }else{
      console.log("login invalido")
    }
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: 'Erro no login' });
  }
});


app.get('/clientes', async (req, res) => {
  
  try {
    const clientList = await clientsListImport.getAll();
    res.render('clientes', { clients: clientList }); 
    }
  catch(error){

      console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: 'Erro ao obter os clientes' })

    }
});
app.get('/cliente/:id', async (req,res)=>{

  const clientId = parseInt(req.params.id, 10);
  const clientList = await clientsListImport.getAll();
  const client = clientList.find((c)=> c.id === clientId)



  if (!client) {
    return res.status(404).send('Cliente não encontrado.');
  }

  res.render('cliente', {client})
})

app.post('/update-cliente/:id', async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const { nome , sobrenome , email , tel } = req.body;

    const db = firebase.db;
    const clientsCol = collection(db, 'clientes');
    const clientSnapshot = await getDocs(clientsCol);

    let clientDocRef;
    clientSnapshot.forEach((doc) => {
      const clientData = doc.data();
      if (clientData.id === clientId) {
        clientDocRef = doc.ref;
      }
    });

    if (clientDocRef) {
      await updateDoc(clientDocRef, {
        Nome: nome,
        email: email,
        sobrenome: sobrenome,
        telefone: tel

      });
    } else {
      console.log('cliente Not found')
    }
    res.redirect('/clientes');
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: 'Erro ao atualizar o cliente' });
  }
});

app.post('/deleteclient', async (req, res) => {
  try {
    const clientId = parseInt(req.body.clientId, 10);

    if (isNaN(clientId)) {
      return res.status(400).send('ID do cliente inválido.');
    }

    const clientIdString = clientId.toString();

    const clientsCol = collection(db, 'clientes');
    const clientDocRef = doc(clientsCol, clientIdString);

    await deleteDoc(clientDocRef);

    res.redirect('/clientes');
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: 'Erro ao deletar o cliente' });
  }
});
app.get('/inputclient', (req,res)=>{


  res.render('addclient')
})
app.post('/addNewClient', async (req,res)=>{

  try{

    const { nome , sobrenome , email , tel} = req.body;
    let id = 0;

    const checkIfIdExists = async (idToCheck) => {
      const clientDocRef = doc(collection(db, 'clientes'), idToCheck.toString());
      const clientSnapshot = await getDoc(clientDocRef);
      return clientSnapshot.exists();
    };

    while (await checkIfIdExists(id)) {
      id++;
    }

    const clientDocRef = doc(collection(db, 'clientes'), id.toString());
    await setDoc(clientDocRef,{
      id: id,
      Nome: nome,
      sobrenome: sobrenome,
      telefone: tel,
      email: email
    })
    res.redirect('/clientes');
  } 
  catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: 'Erro ao adicionar o cliente' });
  }
})


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});