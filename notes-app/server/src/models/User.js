import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type:String, required:true },
  email: { type:String, required:true, unique:true, lowercase:true, index:true },
  passwordHash: { type:String, required:true }
}, { timestamps:true });

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model('User', userSchema);
