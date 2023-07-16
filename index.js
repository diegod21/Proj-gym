const express = require('express')
const firestore = require('./firebase/configFirebase.js')

const app = express()
const path = require('path')
const PORT = 3000

app.get('/',(req,res)=>{

    const indexPath = path.join(__dirname, 'index.html')
    res.sendFile(indexPath)
})

app.get('/clientes', async (req,res)=>{
    const snapshot = await firestore.colletion('clients-gym').get()
    console.log(snapshot)

})


app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})

https://www.freecodecamp.org/news/cannot-use-import-statement-outside-a-module-react-typescript-error-solved/#:~:text=In%20this%20article%2C%20we%20talked,attribute%20in%20a%20script%20tag.