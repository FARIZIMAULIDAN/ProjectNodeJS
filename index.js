const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors());
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'Public/image')))

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({extended: false}));
app.use(bodyPs.json()); 


const mhsrouter = require('./routes/Mahasiswa');
app.use('/api/mhs',mhsrouter);
const jrsrouter = require('./routes/jurusan');
app.use('/api/jrs',jrsrouter);

const auth = require('./routes/auth/auth');
app.use('/api/auth',auth);

app.listen(port,()=>{
    console.log(`aplikasi berjalan di http:://localhost:${port}`)
})