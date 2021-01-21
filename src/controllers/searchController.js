
module.exports= app => {

    const index  =  async (request, response)  => {


        const {name} = request.body

        let mangas = await app.db('mangas')
        .where('name', 'like', `%${name}%`)
        .select('*')

        const userDb = await connection('users')
        .where('id', request.user.id)
        .select('mangas')
        .first()

        const user = userDb["mangas"]

        for (let i = 0; i< mangas.length; i++){
            for (let j = 0; j < user.length; j++){
                if (user[j].nome == mangas[i].name){
                    mangas[i].totalCapitulos =  mangas[i].totalCapitulos - user[j].total
                }
            }
        }


        response.status(200).json(mangas)

    }
    return {index}
}