// models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: {
//     type: String,
//     unique: true, // Ensure email is unique
//   },
//   password: String, // You should hash the password before storing it
// });

// module.exports = mongoose.model('User', userSchema);
// models/User.js
const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  password: String,
  tokens:[
    {
      token: {
        type:String,
        required:true
      }
    }
  ]
});

userSchema.pre('save',async function(next){

if(this.isModified('password')){
this.password= await bcrypt.hash(this.password,12);
}
next();
})

userSchema.methods.generateAuthToken = async function(){
  console.log("hi");
  try{

    let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
   
    this.tokens = this.tokens.concat({token :token});
   await this.save();
   return token;
  } catch(err){
    console.log(err);
  }
}

module.exports = mongoose.model('User', userSchema);
