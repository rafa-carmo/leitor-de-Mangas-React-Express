const cors = require('cors')
const express =  require('express')
const path = require('path');

module.exports = app => {
    app.use(express.json());
    app.use(cors({
        origin: '*'
    }))


    app.use('/imagens/mangas', express.static(path.join(__dirname,'..', 'mangas')))

}