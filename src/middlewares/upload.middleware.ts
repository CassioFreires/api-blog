import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Função para criar pasta se não existir
const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads"; // padrão
    console.log(file)

    // Define subpasta dependendo do tipo de arquivo
    if (file.fieldname === "avatar") folder = path.join("uploads", "imgAvatars");
    if (file.fieldname === "postImage") folder = path.join("uploads", "imgPosts");

    ensureDirExists(folder); // garante que a pasta exista
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};



export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});