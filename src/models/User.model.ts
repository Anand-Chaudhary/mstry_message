import mongoose, {Schema, Document} from "mongoose"

export interface Message extends Document{
    content: string, 
    date: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifiedCode: string,
    expiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/ , "Please use a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    verifiedCode:{
        type: String,
        required: [true, "Verification code is required"],
    },
    expiry: {
        type: Date,
        required: [true, "Expiry field should be filled"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)
export default UserModel;
