

module.exports = app => {
    app.post('/signin', app.src.api.auth.signin)
    app.post('/signup', app.src.controllers.userController.create)
    
    app.route('/del/user/:id')
    .all(app.src.config.passport.authenticate())
    .delete(app.src.controllers.userController.del)

    app.route('/fav')
    .all(app.src.config.passport.authenticate())
    .post( app.src.controllers.userController.fav)

}





// const express = require('express');

// const routes = express.Router();
// const MangasController = require('./controllers/mangasController')
// const UsersController = require('./controllers/userController')
// const InfoController = require('./controllers/infoController')
// const SearchController = require('./controllers/searchController')

// routes.post('/mangas', MangasController.index);
// routes.post('/mangas/add', MangasController.create)
// routes.delete('/mangas/del/:id', MangasController.delete)
// routes.put('/manga/update', MangasController.update)

// routes.get('/manga/:name', InfoController.index)
// routes.post('/files/info', InfoController.info)
// routes.put('/user/add/manga', InfoController.adicionCapitulo)
// routes.get('/user/lidos', InfoController.capitulosLidos)

// routes.get('/user', UsersController.index)
// routes.post('/user/verify', UsersController.verify)
// routes.post('/user/add', UsersController.create)
// routes.put('/user/upd/manga', UsersController.updateManga)
// routes.delete('/user/delete', UsersController.delete)
// routes.post('/user/favorito', UsersController.favorito)

// routes.post('/busca', SearchController.index)

// module.exports = routes;