const 
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    monk = require('monk')


module.exports = {
    
    validateRequest: ( ( schema ) => {
        return async (req, res, next) => { 
            try{
                await schema.validateAsync(req.body)
                next()
            } catch (error){
                res.status(400).send(error.message)
            }        
        }       
    })
    ,
    findUserByEmail: ( ( name, URI, noUser=true ) => {
        return (req, res, next) => {
            try {
                const { email } = req.body
                collection = monk(URI).get(name)
                payload = undefined

                payload && noUser === true ? res.status(409).send({ error: 'User already exists!' })
                    : noUser === false && !payload ? res.status(404).json({ error: 'User not found!' })
                        : next()

            } catch (error) {
                res.status(400).send(error.message)
            }
        } 
    })
    ,
    createUser: ( async (name, URI) => {
        return async (req, res, next) => {
        try {
            collection = await monk(URI).get(name)
            await bcrypt.hash(req.body.password, 10).then(function (result) { req.body.passwod = result})
            // req.body.password = password
            // const payload = await collection.insert(req.body)
            // payload.password = undefined
            // const token = jwt.sign({ _id: payload._id, email: payload.email }, secret, { expiresIn: 14400 })
            // return res.status(201).json(req.body.password)
        } catch (error) {
            return res.status(400).send(error.message) 
            }
        }
    })
    
}







