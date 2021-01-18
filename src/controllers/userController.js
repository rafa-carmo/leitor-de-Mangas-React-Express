
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    
    const getHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }


   const  create = async(request, response) => {

        getHash(request.body.password, async hash => {
            const password = hash


            const verify =  await app.db('users')
            .where('nome', request.body.nome)
            .first()
    
            if (verify > 0) {
                return response.status(400).json({"erro":"Nome de usuario ja existe"})
            }
    
            const ultimo_acesso = new Date()
            const mangas = {}
            const favoritos = {}
            
            await app.db('users').insert({
                nome: request.body.nome, 
                password,
                favoritos,
                ultimo_acesso,
                mangas
                
            })
            .then(_ => response.status(202).send())
            .catch(err => response.status(500).json(err))


        })
       

    }

    const del = async (request, response) => {

        const listaDB =  await app.db('users')
        .where('id', request.params.id)
        .delete()
        .then(rowDeleted => {
            if(rowDeleted > 0){
                response.status(204).send()
            }else{
                response.status(400).send('Usuario não encontrado')
            }
        })
        .catch(err => response.status(400).json(err))
        

        

    }
    
    const updateManga = async (request, response) => {

        const { id, nome, capitulo } = request.body;

        const listaDB =  await app.db('users')
        .where('id', id)
        .select('mangas')
        .first()


        //cria novo campo no banco de dados para mangas
        if (listaDB["mangas"] == null) {
            
            const listaUpd = [{"nome":nome,"total":1,"capitulos":[capitulo]}]
            
            const updCapitulo = await app.db('users')
            .where('id', id)
            .update({'mangas': JSON.stringify(listaUpd)})
            
        return response.json(listaUpd)
        }
        

        let listaJson = JSON.parse(listaDB["mangas"])

        //verifica se manga esta na lista
        let key = null
        for (let i = 0; i < listaJson.length; i++) {
            
            if (listaJson[i]["nome"] == nome) {
                key = i
                
            }
        }
            
        //Adiciona manga que nao esta na lista
        if (key == null){

            const novo = {"nome":nome,"total":1,"capitulos":[capitulo]}
            listaJson.push(novo)

            const updCapitulo = await app.db('users')
            .where('id', id)
            .update({'mangas': JSON.stringify(listaJson)})
            return response.status(200).json(listaJson)
        }


        //** verifica se capitulo ja esta na lista, Se estiver ira remover da lista
        
        for (let i = 0; i < listaJson[key]["capitulos"].length; i++) {
            if (listaJson[key]["capitulos"][i] === capitulo){
                listaJson[key]["capitulos"].splice(i,1)
                listaJson[key]["total"] = listaJson[key]["capitulos"].length
                const updCapitulo = await app.db('users')
                .where('id', id)
                .update({'mangas': JSON.stringify(listaJson)})

                return response.status(200).json(listaJson)    
            }
        }

        //Adiciona novo capitulo na lista e atualiza total de capitulos
        listaJson[key]["capitulos"].push(capitulo)
        listaJson[key]["total"] = listaJson[key]["capitulos"].length

        const updCapitulo = await app.db('users')
        .where('id', id)
        .update({'mangas': JSON.stringify(listaJson)})
        
        return response.status(200).json(listaJson)
                
    
        
    }

    const verify = async (request, response) => {
        const {id} = request.body

        if (id){
        let user = await app.db('users')
        .where('nome', id)
        .select(['id', 'nome', 'mangas'])
        .first();

        if (user == '') {
        user = await app.db('users')
        .where('id', id)
        .select(['id', 'nome','mangas'])
        .first();;
        }

        if (user == '') {return response.status(400).json("Usuario nao encontrado")}
        return response.status(200).json(user)
        }
      
    }

    const fav = async (request, response) => {


        // const manga = await app.db('mangas')
        // .where('name', request.body.manga)
        // .select('*')
        // .first()
        

        // if(!manga){
        //    return response.status(400).send("manga não encontrado")
        // }
        
        const user = await app.db('users')
        .where('id', request.user.id)
        .select('favoritos')
        .first()


        if (!user["favoritos"]  == ''){
            const favoritos = {favoritos: request.body.manga}


            const upd = await app.db('users')
            .where('id',  request.user.id)
            .update(favoritos)
            .then(response.status(202).send())
            .catch(err => response.status(500).json(err))

            
        }


        let favoritos = user["favoritos"].split(',')
        
        for (i = 0; i < favoritos.length; i++){
            if (favoritos[i] === request.body.manga){
                favoritos.splice(i)
                const upd = await app.db('users')
                .where('id', id)
                .update({'favoritos': favoritos.sort().join(',')})
                return response.status(200).json("Removido")
            }
        }

    
        favoritos.push(request.body.manga)

      
        const upd = await app.db('users')
        .where('id', request.user.id)
        .update({'favoritos': favoritos.join(',')})
 
        return response.status(200).json("Adicionado")
    }

    return { create, del, updateManga, verify, fav}
}