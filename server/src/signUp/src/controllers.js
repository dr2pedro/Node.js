const 
    monk = require('monk'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    joi = require('joi')


module.exports = {
    
    validateRequest: ( async (  req, res, next, schema ) => {
       try{
            await schema.validateAsync(req.body)
            return next()
        } catch (error){
            return res.status(400).send(error.message)
        }                
    })
    ,
    selectColletion: ( (req, res, next, URI, name) => {
        try{
            const collection = monk(URI).get('name')
            return {collection, next()}
        } catch (error){
            return res.status(400).send(error.message)
        }                
    })
    ,
    findUser: ( async (  req, res, next, collection, noUser=true, key) => {
        try {  
            const 
                { key } = req.body,
                payload = await colletion.findOne({ key })
            
            return payload & noUser=true ? res.status(409).send({ error: 'User already exists!' })
                   : noUser=false & !payload ? res.status(404).send({ error: 'User not found!' })
                   : next()
            
        } catch (error) {
            return res.status(400).send(error.message)
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







