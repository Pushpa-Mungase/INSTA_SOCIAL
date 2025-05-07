const express = require("express");
const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const loginRoutes=require("./routes/loginRoutes");
const postRoutes=require("./routes/postRoutes");



connectDB();
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/auth",loginRoutes);
app.use("/api/v1/post",postRoutes)


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