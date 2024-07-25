import multer from "multer";
//setting up the multer engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;
