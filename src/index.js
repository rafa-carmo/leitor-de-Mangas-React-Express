const express = require('express');

const db = require('./config/db')
const app = express();
const consign = require('consign')
const path = require('path')

consign()
.include('./src/config/passport.js')
.then('./src/config/middlewares.js')
.then('./src/api')
.then('./src/controllers')
.then('./src/routes.js')
.into(app)


app.db = db


app.use('/imagens/mangas', express.static(path.join(__dirname, 'mangas')))

app.listen(3333);