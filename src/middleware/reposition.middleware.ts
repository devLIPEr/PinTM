import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { firebaseAuth, verifyCustomToken } from 'src/firebase';
import { RequestWithUser } from './user.middleware';

@Injectable()
export class RepositionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if(req.cookies && req.cookies['token']){
      var displayName;
      verifyCustomToken(req.cookies['token'])
      .then(customToken => {displayName = customToken.user.displayName;
        return customToken.user.getIdToken();})
      .then(token => firebaseAuth.verifyIdToken(token))
      .then((decodedToken) => {
        (req as RequestWithUser).user = displayName;
        next();
      })
      .catch((err) => {
        res.redirect('/user/login');
        console.log(err);
      })
    }else{
      next();
    }
  }
}
