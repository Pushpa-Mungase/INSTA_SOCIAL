const express = require("express");
const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const loginRoutes=require("./routes/loginRoutes");
const postRoutes=require("./routes/postRoutes");
const platformRoutes=require("./routes/platformRoutes.js");
const webhookRoutes = require('./routes/webhookRoutes.js');
const testRoutes = require("./routes/testRoutes");


const path = require("path");
require("dotenv").config();
const app = express();
const cors = require("cors");

// Enable All CORS Requests
app.use(cors());
//app.use(express.static("./"))

// app.use('/image', express.static('/uploads'));
// app.use('/video', express.static('/uploads'));
// app.use('/audio', express.static('/uploads'));


app.use('/image', express.static(path.join(__dirname, '/')));
app.use('/video', express.static(path.join(__dirname, '/')));
app.use('/audio', express.static(path.join(__dirname, '/')));

// If you want to allow only specific origins:
const corsOptions = {
  origin: 'http://localhost:5173', // frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // if you're using cookies or HTTP auth
};

app.use(cors(corsOptions));

connectDB();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.get("/test",(req,res)=>{
    res.status(200).send({
        status : true,
        msg: "ngrok tested!"
    })
})
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/auth",loginRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/platform",platformRoutes);

app.use('/api/v1/webhook', webhookRoutes);
app.use("/api/test/v1", testRoutes);



app.all("/api/*",(req,res)=>{
    res.status(404).send({
        status:false,
        msg: "please hit valid URL",
    });
});

app.use((err, req,res,next) =>{
    console.error(err.stack);
    res.status(500).send("Something broke!");
    
});
const PORT =  8000;
app.listen(PORT, () => {
        console.log(`Port running on Localhost ${PORT}`);
    });

// module.exports=app;
