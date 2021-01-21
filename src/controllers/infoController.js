

const fs = require('fs');

function readDir(dir){

    let struct = {}

    fs
        .readdirSync(dir)
        .sort((a, b) => fs.statSync(dir +"/"+ a).mtime.getTime() - fs.statSync(dir +"/"+ b).mtime.getTime())
        .forEach(file => {

            if( fs.lstatSync(dir+"/"+file).isFile() ){
                struct[file] = null
            }
            else if( fs.lstatSync(dir+"/"+file).isDirectory() ){
                struct[file] = readDir(dir+"/"+file)
            }

        })

    return struct

}



module.exports= app => {


    const index = async (request, response) => {


        const manga = await app.db('mangas')
        .where('name', request.params.name)
        .select('*')
        .first()
        .catch(err => response.status(500).json(err))


        

        const objUser = request.user.mangas

		for (let i = 0; i < objUser.length; i++){
            if (request.params.name === objUser[i]['nome']){
                var lista = objUser[i]["capitulos"].sort(function(a, b){return a-b})
                break
            }
        }

        if (!lista){
            var lista = []
        }
        

        const capitulos = manga.capitulos['1'].sort(function(a, b){return a-b})

        if (!manga) {
            response.json("ID nao encontrado")
        }
        response.json([manga, capitulos, lista])

    }

//??
    const readDir = async (request, response) => { 

        const {nome, capitulo} = request.body


        const files = fs.readdirSync(`../mangas/${nome}/${capitulo}`)
        const capitulos = await app.db('mangas')
        .where('name', nome)
        .select('capitulos')
        .first()

        const capitulosOrdenados = capitulos["capitulos"].split(',').sort(function(a, b){return a-b})
        const filesSorted= files.sort()

        const data = {
            capitulosOrdenados,
            filesSorted

        }


        return response.json(data)
    }

    const addCap =  async (request, response) => {

        const { nome, capitulo } = request.body;

        const listaDB =  await app.db('users')
        .where('id', request.user.id)
        .select('mangas')
        .first()

        

        //cria novo campo no banco de dados para mangas
        if (Object.keys(listaDB['mangas']).length == 0) {
            
            const mangas = {'mangas': [ {'nome':nome,'total':1,'capitulos': [capitulo] } ] }
            console.log(mangas, listaDB)
            const updCapitulo = await app.db('users')
            .where('id', request.user.id)
            .update({mangas})
            .then(_ => response.status(202).send())
            .catch(err => response.status(500).json(err))
            
        return
        }
        

        let listaJson = listaDB["mangas"]["mangas"]

        //verifica se manga esta na lista
        let key = null
        for (let i = 0; i < listaJson.length; i++) {
            
            if (listaJson[i]["nome"] == nome) {
                key = i
                
            }
        }
            
        //Adiciona manga que nao esta na lista
        if (key == null){

            listaJson.push({'nome':nome,'total':1,'capitulos': [capitulo] })
            const mangas = {'mangas':listaJson }

        

            const updCapitulo = await app.db('users')
            .where('id', request.user.id)
            .update({mangas})
            .then(_ => response.status(200).send("Manga adicionado"))
            .catch(err => response.status(500).json(err))
            return
        }


        for (let i = 0; i < listaJson[key]["capitulos"].length; i++) {
            if (listaJson[key]["capitulos"][i] === capitulo){
                listaJson[key]["capitulos"].splice(i,1)
                listaJson[key]["total"] = listaJson[key]["capitulos"].length

                return response.status(400).json("Manga já na lista")    
            }
        }

        //Adiciona novo capitulo na lista e atualiza total de capitulos
        listaJson[key]["capitulos"].push(capitulo)
        listaJson[key]["total"] = listaJson[key]["capitulos"].length

        const mangas = {'mangas':listaJson }
        const updCapitulo = await app.db('users')
        .where('id', request.user.id)
        .update({mangas})
        .then(_ => response.status(202).send())
        .catch(err => response.status(500).json(err))
        
        return 
                
    
        
    }

    const capRead = async (request, response) => {
        const {id, mangaId} = request.body

        const user = await app.db('users')
        .where('id', id)
        .select('mangas')
        .first();

        

        for (let i = 0; i < objUser.length; i++){
            if (mangaId === objUser[i]['nome']){
                return response.json(objUser[i]["capitulos"].sort(function(a, b){return a-b}))
            }
        }
        return response.status(200).send()


    }

    return { index, addCap, readDir }
}