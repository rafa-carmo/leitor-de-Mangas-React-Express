


module.exports= app => {


    const index = async (request, response) => {
        const { tipo,  ordem } = request.body;
    
     

        let mangas = await app.db('mangas')
        .orderBy(tipo, ordem)
        .select('*');
		
		if (!request.user.id){

			return response.json(mangas)
        }
        
        

           for (let i = 0; i< mangas.length; i++){

            if (request.user.favoritos['favoritos']){

            if (request.user.favoritos['favoritos'].includes(mangas[i].name)){

                mangas[i].favorito = true

            }
            else{
                mangas[i].favorito =false
            }
        }

            for (let j = 0; j < request.user.mangas.length; j++){
                if (user[j].nome == mangas[i].name){
                    mangas[i].totalCapitulos =  mangas[i].totalCapitulos - user[j].total
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

    await app.db('mangas')
    .insert(request.body)
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
        .select(['capitulos', 'totalCapitulos'])
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
        .then(_ => response.status(202).send())
        .catch(err => response.status(500).json(err))

        

    }

    return {index, create, delet, update}
}