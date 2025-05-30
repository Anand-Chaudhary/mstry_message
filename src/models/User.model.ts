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
    userName: string,
    email: string,
    password: string,
    veriyfiedCode: string,
    expiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/ , "Please use a valid email adress"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    veriyfiedCode:{
        type: String,
        required: [true, "Verify Code is required"],
    },
    expiry: {
        type: Date,
        required: [true, "Expiry feild should be filled"]
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
