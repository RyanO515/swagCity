var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;

// user schema fields

var userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: {
		type: String
	},
	profile: {
		name: {
			type: String,
			default: ''
		},
		picture: {
			type: String,
			default: ''
		}
	},
	address: String,
	history: [{
		date: Date,
		paid: {
			type: Number,
			default: 0
		}
	}]
});



// hash password before saving to database
userSchema.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	} 
	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) {
				return next(err);
			} 
			user.password = hash;
			next();
		});
	});
});

// compare password in database to one user typed in

userSchema.methods.authenticate = function (password) {
	return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model("User", userSchema);










