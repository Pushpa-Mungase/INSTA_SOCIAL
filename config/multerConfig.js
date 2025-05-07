const multer=require('multer');
const path = require('path');

const storage=multer.diskStorage({
    destination:(req, res, cb) =>{
        cb(null, 'uploads/');
    },
    filename:(req, file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));

    }
});

const filrFilter=(req,file,cb) =>{
    const allowedTypes=['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error('File type not suppoeted'), false);
    }
};

//multer upload configuration

const upload = multer({
    storage:storage,
    fileFilter:filrFilter,
    limits:{
        fileSize: 10 * 1024 * 1024
    }
});

module.exports=upload;

