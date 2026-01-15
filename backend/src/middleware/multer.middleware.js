import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    filename:(req,file,cb) =>{
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = [".jpeg",".jpg",".png",".webp"].includes(ext) ? ext : "";
        const unique = `${Date.now()}-${Math.round() * 1e9}`;
        cb(null,`${unique}${safeExt}`);
    }
})

const fileFilter = (req,file,cb) =>{
    const allowedTypes = /jpg|jpeg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimeType)

    if(extname && mimeType){
        cb(null,true)
    }else{
        cb(new Error("Only image files are allowed - png/jpeg/jpg/webp"))
    }
}


export const upload =multer({
    storage,
    fileFilter,
    limits: {fileSize: 10*1024*1024}
})