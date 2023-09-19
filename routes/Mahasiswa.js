const express = require('express');
const router = express.Router();

const connection = require('../config/db');

router.get('/',function(req,res){
    connection.query('select *from mahasiswa order by id_Maha desc',function(err, rows){
        if(err){
            return res.status(500).json({
                status:false,
                message: 'server failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message:'data mahasiswa',
                data:rows
            })
        }
    });
});
module.exports = router;