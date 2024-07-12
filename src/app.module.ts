import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { RepositionController } from './reposition/reposition.controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserMiddleware } from './middleware/user.middleware';
import { RepositionMiddleware } from './middleware/reposition.middleware';
import UserService from './user/user.service';
import RepositionService from './reposition/reposition.service';
import { NotFoundExceptionFilter } from './exceptions/NotFoundExceptionFilter';
import { APP_FILTER } from '@nestjs/core';

export interface UserContext{
  username : string;
  isColorBlind : boolean;
}

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, UserController, RepositionController], 
  providers: [
    UserService,
    RepositionService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        if(req.cookies && req.cookies['token']){
          res.redirect("/")
        } else {
          next();
        }
      })
      .forRoutes("/user/login", "/user/signup")
      .apply(UserMiddleware)
      .exclude(
        {path: "user", method:RequestMethod.GET}
      )
      .forRoutes(UserController)
      .apply(RepositionMiddleware)
      .forRoutes(RepositionController);
  }
}
