import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class UserController {
  @Get('/login')
  @Render('login')
  branchIndex() {}

  @Get('/signup')
  @Render('signup')
  branchSignup() {}
}