import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {}
  
  @Get('/login')
  @Render('login')
  branchIndex() {}
  
  @Get('/pdf')
  @Render('pdf')
  branchPDF() {
    return {materia: 'Engenharia de Software I', data: '12/02/2023', sala: 'Sala 1 Bloco 2', horario: '08:20 - 10:00'};
  }
}