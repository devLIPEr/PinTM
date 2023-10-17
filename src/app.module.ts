import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { RepositionController } from './reposition/reposition.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, RepositionController],
  providers: [],
})
export class AppModule {}
