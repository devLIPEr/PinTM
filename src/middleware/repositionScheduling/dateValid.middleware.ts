import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export default class DateValidMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        var date : string = req.body.date;
        const currentDate : Date = new Date();
        const [day, month, year] = date.split('/').map(Number);
        const convertedDate = new Date(year, month - 1, day);
        if(currentDate <= convertedDate){
            next();
        } else {
            res.status(400);
            res.send({"mensagem": "Uma das datas inseridas já passou!"});
        }
    }
}