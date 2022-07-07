import multer from 'multer';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const storage = multer.diskStorage({
  destination(req, _, cb) {
    const isDevEnv = process.env.NODE_ENV === 'development';
    const uploadURL = isDevEnv
      ? path.join(__dirname, '../dist/assets/markdown/')
      : path.join(req.hostname, '../dist/assets/markdown/');
    cb(null, uploadURL);
  },
  filename(_, file, cb) {
    cb(null, `${file.originalname}_${Date.now()}`);
  },
});

const upload = multer({ storage }).single('file');

export default upload;
