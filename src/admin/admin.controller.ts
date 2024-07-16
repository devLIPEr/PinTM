import { Body, Controller, Get, Param, Put, Render, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';

import AdminService from "./admin.service";
import FailureRequest from "./dto/FailureRequest.dto";

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get('/index')
  @Render('admin')
  branchAdminIndex() { }

  @Get('/reprovacao')
  @Render('reprovacaoAdmin')
  async branchAdminReprovacao() {
    return this.adminService.getCourses()
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

  @Get('/getSubjects/:course/:subject')
  async getSubjectsById(
    @Res() res: Response,
    @Param('course') course: string,
    @Param('subject') subject: string
  ){
    this.adminService.getSubject(course, subject)
    .then((subjects) => {
      res.send({[subject]: subjects});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  @Get('/getSubjects/:course')
  async getSubjects(
    @Param('course') course: string,
    @Res() res: Response
  ) {
    this.adminService.getSubjects(course)
      .then((subjects) => {
        res.send(subjects);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @Put('/saveFailureRate')
  async saveFailureRate(@Body() request: FailureRequest, @Req() req: Request, @Res() res: Response){
    try {
      this.adminService.saveFailureRate(request)
      // https://peterdaugaardrasmussen.com/2020/05/09/how-to-redirect-http-put-or-post-requests/
      res.redirect(303, '/admin/index');
    } catch (err) {
      res.send({});
      console.log(err);
    };
  }
} 
