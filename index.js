const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signin = async ( user, password, expiresIn ) => {

    try {
        if(!user) return new Error("User not found");
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return new Error("Password is incorrect");
        delete user.password;
        const token = jwt.sign(
            user,
            process.env.JWT_SECRET || 'default-secret-123',
            { expiresIn: expiresIn || "1d" }
        );

        const response = {
            status: "success",
            token,
            data: {
                user,
            }
        }

        return response;
    }catch (error) {
        console.log(error)
        return new Error(error.message);
    }
}

const isAuthenticated = (token) =>{
    if(!token) return new Error('Access denied. No token provided.');
    try{
        return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-123');
    }catch(ex){
        return new Error("Invalid token");
    }
}

module.exports = {
    signin,
    isAuthenticated,
};