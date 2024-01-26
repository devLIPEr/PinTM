import { Get, Post, Body, Res, Controller, Render } from '@nestjs/common';
import { Response } from 'express';
import { RepositionFormDTO } from './dto/repositionForm.dto';
import { RepositionDTO } from './dto/reposition.dto';
import { GetMateriaDTO } from './dto/getMateria.dto';

import { firebaseDB } from 'src/firebase';

@Controller('reposition')
export class RepositionController {
  @Get('/scheduleForm')
  @Render('consultaForms')
  async branchConsultaForms(){
    const query = `cursos`;
    const snapshot = await firebaseDB.ref(query).once('value');
    const data = snapshot.val();

    const cursosData = Object.entries(data).map(([key, value]) => { return {key, nome: value['nome']}; });

    return { cursos: cursosData };
  }

  @Post('/getMaterias')
  async getMaterias(@Body() body: GetMateriaDTO, @Res() res: Response){
    const query = `cursos/${body.nomeCurso}/materias`;
    const snapshot = await firebaseDB.ref(query).once('value');
    const data = snapshot.val();

    const materiasData = Object.entries(data).map(([key, value]) => { return {key, nome: value['nome']}; });

    res.send(materiasData);
  }

  @Post('/createReposition')
  async createReposition(@Body() reposition: RepositionDTO, @Res() res: Response){
    // Create reposition based on UID
  }

  @Post('/getRepositions')
  async getRepositions(@Body() reposition: RepositionDTO, @Res() res: Response){
    // Get repositions based on UID
  }

  @Post('/deleteReposition')
  async deleteReposition(@Body() reposition: RepositionDTO, @Res() res: Response){
    // Delete reposition based on UID
  }

  @Post('/pdf')
  sharePDF(@Body() reposition: RepositionDTO, @Res() res: Response){
    // Redirect to pdf with reposition info
  }

  @Get('/pdf')
  @Render('pdf')
  branchPDF(){
    var materia = 'Engenharia de Software I';
    var data = '12/02/2023';
    var sala = 'Sala 1 Bloco 2';
    var horario = '08:20 - 10:00';
    return {materia: materia, data: data, sala: sala, horario: horario};
  }

