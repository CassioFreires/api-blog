import jwt from 'jsonwebtoken';

export const generateToken = (playload:object) => {
    const secretAccessToken = process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY;
    const secretRefreshToken = process.env.JWT_PRIVATE_KEY_REFRESH_TOKEN;
    
    if(!secretAccessToken) throw new Error("JJWT_PRIVATE_ACCESS_TOKEN_KEY não definida no .env");
    if(!secretRefreshToken) throw new Error("JWT_PRIVATE_KEY_REFRESH_TOKEN não definida no .env");


    const accessToken = jwt.sign(playload, secretAccessToken, {expiresIn: '15m'});
    const refreshToken = jwt.sign(playload, secretRefreshToken, {expiresIn: '7d'} );

    return {accessToken, refreshToken}

}   