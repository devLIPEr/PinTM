import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class DateCheckMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        var date : string = req.body.date;
        if(date != ''){
            next();
        } else {
            res.status(400);
            res.send({"mensagem": "Insira uma data!"});
        }
    }
}