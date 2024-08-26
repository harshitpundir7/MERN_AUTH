const express = require("express")
const connectDB = require('./config/db')
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require('./routes/auth');
const port = process.env.PORT
const app = express();
const middleware = require("./middleware/authMiddleware");
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);

  

app.get('/', (req, res)=>{
    res.send("API is running ...")
});
app.listen(port, ()=>{
  console.log(`Servr starter at port ${port}` )
});