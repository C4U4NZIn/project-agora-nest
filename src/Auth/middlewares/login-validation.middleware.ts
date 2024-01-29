/*
import { Injectable, NestMiddleware, } from "@nestjs/common";

import { User } from '../../entities/user.entity'

import { Request,Response,NextFunction } from "express";

import { logginRequestBody } from "../models/LoginRequestBody";

import { json } from "stream/consumers";

@Injectable()
export class loggerValidationMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next:NextFunction) {
         
    const body = req.body;

    const LoginRequestBody = new logginRequestBody();
    
    LoginRequestBody.email = body.email;
    LoginRequestBody.password = body.password;

        
    
     
        next();
    }
}
*/