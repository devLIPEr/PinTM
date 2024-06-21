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
import CourseController from './course/course.controller';
import CourseService from './course/course.service';
import { AlsModule } from './als/als.module';
import { AsyncLocalStorage } from 'async_hooks';

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
    AlsModule
  ],
  controllers: [AppController, UserController, RepositionController, CourseController],
  providers: [UserService, RepositionService, CourseService],
})
export class AppModule implements NestModule {
  constructor(private readonly als : AsyncLocalStorage<UserContext>){}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) =>{
        const store = {
          username : req.headers["username"],
          isColorBlind : req.headers["isColorBlind"],
        };
        this.als.run(store, () =>next());
      }).forRoutes("*")
      .apply(UserMiddleware)
      .exclude(
        {path: "user", method:RequestMethod.GET}
      )
      .forRoutes(UserController)
      .apply(RepositionMiddleware)
      .forRoutes(RepositionController);
  }
}
