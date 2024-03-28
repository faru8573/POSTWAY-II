import multer from "multer";
import path from "path";

const pathUrl = path.join(path.resolve(), "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathUrl);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });
export default upload;
