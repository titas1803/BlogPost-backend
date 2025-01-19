import mongoose from "mongoose";

export const connectDB = () => {
  mongoose.connect(process.env.CONNECTION_STRING ?? '', {
    dbName: process.env.DBNAME ?? ''
  }).then((e) => console.log(`Connected to db ${process.env.DBNAME ?? ''}`)).catch(err => console.log(err));
}