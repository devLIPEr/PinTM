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

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    ConfigModule.forRoot()
  ],
  controllers: [AppController, UserController, RepositionController],
  providers: [UserService, RepositionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude(
        {path: "user", method:RequestMethod.GET}
      )
      .forRoutes(UserController)
      .apply(RepositionMiddleware)
      .forRoutes(RepositionMiddleware);
  }
}
