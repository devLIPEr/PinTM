import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class DateCheckMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        var date : string = req.body.date;
        var day = parseInt(date.split('/')[0]);
        var month = parseInt(date.split('/')[1]);
        var year = parseInt(date.split('/')[2]);
        if(Number.isNaN(day)|| Number.isNaN(month) || Number.isNaN(year) || date == ''){
            res.status(400);
            res.send({"mensagem": "Insira uma data!"});
        } else {
            next();
        }
    }
}