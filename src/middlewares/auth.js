const createError = require("http-errors"); 
const { jwtAccessKey, clientUrl } = require("../secret");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const { successResponse } = require("../controllers/response.controllers");

const isLoggedIn = async (req, res, next) => {
    try { 
        const token = req.headers.authorization;  

        if(!token){
            throw createError(401, 'Unauthorize')
        };

        const JWKS = createRemoteJWKSet(
            new URL(`${clientUrl}/api/auth/jwks`)
        ); 

        const { payload } = await jwtVerify(token, JWKS);
        
        if(!payload){
            throw createError(401, 'Invalid access token. Please login again.');
        }

        req.user = payload;
        next();
    } catch (error) {
        console.log(error?.message)
        next(error)
    }
}; 

const isAdmin = async (req, res, next) => {
    try {
        // console.log(req?.user?.isAdmin);
        if(req?.user?.isAdmin !== true){
            throw createError(403, "User can't access.");
        }
        next();
    } catch (error) {
        return next(error)
    }
};

module.exports = { isLoggedIn, isAdmin}