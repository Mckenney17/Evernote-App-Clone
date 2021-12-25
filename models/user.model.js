const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        required: true,
    },
    verificationToken: {
        type: String,
        required: false,
    },
    passwordResetToken: {
        type: String,
        required: false,
    },
    passwordResetTokenExpires: {
        type: Date,
        required: false,
    },
})

UserSchema.methods = {
    async updateUser(pathsObj) {
        for (const [key, value] of Object.entries(pathsObj)) {
            this[key] = value
        }
        await this.save()
    }
}

UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model('User', UserSchema)
