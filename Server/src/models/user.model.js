import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const SocialMediaUserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 50,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

SocialMediaUserSchema.pre("save",async function(next)
{   
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})


// we add method check is password is correct or not 

SocialMediaUserSchema.methods.isPasswordcorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

// this enough fast we do not added async before the fuction
SocialMediaUserSchema.methods.generateAccessToken = function()
{
    return jwt.sign(
        {
            _id : this._id,
            email:this.email,
            firstName:this.firstName,
            lastName:this.lastName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

SocialMediaUserSchema.methods.generateRefreshToken = function()
{
    return jwt.sign(
        {
            _id : this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const SocialMediaUser = mongoose.model("SocialMediaUser",SocialMediaUserSchema)


