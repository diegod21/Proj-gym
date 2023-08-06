const { collection, getDocs } = require('firebase/firestore/lite');
const db = require('./firebase/configFirebase').db;

async function getAll() {
  try {
    const clientsCol = collection(db, 'clientes');
    const clientSnapshot = await getDocs(clientsCol);
    const clientList = clientSnapshot.docs.map(doc => doc.data());
    return clientList;
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    throw error;
  }
}

module.exports = {
  getAll
};
