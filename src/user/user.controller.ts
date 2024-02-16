import { Get, Controller, Render } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('/login')
  @Render('login')
  branchIndex() {}

  @Get('/signup')
  @Render('signup')
  branchSignup() {}

  @Get('/account')
  @Render('minhasRepos')
  branchMinhasRepos() {}

  @Get('/accountInfo')
  @Render('minhaConta')
  branchMinhaConta() {}
  
  @Get('/resetPassword')
  @Render('resetPassword')
  branchResetPass() {}
}