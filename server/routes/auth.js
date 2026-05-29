const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const pool = require('../db')

const router = express.Router()
router.post('/register', async (req, res) => {
    try{
        const {name, email, password} = req.body
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if(result.rows.length > 0){
        return res.status(400).json({message: 'User already exists'})
    } else{
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword])
        res.status(201).json({message: 'User created successfully'})
    }
}catch(err){
    console.error(err)
    res.status(500).json({message: 'Server error'})
}

})

router.post('/login', async (req, res) => {
    try{
        const {name, email, password} = req.body
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(result.rows.length === 0){
            return res.status(400).json({message: 'Inavalid email or password'})
        } else{
            const user = result.rows[0]
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(400).json({message: 'Inavalid email or password'})
            } else{
                const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
                res.json({token})
            }
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Server error'})
    }
})


    
    
    

module.exports = router