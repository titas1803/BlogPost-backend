import multer from "multer";
import { v4 } from "uuid";
import fs from "fs"
import { ICustomRequest } from "../utilities/types.js";

const storage = multer.diskStorage({
  async destination(req: ICustomRequest, _file, callback) {
    let folderName = '[userId]';
    if (req.user) {
      folderName = req.user.userId;
    }
    const filePath = `uploads/${folderName}`;
    fs.mkdirSync(filePath, { recursive: true });
    callback(null, filePath);
  },
  filename(_req, file, callback) {
    const id = v4();
    const fileExtension = file.originalname.split('.').pop();
    callback(null, `${id}.${fileExtension}`);
  },
});

export const singleUpload = multer({ storage }).single('photo');
export const multiUpload = multer({ storage }).array('images');