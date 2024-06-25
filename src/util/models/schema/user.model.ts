import { Schema } from 'mongoose';

interface IUser {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: number;
    resetToken?: string;
    resetTokenExpiration?: Date;
    cart: {
        items: {
            productId: Schema.Types.ObjectId;
            quantity: number;
        }[];
    };
}

export { IUser };