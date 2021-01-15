const 
    monk = require('monk'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken')


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
    selectCollection: ( ( URI, name ) => {
        return ( _req, res, next ) => {  
            try{
                const collection = monk(URI).get(name)
                next()
            } catch (error){
                res.status(400).send(error.message)
            }     
        }   
    })
    ,
    findUserByEmail: ( ( collection, noUser=true ) => {
        return async (req, res, next) => {
            try {
                const { email } = req.body
                payload = await collection.findOne({ email })

                payload & noUser == true ? res.status(409).send({ error: 'User already exists!' })
                    : noUser == false & !payload ? res.status(404).send({ error: 'User not found!' })
                        : next()

            } catch (error) {
                res.status(400).send(error.message)
            }
        } 
    })
    ,
    createUser: ( async (req, res) => {
        try {       
            password = await bcrypt.hash(req.body.password, 10)
            req.body.password = password
            const payload = await user.insert(req.body)
            payload.password = undefined
            const token = jwt.sign({ _id: payload._id, email: payload.email }, secret, { expiresIn: 14400 })
            return res.status(201).json({ payload, token })
        } catch (error) {
            return res.status(400).send(error.message) 
        }
    })
    
}







