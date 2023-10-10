const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator')
const connection = require('../config/db');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req , file, cb)=>{
        cb(null,'public/image')
    },
    filename:(req ,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({storage:storage})

router.get('/',function(req,res){
    connection.query('SELECT mahasiswa.nama, jurusan.nama_jurusan '+'from mahasiswa join jurusan '+'ON mahasiswa.id_jurusan=jurusan.id_jurusan order by mahasiswa.id_Maha desc',function(err, rows){
        if(err){
            return res.status(500).json({
                status:false,
                message: 'server failed',
                error:err,
            })
        }else{
            return res.status(200).json({
                status:true,
                message:'data mahasiswa',
                data:rows
            })
        }
    })
});

router.post('/store',upload.single("gambar"), [
    //validation
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nama: req.body.nama,
        nrp: req.body.nrp,
        id_jurusan: req.body.id_jurusan,
        gambar: req.file.filename
    }
    connection.query('insert into mahasiswa set ?', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error:err,
            })
        }else{
            return res.status(201).json({
                status: true,
                message: 'Success..!',
                data: rows[0]
            })
        }
    })
})
router.get('/(:id)',function (req,res){
    let id = req.params.id;
    connection.query(`select *from mahasiswa where id_Maha = ${id}`,function(err,rows){
        if(err){
            return res.status(500).json({
                status:false,
                message:'server error',
            })
        }
        if(rows.length <-0){
            return res.status(404).json({
                status:false,
                message:'not found',
            })
        }
        else{
            return res.status(200).json({
                status:true,
                message: 'data mahasiswa',
                data:rows[0]
            })
        }
    })
})
router.patch('/update/:id', [
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama: req.body.nama,
        nrp: req.body.nrp,
        id_jurusan: req.body.id_jurusan
    }
    connection.query(`update mahasiswa set ? where id_Maha = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update berhasil..!'
            })
        }
    })
})
router.delete('/delete/(:id)',function(req , res){
    let id = req.params.id;
    connection.query(`delete from mahasiswa where id_Maha = ${id}`,function(err, rows){
        if(err){
            return res.status(500).json({
                status:false,
                message:'server eror',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'data sudah dihapus',
            })
        }
    })
})
module.exports = router;