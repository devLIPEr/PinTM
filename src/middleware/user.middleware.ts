import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from 'src/firebase';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if(req.cookies && req.cookies['token']){
      firebaseAuth.verifyIdToken(req.cookies['token'])
      .then((decodedToken) => {
        next();
      })
      .catch((err) => {
        res.redirect('/login');
        console.log(err);
      })
    }else{
      next();
    }
  }
}
