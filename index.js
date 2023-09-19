const express = require('express')
const app = express()
const port = 3000


const mhsrouter = require('./routes/Mahasiswa');
app.use('/api/mhs',mhsrouter);

app.listen(port,()=>{
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})