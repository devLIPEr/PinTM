import { Get, Post, Body, Res, Controller, Render, Req, Param, Delete } from '@nestjs/common';
import { Request, Response } from 'express';


import RepositionService from './reposition.service';
import RepositionRequestDTO from './dto/RepositionRequest.dto';
import { verifyCustomToken } from 'src/firebase';

@Controller('reposition')
export class RepositionController {
  constructor(private repositionService: RepositionService){}

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

  @Get('/getMaterias/:course')
  async getMaterias(@Param() course: string, @Res() res: Response){
    console.log("Get matérias");
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
    if(req.headers.cookie && req.headers.cookie.split('token=')[1].length){
      verifyCustomToken(req.headers.cookie.split('token=')[1])
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
    if(req.headers.cookie && req.headers.cookie.split('token=')[1].length){
      verifyCustomToken(req.headers.cookie.split('token=')[1])
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
    if(req.headers.cookie && req.headers.cookie.split('token=')[1].length){
      verifyCustomToken(req.headers.cookie.split('token=')[1])
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
      });
    }
    res.end();
  }

  @Get('/pdf/:id')
  async sharePDF(@Param("id") id: string, @Res() res: Response){
    this.repositionService.getById(id)
    .then((reposition) => {
      res.render('pdf', {
        materia: reposition['subject'],
        data: reposition['date'],
        sala: reposition['classroom'],
        horario: `${reposition['start']} - ${reposition['end']}`,
      });
    });
  }

  @Post('/selectSchedule')
  async selectSchedule(@Body() reposition: RepositionRequestDTO, @Res() res: Response){
    res.render('selectSchedule', this.repositionService.generateSchedule(reposition));
  }
}