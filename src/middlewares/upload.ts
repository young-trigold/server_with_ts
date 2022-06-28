import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, _, cb) {
    cb(null, path.join(req.hostname, '../dist/assets/markdown/'));
  },
  filename(_, file, cb) {
    cb(null, `${file.originalname}_${Date.now()}`);
  },
});

const upload = multer({ storage }).single('file');

export default upload;
