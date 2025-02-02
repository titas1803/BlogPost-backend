import mongoose from "mongoose";

export const connectDB = () => {
  const connectionString = process.env.BLOGPOST_BACKEND_CONNECTION_STRING;
  const dbName = process.env.BLOGPOST_BACKEND_DBNAME
  if (connectionString && dbName) {
    mongoose.connect(connectionString, {
      dbName: dbName
    }).then((e) => console.log(`Connected to db ${process.env.BLOGPOST_BACKEND_DBNAME ?? ''}`)).catch(err => console.log(err));
  } else {
    throw new Error("Connection String or DB Name isn't speified");
  }
}