


module.exports= app => {


    const index = async (request, response) => {
        const { tipo,  ordem } = request.body;
    
     

        let mangas = await app.db('mangas')
        .orderBy(tipo, ordem)
        .select('*');


           for (let i = 0; i< mangas.length; i++){

                if (request.user.favoritos['favoritos']){

                    if (request.user.favoritos['favoritos'].includes(mangas[i].name)){

                        mangas[i].favorito = true

                    }
                    else{
                        mangas[i].favorito =false
                    }
            }
                if (request.user.mangas.mangas){


                for (let j = 0; j < request.user.mangas.mangas.length; j++){

                    

                    if (parseInt(request.user.mangas.mangas[j].id, 10) === mangas[i].id){
                        
    
                        mangas[i].capitulosRestantes =  mangas[i].totalCapitulos - request.user.mangas.mangas[j].total
                       
                    }

                    
            
            }

           }
        }
        return response.json(mangas)
}


const create = async (request, response)  => {

    //const {name, capitulos, folder, banner, rate, outrosTitulos, generos, autor, artista, sinopse, status} = request.body;

    const verify =  await app.db('mangas')
    .where('name', request.body.name)
    .select('name')
    .first()


    if (verify != undefined) {
        return response.status(400).json({"erro":"Manga já na lista"})
    }
    
    //const capitulosCount = capitulos.split(',')
    //const totalCapitulos = capitulosCount.length;

    let req = request.body
    const dataNow = new Date();
    let dia = dataNow.getDate();
    if (dia <= 9) {
        dia = "0"+dia
    }
    let mes = dataNow.setMonth(dataNow.getMonth() -3);
    if (mes <= 9) {
        mes = "0"+mes
    }
    const ano = dataNow.getFullYear();
    //`${ano}${mes}${dia}`
    req['ultima_alteracao'] = new Date()
    req['totalCapitulos'] = req.capitulos['1'].length;


    const addManga = await app.db('mangas')
    .returning('id')
    .insert(request.body)
    .then(data => {
        updLastManga(data[0], req.name, req.capitulos['1'][req.capitulos['1'].length - 1])
    })
    .then(_ => response.status(202).send())
    .catch(err => console.log(err))
    


    }


const delet = async (request, response) => {
        
        const manga = await app.db('mangas')
        .where('id', request.params.id)
        .delete()
        .then(rowDeleted => {
            if (rowDeleted > 0) {
                response.status(204).send()
            }else{
                const  msg = `Erro ao apagar o manga`
                response.status(400).send(msg)
            }
        })


    }

const update = async (request, response) => {

    
        const mangaCapitulos = await app.db('mangas')
        .where('id', request.body.id)
        .select(['capitulos', 'totalCapitulos', 'name'])
        .first()
        .catch(err => response.status(400).json(err))



        if (!mangaCapitulos){
            return response.status(400).send('id invalido')
        }
        
        let capitulos = mangaCapitulos["capitulos"]


        if (capitulos['1'].includes(request.body.capitulo)){
            return response.status(200).json("capitulo ja na lista")
        }




        
        const str_data = new Date()
        capitulos['1'].push(request.body.capitulo)

        capitulos['1'].sort()
        
       totalCapitulos = `${capitulos['1'].length}`;


        
        const updCapitulo = await app.db('mangas')
        .where('id', request.body.id)
        .update({
            'capitulos': capitulos, 
            totalCapitulos,
            'ultima_alteracao': str_data
        })
        .then(data => {
            updLastManga(request.body.id, mangaCapitulos["name"], request.body.capitulo)
        })
        .then(_ => response.status(202).send())
        .catch(err => response.status(500).json(err))

        

    }
    

    
const updLastManga = async ( id, name, chapter) => {

    const list = await app.db("last_mangas")
    .select('*')

    const created = new Date()

    if(list.length >= 13) {
       

        app.db('last_mangas')
        .where('id', list[0].id)
        .del()
        .then(rowDeleted => {
            if (rowDeleted > 0) {
               
            }
        })
        .catch(err=> console.log(err))
    }




    app.db('last_mangas')
    .insert({name, chapter, created,  mangaId: id})
    .catch(err => console.log(err))

}


const lastReturn = async ( request, response ) => {
    app.db('last_mangas')
    .orderBy('created', 'desc')
    .select('*')
    .then(data => response.status(200).json(data))
    .catch(err => response.status(500).json(err))


}


const genreList = async (request, response) => {
    const allMangas = await app.db('mangas')
    .select('generos')


    let listGenres = []
    for (let c = 0; c < allMangas.length; c++) {



        for (let d = 0; d < allMangas[c]['generos']['generos'].length; d++){

                if (!listGenres.includes(allMangas[c]['generos']['generos'][d].trim())) {

                    listGenres.push(allMangas[c]['generos']['generos'][d].trim())
                }
        
        }
    }
    return response.status(200).json({listGenres})
    
    
}



    return {index, create, delet, update, lastReturn, genreList}
}