  @Post('/selectSchedule')
  async selectSchedule(@Body() reposition: RepositionFormDTO, @Res() res: Response){
    const querySalas = `salas`;
    const snapshotSalas = await firebaseDB.ref(querySalas).once('value');
    const dataSalas = snapshotSalas.val();
    const salas = Object.entries(dataSalas).map(([key, value]) => { return {sala: key}; });

    const serie = await this.getSerieByMateria(reposition.nomeCurso, reposition.nomeMateria);
    const queryHorarios = `cursos/${reposition.nomeCurso}/horarios/${serie}`;
    const snapshotHorarios = await firebaseDB.ref(queryHorarios).once('value');
    const dataHorarios = snapshotHorarios.val();
    
    type Qualities = number[][];

    var qualities: Qualities = new Array(16).fill(0).map(() => new Array(6).fill(4));
    var horariosValues = Object.values(dataHorarios);

    for (var i = 0; i < horariosValues.length; i++) {
      for (var j = 0; j < 6; j++) {
        if (horariosValues[i][j] != '') {
          qualities[i][j] = 0;
        }
      }
    }

    var Horario = [
      // Manhã
      [
        {
          horario: "M1 - 07:30",
          qualities: [{quality: qualities[0][0]}, {quality: qualities[0][1]}, {quality: qualities[0][2]}, {quality: qualities[0][3]}, {quality: qualities[0][4]}, {quality: qualities[0][5]}]
        },
        {
          horario: "M2 - 08:20",
          qualities: [{quality: qualities[1][0]}, {quality: qualities[1][1]}, {quality: qualities[1][2]}, {quality: qualities[1][3]}, {quality: qualities[1][4]}, {quality: qualities[1][5]}]
        },
        {
          horario: "M3 - 09:10",
          qualities: [{quality: qualities[2][0]}, {quality: qualities[2][1]}, {quality: qualities[2][2]}, {quality: qualities[2][3]}, {quality: qualities[2][4]}, {quality: qualities[2][5]}]
        },
        {
          horario: "M4 - 10:10",
          qualities: [{quality: qualities[3][0]}, {quality: qualities[3][1]}, {quality: qualities[3][2]}, {quality: qualities[3][3]}, {quality: qualities[3][4]}, {quality: qualities[3][5]}]
        },
        {
          horario: "M5 - 11:00",
          qualities: [{quality: qualities[4][0]}, {quality: qualities[4][1]}, {quality: qualities[4][2]}, {quality: qualities[4][3]}, {quality: qualities[4][4]}, {quality: qualities[4][5]}]
        }
      ],
      // Tarde
      [
        {
          horario: "T1 - 13:20",
          qualities: [{quality: qualities[5][0]}, {quality: qualities[5][1]}, {quality: qualities[5][2]}, {quality: qualities[5][3]}, {quality: qualities[5][4]}, {quality: qualities[5][5]}]
        },
        {
          horario: "T2 - 14:10",
          qualities: [{quality: qualities[6][0]}, {quality: qualities[6][1]}, {quality: qualities[6][2]}, {quality: qualities[6][3]}, {quality: qualities[6][4]}, {quality: qualities[6][5]}]
        },
        {
          horario: "T3 - 15:00",
          qualities: [{quality: qualities[7][0]}, {quality: qualities[7][1]}, {quality: qualities[7][2]}, {quality: qualities[7][3]}, {quality: qualities[7][4]}, {quality: qualities[7][5]}]
        },
        {
          horario: "T4 - 16:00",
          qualities: [{quality: qualities[8][0]}, {quality: qualities[8][1]}, {quality: qualities[8][2]}, {quality: qualities[8][3]}, {quality: qualities[8][4]}, {quality: qualities[8][5]}]
        },
        {
          horario: "T5 - 16:50",
          qualities: [{quality: qualities[9][0]}, {quality: qualities[9][1]}, {quality: qualities[9][2]}, {quality: qualities[9][3]}, {quality: qualities[9][4]}, {quality: qualities[9][5]}]
        },
        {
          horario: "T6 - 17:40",
          qualities: [{quality: qualities[10][0]}, {quality: qualities[10][1]}, {quality: qualities[10][2]}, {quality: qualities[10][3]}, {quality: qualities[10][4]}, {quality: qualities[10][5]}]
        }
      ],
      // Noite
      [
        {
          horario: "N1 - 18:50",
          qualities: [{quality: qualities[11][0]}, {quality: qualities[11][1]}, {quality: qualities[11][2]}, {quality: qualities[11][3]}, {quality: qualities[11][4]}, {quality: qualities[11][5]}]
        },
        {
          horario: "N2 - 19:40",
          qualities: [{quality: qualities[12][0]}, {quality: qualities[12][1]}, {quality: qualities[12][2]}, {quality: qualities[12][3]}, {quality: qualities[12][4]}, {quality: qualities[12][5]}]
        },
        {
          horario: "N3 - 20:30",
          qualities: [{quality: qualities[13][0]}, {quality: qualities[13][1]}, {quality: qualities[13][2]}, {quality: qualities[13][3]}, {quality: qualities[13][4]}, {quality: qualities[13][5]}]
        },
        {
          horario: "N4 - 21:30",
          qualities: [{quality: qualities[14][0]}, {quality: qualities[14][1]}, {quality: qualities[14][2]}, {quality: qualities[14][3]}, {quality: qualities[14][4]}, {quality: qualities[14][5]}]
        },
        {
          horario: "N5 - 22:20",
          qualities: [{quality: qualities[15][0]}, {quality: qualities[15][1]}, {quality: qualities[15][2]}, {quality: qualities[15][3]}, {quality: qualities[15][4]}, {quality: qualities[15][5]}]
        }
      ]
    ]

    res.render('selectSchedule', { salas: salas, horarios: Horario });

  }

  async getSerieByMateria(curso: string, materia: string){
    const query = `cursos/${curso}/materias/${materia}`;
    const snapshot = await firebaseDB.ref(query).once('value');
    const data = snapshot.val();

    return data['serie'];
  }
}