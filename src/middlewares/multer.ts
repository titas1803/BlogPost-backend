import multer from "multer";
import { v4 } from "uuid";
import fs from "fs"
import { ICustomRequest } from "../utilities/types.js";
import Users from "../models/users.model.js";

const storage = multer.diskStorage({
  async destination(req: ICustomRequest, _file, callback) {
    let userName = req.body['userName'];
    if (req.user) {
      const user = await Users.findById({ _id: req.user?.userId });
      userName = user?.userName ?? userName;
    }
    const filePath = `uploads/${userName}`;
    fs.mkdirSync(filePath, { recursive: true });
    callback(null, filePath);
  },
  filename(_req, file, callback) {
    const id = v4();
    const fileExtension = file.originalname.split('.').pop();
    callback(null, `${id}.${fileExtension}`);
  },
});

export const singleUplaod = multer({ storage }).single('photo');