import mongoose = require("mongoose");
import * as bcrypt from 'bcrypt'
import { IUserInformation } from "../interfaces/IUser.interface";

 const  Users = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true, 
        unique : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true
    },
    appUser: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    documentUrl: {
        type: String,
        required: false
    },
})

Users.pre<IUserInformation>('save', async function(next){
try {
    
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(this.password, salt);

    console.log('pasword', hashPassword)

    this.password = hashPassword;


} catch (error) {
    next(error)
}
})

Users.methods.isValidPassword= async function (password, hashPassword) {
    try {
      return await bcrypt.compare(password, hashPassword)
    } catch (error) {
      throw error
    }
  }

export const UserSchema = mongoose.model<IUserInformation & mongoose.Document>('sample', Users)