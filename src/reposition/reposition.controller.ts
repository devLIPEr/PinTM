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

    // Algoritmo pra selecionar horário

    res.render('selectSchedule', { salas: salas, horarios: [] });
  }

  async getSerieByMateria(curso: string, materia: string){
    const query = `cursos/${curso}/materias/${materia}`;
    const snapshot = await firebaseDB.ref(query).once('value');
    const data = snapshot.val();

    return data['serie'];
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