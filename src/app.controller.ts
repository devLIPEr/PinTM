import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {}

  
  @Get('/login')
  @Render('login')
  branchIndex() {}
}