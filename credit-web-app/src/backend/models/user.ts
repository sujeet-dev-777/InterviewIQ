import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    credits: number;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    credits: { type: Number, default: 0 }
});

const User = model<IUser>('User', userSchema);

export default User;