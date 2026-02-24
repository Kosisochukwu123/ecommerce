// import mongoose from "mongoose";


// export const connectDB = async() => {

//  try {
//     const conn = await mongoose.connect(process.env.mongo_URI)
//     console.log(`mongoDb connected ${conn.connection.host}`);
    
//  } catch (err) {
//     console.log(err);
//     process.exit(1);
//  }

// }

// const mongoose = require("mongoose");

import mongoose from "mongoose";

// Two separate database connections
let usersDB;
let productsDB;

export const connectUsersDB = async () => {

  if (usersDB) return usersDB; // already connected → reuse
  
  try {
    usersDB = await mongoose.createConnection(process.env.mongo_URI).asPromise();
    console.log(`Users DB connected: ${usersDB.host}`);
    return usersDB;
  } catch (error) {
    console.error(` Users DB failed: ${error.message}`);
    process.exit(1);
  }
};

 export const connectProductsDB = async () => {
  try {
    productsDB = await mongoose.createConnection(process.env.mongo_URI_products).asPromise();
    console.log(` Products DB connected: ${productsDB.host}`);
    return productsDB;
  } catch (error) {
    console.error(`Products DB failed: ${error.message}`);
    process.exit(1);
  }
};

export const getUsersDB = () => usersDB;
export const getProductsDB = () => productsDB;

export default {
  connectUsersDB,
  connectProductsDB,
  getUsersDB,
  getProductsDB,
};