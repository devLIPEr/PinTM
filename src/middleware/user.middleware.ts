import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'punycode';
import { firebaseAuth, verifyCustomToken } from 'src/firebase';
import { userFirebaseConfig } from 'src/firebaseConfig';

export interface RequestWithUser extends Request{
  user? : any;
  isColorBlind? : any;
  isAdmin? : any;
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if(req.cookies && req.cookies['token']){
      var displayName;
      var isColorBlind;
      verifyCustomToken(req.cookies['token'])
      .then(customToken => {
        console.log("Custom token", customToken);
        displayName = customToken.user.displayName;
        return customToken.user.getIdToken();
      }).then(token => firebaseAuth.verifyIdToken(token))
      .then((decodedToken) => {
        console.log();
        console.log("Decoded token", decodedToken);
        (req as RequestWithUser).user = displayName;
        (req as RequestWithUser).isAdmin = decodedToken["isAdmin"];
        next();
      })
      .catch((err) => {
        console.log("Deu problema meu patrão");
        console.log(err);
        res.redirect('/user/login');
      })
    }else{
      next();
    }
  }
}
