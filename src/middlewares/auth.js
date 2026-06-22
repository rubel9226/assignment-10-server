const createError = require("http-errors"); 
const { jwtAccessKey, clientUrl } = require("../secret");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const { successResponse } = require("../controllers/response.controllers");

const isLoggedIn = async (req, res, next) => {
    try { 
        const token = req.headers.authorization; 
        console.log(token);

        if(!token){
            throw createError(401, 'Unauthorize')
        };
        const JWKS = createRemoteJWKSet(
            new URL(`${clientUrl}/api/auth/jwks`)
        );

        const response = await fetch(
            `${clientUrl}/api/auth/jwks`
        );

        const data = await response.json();
        const url = `${clientUrl}/api/auth/jwks`
        const newUrl = {url, data}

        return successResponse(res, {
            statusCode: 200,
            message: JWKS || "Public lessons fetched successfully.",
            payload: {JWKS:data, url, newUrl, token},
        });

        const { payload } = await jwtVerify(token, JWKS);
        
        if(!payload){
            throw createError(401, 'Invalid access token. Please login again.');
        }

        req.user = payload;
        next();
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}; 

const isAdmin = async (req, res, next) => {
    try {
        if(req.user.isAdmin == false){
            throw createError(403, 'Forbidden. You must be an admin to access this resource');
        }
        next();
    } catch (error) {
        return next(error)
    }
};

module.exports = { isLoggedIn, isAdmin}