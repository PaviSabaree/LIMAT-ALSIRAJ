import { Request, Response } from 'express'
import * as jwt from "jsonwebtoken";

const authenticateToken = (req: Request, resp: Response, next) => {
    
   console.log('came to auth')
    const authHeader = req.headers['authorization']
    const token = authHeader
    if (token == null) return resp.sendStatus(401)

    console.log('token ==', token)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return resp.sendStatus(403)
      // req.user = user
      next()
    })
    next()
}

export default authenticateToken;