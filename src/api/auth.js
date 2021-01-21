const { authSecret } = require('../../.env')
const jwt = require('jwt-simple')
const bcrypt = require( 'bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {

        if (!req.body.nome || !req.body.password) {
            return res.status(400).send('dados incompletos')
        }

        const user = await app.db('users').where({nome: req.body.nome}).first()

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).send()
                }
                const payload = { id: user.id }
                res.json({
                    nome: user.nome,
                    token: jwt.encode(payload, authSecret)
                })
            })
        } else {
            res.status(400).send('problema na autenticação')
        }
    }
    return { signin }
}