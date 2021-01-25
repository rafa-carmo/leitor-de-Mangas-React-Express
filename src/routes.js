

module.exports = app => {
    app.post('/signin', app.src.api.auth.signin)
    app.post('/signup', app.src.controllers.userController.create)
    
    app.route('/del/user/:id')
    .all(app.src.config.passport.authenticate())
    .delete(app.src.controllers.userController.del)

    app.route('/fav')
    .all(app.src.config.passport.authenticate())
    .post( app.src.controllers.userController.fav)

    app.route('/mangas')
    .all(app.src.config.passport.authenticate())
    .post(app.src.controllers.mangasController.index)

    app.route('/mangas/remove/:id')
    .all(app.src.config.passport.authenticate())
    .put(app.src.controllers.userController.addRemoveVisto)


    app.route('/mangas/add')
    .all(app.src.config.passport.authenticate())
    .post(app.src.controllers.mangasController.create)

    app.route('/mangas/del/:id')
    .all(app.src.config.passport.authenticate())
    .delete(app.src.controllers.mangasController.delet)

    app.route('/mangas/upd')
    .all(app.src.config.passport.authenticate())
    .put(app.src.controllers.mangasController.update)


    app.route('/manga/:id')
    .all(app.src.config.passport.authenticate())
    .get(app.src.controllers.infoController.index)


    app.route('/usr/add/manga')
    .all(app.src.config.passport.authenticate())
    .post(app.src.controllers.infoController.addCap)

    app.route('/mangas/pg')
    .all(app.src.config.passport.authenticate())
    .post(app.src.controllers.infoController.readDir)


    app.route('/mangas/last')
    .all(app.src.config.passport.authenticate())
    .get(app.src.controllers.mangasController.lastReturn)



    app.route('/mangas/genre')
    .all(app.src.config.passport.authenticate())
    .get(app.src.controllers.mangasController.genreList)

}






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