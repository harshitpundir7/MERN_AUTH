const express = require('express')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {z, Schema} = require('zod')
const auth = require('../middleware/authMiddleware')

const zodSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Please include a valid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});
const loginSchema = z.object({
    email: z.string().email({ message: 'Please include a valid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

dotenv.config();

router.post('/register', async(req, res)=>{
    try{
        const {success,data} = zodSchema.safeParse(req.body);
       if(!success){
        return res.status(401).json({
            "msg" : "error"
        })
    }
    let user = await User.findOne({ email: data.email });

        if(user){
            return res.status(400).json({msg: "User already Exist"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);
        
        user = new User({
           name: data.name,
           email: data.email,
           password:hash

        });
        
        
        await user.save();
        
        const payload = {user: {id: user._id}};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '10h'});

        res.json({token});
        
    }catch(error){
        if (error.errors) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


router.post('/login', async(req, res)=>{
    try{
        const {success,data} = loginSchema.safeParse(req.body);
        if(!success){
            return res.status(401).json({
                "msg" : "error"
            })
        }
        const user = await User.findOne({email : data.email});
        if (!user) {
            return res.status(400).json({ msg: 'you know what, u have to register first so then go and do fucking registrsation' });
        }
        const isMatch =  bcrypt.compareSync(data.password,user.password);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token });
    }catch(error){
        
        console.error(error);
        res.status(500).send('Server error');
    }
})

router.get('/dashboard', auth, (req, res) => {
    res.json({ msg: `Welcome, user ${req.user.id}` });
});


module.exports = router;