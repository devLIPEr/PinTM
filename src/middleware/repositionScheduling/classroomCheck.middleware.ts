import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class ClassroomCheckMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        var classroom : string = req.body.classroom;
        if(classroom != ''){
            next();
        } else {
            res.status(400);
            res.send({"mensagem" : "Insira uma sala de aula"});
        }
    }
}