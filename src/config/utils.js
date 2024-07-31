import jwt from 'jsonwebtoken'; 


const secret = process.env.SECRET_KEY;
const authJWT = async (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if(authHeaders) {
        const token = (authHeaders.split(' ')[1]);
        jwt.verify(token, secret, (err, user) => { 
            if(err){
                return res.status(403).json({ errCode: 'GS-JWT01'});
            }
            req.user = user;
            next();
        })
    } else{
        return res.status(401).json({ errCode: 'GS-JWT01'});
    }
}

export {
    authJWT, 
}