import { Get, Post, Body, Res, Controller, Render, Response } from '@nestjs/common';
import { RepositionFormDTO } from './dto/repositionForm.dto';
import { RepositionDTO } from './dto/reposition.dto';

@Controller('reposition')
export class RepositionController {
  @Get('/scheduleForm')
  @Render('consultaForms')
  branchConsultaForms(){}

  @Post('/pdf')
  sharePDF(@Body() reposition: RepositionDTO, @Res() res: Response){
    // Redirect to pdf with reposition info
  }

  @Get('/pdf')
  @Render('pdf')
  branchPDF() {
    return {materia: 'Engenharia de Software I', data: '12/02/2023', sala: 'Sala 1 Bloco 2', horario: '08:20 - 10:00'};
  }

  @Post('/selectSchedule')
  selectSchedule(@Body() reposition: RepositionFormDTO){
    // Algoritmo pra selecionar horário
  }

  @Get('/selectSchedule')
  @Render('selectSchedule')
  branchSelectSchedule() {
    return {
      salas: [
        {sala: "Sala 1 Bloco 2"},
        {sala: "Sala 2 Bloco 2"},
        {sala: "Sala 3 Bloco 2"},
        {sala: "Sala 4 Bloco 2"},
        {sala: "Sala 5 Bloco 2"},
        {sala: "Sala 6 Bloco 2"},
        {sala: "Sala 7 Bloco 2"},
        {sala: "Sala 8 Bloco 2"}
      ],
      horarios: [
        // Manhã
        [
          {
            horario: "M1 - 07:30",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "M2 - 08:20",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "M3 - 09:10",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "M4 - 10:10",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "M5 - 11:00",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          }
        ],
        // Tarde
        [
          {
            horario: "T1 - 13:20",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "T2 - 14:10",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "T3 - 15:00",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "T4 - 16:00",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "T5 - 16:50",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "T6 - 17:40",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          }
        ],
        // Noite
        [
          {
            horario: "N1 - 18:50",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "N2 - 19:40",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "N3 - 20:30",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "N4 - 21:30",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          },
          {
            horario: "N5 - 22:20",
            qualities: [{quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:-1}, {quality:0}]
          }
        ]
      ]
    };
  }
}