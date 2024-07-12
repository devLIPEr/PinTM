import { Get, Post, Body, Res, Controller, Render, Req, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';


import RepositionService from './reposition.service';
import RepositionRequestDTO from './dto/RepositionRequest.dto';
import { verifyCustomToken } from 'src/firebase';
import RepositionResponseDTO from './dto/RepositionResponse.dto';

@Controller('reposition')
export class RepositionController {
  constructor(private repositionService: RepositionService){}

  @Get('/account')
  async branchMinhasRepos(@Req() req: Request, @Res() res: Response){
    let repositions: RepositionResponseDTO[] = [];
    if(req.cookies && req.cookies['token']){
      await verifyCustomToken(req.cookies['token'])
      .then(async (userCredential) => {
        repositions = await this.repositionService.getAll(userCredential.user.uid);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    res.render('minhasRepos', { repositions: repositions });
  }

  @Get('/scheduleForm')
  @Render('consultaForms')
  async branchConsultaForms(){
    return this.repositionService.getCourses()
    .then((courses) => {
      let data = [];
      courses.forEach((course) => {
        data.push({
          key: course.id,
          nome: course.data().name
        });
      });
      return { cursos: data };
    })
    .catch((err) => {
      console.log(err);
    });
  }

  @Get('/getSubjects/:course')
  async getSubjects(@Param() course: string, @Res() res: Response){
    this.repositionService.getSubjects(course)
    .then((subjects) => {
      res.send(subjects);
    })
    .catch((err) => {
      res.send({});
      console.log(err);
    });
  }
  
  @Post('/createReposition')
  async createReposition(@Body() dto: RepositionRequestDTO, @Req() req: Request, @Res() res: Response){
    if(req.cookies && req.cookies['token']){
      verifyCustomToken(req.cookies['token'])
      .then((userCredential) => {
        this.repositionService.create(userCredential.user.uid, dto)
        .then((reposition) => {
          res.send(reposition);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  @Get('/getRepositions')
  async getRepositions(@Req() req: Request, @Res() res: Response){
    if(req.cookies && req.cookies['token']){
      verifyCustomToken(req.cookies['token'])
      .then((userCredential) => {
        this.repositionService.getAll(userCredential.user.uid)
        .then((repositions) => {
          res.send({repositions: repositions});
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  @Delete('/deleteReposition/:id')
  async deleteReposition(@Param("id") id: string, @Req() req: Request, @Res() res: Response){
    if(req.cookies && req.cookies['token']){
      verifyCustomToken(req.cookies['token'])
      .then((userCredential) => {
        this.repositionService.getById(id)
        .then((reposition) => {
          if(reposition.id == userCredential.user.uid){
            this.repositionService.delete(id);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException("Não foi possível deletar a reposição", HttpStatus.INTERNAL_SERVER_ERROR);
      });
    }
    res.end();
  }

  @Get('/pdf/:id')
  async sharePDF(@Param("id") id: string, @Res() res: Response){
    this.repositionService.getById(id)
    .then((reposition) => {
      res.render('pdf', {
        materia: reposition['_subject'],
        data: reposition['_date'],
        sala: reposition['_classroom'],
        horario: `${reposition['_start']} - ${reposition['_end']}`,
      });
    });
  }

  @Post('/selectSchedule')
  async selectSchedule(@Body() reposition: RepositionRequestDTO, @Res() res: Response){
    res.render('selectSchedule', await this.repositionService.generateSchedule(reposition));
  }
}