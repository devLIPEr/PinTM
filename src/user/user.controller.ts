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
  branchMinhasRepos() {
    return {
      repos: [
        [
          {
            materia: "Redes",
            curso: "Computação",
            data: "20/09/2023",
            horario: "16:20",
            local: "Lab2"
          }
        ]
      ]
    };
  }
  @Get('/accountInfo')
  @Render('minhaConta')
  branchMinhaConta() {
    return{
      informations:[
        {
          nome:  "Mickey Mouse",
          email: "mck.mouse@disneymail.com"
        }
      ]
    };
  }
}