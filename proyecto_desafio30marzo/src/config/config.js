const dotenv = require("dotenv");

dotenv.config();

const {PORT, DB_NAME, MONGO_URL, API_PREFIX, COOKIE_SIGN, SECRET_SESSION, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = process.env; 

module.exports = {
    PORT, 
    DB_NAME, 
    MONGO_URL, 
    API_PREFIX, 
    COOKIE_SIGN, 
    SECRET_SESSION,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    
}