import { Get, Post, Body, Res, Controller, Render, Req, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('error')
export class ErrorController {
  @Get('404')
  @Render('notFound')
  branchMinhasRepos(){}
}