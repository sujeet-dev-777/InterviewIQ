import multer from "multer";
import os from "os";

// Serverless filesystems are read-only except for the OS temp directory
const uploadDir = process.env.VERCEL ? os.tmpdir() : "public"

const storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , uploadDir)
    },
    filename: function(req , file , cb){
        const filename = Date.now() + "-" + file.originalname;
        cb(null , filename)
    }
})


export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
