import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {}

  @Get('/404')
  @Render('notFound')
  notFound() {}
}
