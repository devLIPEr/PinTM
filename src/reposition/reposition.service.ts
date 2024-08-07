import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import RepositionResponseDTO from "./dto/RepositionResponse.dto";
import { firebaseDB } from "src/firebase";
import RepositionRequestDTO from "./dto/RepositionRequest.dto";

@Injectable()
export default class RepositionService{
    constructor(@InjectMapper() private mapper: Mapper){}

    mapQueryRepositionResponse(query): RepositionResponseDTO{
        let reposition = {
            id: query['_ref']['_path']['segments'][1],
            course: query['_fieldsProto']['course']['stringValue'],
            subject: query['_fieldsProto']['subject']['stringValue'],
            classroom: query['_fieldsProto']['classroom']['stringValue'],
            date: query['_fieldsProto']['date']['stringValue'],
            start: query['_fieldsProto']['start']['stringValue'],
            end: query['_fieldsProto']['end']['stringValue']
        }

        let response = new RepositionResponseDTO();
        response.id = reposition.id;
        response.course = reposition.course;
        response.subject = reposition.subject;
        response.classroom = reposition.classroom;
        response.date = reposition.date;
        response.start = reposition.start;
        response.end = reposition.end;
        
        return response;
    }

    string2Date(text: string): Date{
        const parts = text.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return new Date(`${month}/${day}/${year}`);
    }

    async getAll(uid: string): Promise<RepositionResponseDTO[]>{
        return firebaseDB.collection("Repositions").where("userId", "==", uid).limit(15).get()
        .then((snapshot) => {
            let repositions: RepositionResponseDTO[] = [];
            let currDate = new Date();
            currDate.setHours(0,0,0,0);
            snapshot.forEach((element) => {
                repositions.push(this.mapQueryRepositionResponse(element));
            });
            repositions = repositions.filter((repo) => {
                let repoDate = this.string2Date(repo.date);
                return repoDate >= currDate;
            });
            return repositions.reverse();
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException(`Reposição não encontrada`, HttpStatus.NOT_FOUND);
        });
    }

    async getById(id: string): Promise<RepositionResponseDTO>{
        return firebaseDB.collection("Repositions").doc(id).get()
        .then((snapshot) => {
            if(snapshot['_fieldsProto']){
                let response = this.mapQueryRepositionResponse(snapshot);
                response.id = snapshot['_fieldsProto']['userId']['stringValue'];
                return response;
            }
            return new RepositionResponseDTO();
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException(`Reposição com o id ${id} não encontrada`, HttpStatus.NOT_FOUND);
        });
    }

    async create(uid: string, dto: RepositionRequestDTO): Promise<RepositionResponseDTO>{
        let ref = firebaseDB.collection("Repositions").doc();
        let data = {
            userId: uid,
            course: dto.course,
            subject: dto.subject,
            classroom: dto.classroom,
            date: dto.date,
            start: dto.start,
            end: dto.end
        };
        return ref.set(data)
        .then(() => {
            let response = new RepositionResponseDTO();
            response.id = ref['_path']['segments'][1];
            response.course = data.course;
            response.subject = data.subject;
            response.classroom = data.classroom;
            response.date = data.date;
            response.start = data.start;
            response.end = data.end;
            return response;
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Erro ao cadastrar reposição", HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }

    delete(id: string){
        this.getById(id);
        firebaseDB.collection("Repositions").doc(id).delete()
        .catch((err) => {
            console.log(err);
            throw new HttpException("Erro ao deletar reposição", HttpStatus.INTERNAL_SERVER_ERROR);
        })
    }

    async getSubjects(course: string): Promise<any>{
        return firebaseDB.collection("Courses").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
            }
            return doc.get("subjects");
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
        });
    }

    async getSubject(course: string, subject: string): Promise<any>{
        return firebaseDB.collection("Courses").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
            }
            return doc.get("subjects")[subject];
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
        });
    }

    async getSchedules(course: string): Promise<any>{
        return firebaseDB.collection("Courses").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
            }
            return doc.get("schedules");
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
        });
    }

    async getSchedule(course: string, grade: string): Promise<any>{
        return firebaseDB.collection("Courses").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
            }
            return doc.get("schedules")[grade];
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
        });
    }

    async getCourses(): Promise<any>{
        return firebaseDB.collection("Courses").get()
        .then((coursesRef) => {
            return coursesRef.docs;
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Nenhum curso encontrado", HttpStatus.NOT_FOUND);
        });
    }

    async getCourseName(course: string): Promise<string>{
        return firebaseDB.collection("Courses").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
            }
            return doc['_fieldsProto']['name']['stringValue'];
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Curso não encontrado", HttpStatus.NOT_FOUND);
        });
    }

    async getClassrooms(): Promise<any>{
        return firebaseDB.collection("Classrooms").get()
        .then((doc) => {
            let classrooms = [];
            doc.forEach((classroom) => {
                classrooms.push(classroom['_ref']['_path']['segments'][1]);
            });
            return classrooms;
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Sala não encontrada", HttpStatus.NOT_FOUND);
        });
    }

    dict2Mat(dict){
        let keys = ['07h30min', '08h20min', '09h10min', '10h10min', '11h00min', '13h20min', '14h10min', '15h00min', '16h00min', '16h50min', '17h40min', '18h50min', '19h40min', '20h30min', '21h30min', '22h20min'];
        let mat = [];
        for(let i = 0; i < Object.keys(dict).length; i++){
            let row = [];
            for(let j = 0; j < Object.keys(dict[keys[i]]).length; j++){
                let classes = [];
                for(let k = 0; k < Object.keys(dict[keys[i]][j.toString()]).length; k++){
                    classes.push(dict[keys[i]][j.toString()][k.toString()]);
                }
                row.push(classes);
            }
            mat.push(row);
        }
        return mat;
    }

    async generateSchedule(dto: RepositionRequestDTO){
        const classrooms = await this.getClassrooms();

        const subjects = await this.getSubjects(dto.course);
        const subject = subjects[dto.subject];
        const grade = subject["grade"];
        const schedule = await this.getSchedule(dto.course, grade);
        
        type Qualities = number[][];
        
        var qualities: Qualities = new Array(16).fill(0).map(() => new Array(6).fill(4));
        var horariosValues = this.dict2Mat(schedule);

        var correct;
        const firstKey = Object.keys(schedule)[0];
        if (firstKey == '13h20min'){
            correct = 5;
        }else if (firstKey == '18h50min'){
            correct = 11;
        }else{
            correct = 0;
        }


        for (var i = 0; i < horariosValues.length; i++) {
            for (var j = 0; j < 6; j++) {
                for(var k = 0; k < horariosValues[i][j].length; k++){
                    if (qualities[i+correct][j] != 0 && horariosValues[i][j][k] != '') {
                        qualities[i + correct][j] = 1;
                    }
                }
            }
        }

        const horariosOcupados = qualities.map((linha) => linha.includes(0));
        function getFailureRate(i, j){
            let maxFailureRate = 0;
            if(i < horariosValues.length && j < horariosValues[i].length){
                for(var k = 0; k < horariosValues[i][j].length; k++){
                    let subject = horariosValues[i][j][k].split('-')[0];
                    if(subject && subjects[subject].failureRate > maxFailureRate){
                        maxFailureRate = subjects[subject].failureRate;
                    }
                }
            }
            return maxFailureRate/100;
        }

        function round(value: number): number{
            let decimal = value - Math.floor(value);
            if(decimal <= 0.75){
                return Math.floor(value);
            }else{
                return Math.ceil(value);
            }
        }
        
        for (let i = 0; i < qualities.length; i++) {
            for (let j = 0; j < qualities[i].length; j++) {
                if (qualities[i][j] === 4) {
                    var distanciaMinima = Infinity;
                    for (let k = 0; k < qualities.length; k++){
                        if (qualities[k][j] == 0){
                            if (Math.abs(i - k) < distanciaMinima){
                                distanciaMinima = Math.abs(i - k);
                            }
                        }
                    }

                    if (correct == 0 && i > 10){
                        distanciaMinima += 10;
                    }else if (correct == 5 && i < 5) {
                        distanciaMinima += 10;
                    }else if (correct == 11 && i < 5) {
                        distanciaMinima += 10;
                    } else if (correct == 11 && i < 10) {
                        distanciaMinima += 2;
                    }else if (i == 0 || j == 5){
                        distanciaMinima += 10;
                    }

                    if (correct == 11 && i >= 10 && distanciaMinima > 3){
                        distanciaMinima = 3;
                    } 

                    if (distanciaMinima <= 3 ) {
                        qualities[i][j] = 4;
                    } else if (distanciaMinima <= 5) {
                        qualities[i][j] = 4;
                    } else if (distanciaMinima <= 7) {
                        qualities[i][j] = 3;
                    } else {
                        qualities[i][j] = 2;
                    }
                }else if(qualities[i][j] == 1){
                    qualities[i][j] = round(qualities[i][j]-getFailureRate(i,j));
                }
            }
        }

        var Horario = [
        // Manhã
        [
            {
            horario: "07:30",
            qualities: [{quality: qualities[0][0]}, {quality: qualities[0][1]}, {quality: qualities[0][2]}, {quality: qualities[0][3]}, {quality: qualities[0][4]}, {quality: qualities[0][5]}]
            },
            {
            horario: "08:20",
            qualities: [{quality: qualities[1][0]}, {quality: qualities[1][1]}, {quality: qualities[1][2]}, {quality: qualities[1][3]}, {quality: qualities[1][4]}, {quality: qualities[1][5]}]
            },
            {
            horario: "09:10",
            qualities: [{quality: qualities[2][0]}, {quality: qualities[2][1]}, {quality: qualities[2][2]}, {quality: qualities[2][3]}, {quality: qualities[2][4]}, {quality: qualities[2][5]}]
            },
            {
            horario: "10:10",
            qualities: [{quality: qualities[3][0]}, {quality: qualities[3][1]}, {quality: qualities[3][2]}, {quality: qualities[3][3]}, {quality: qualities[3][4]}, {quality: qualities[3][5]}]
            },
            {
            horario: "11:00",
            qualities: [{quality: qualities[4][0]}, {quality: qualities[4][1]}, {quality: qualities[4][2]}, {quality: qualities[4][3]}, {quality: qualities[4][4]}, {quality: qualities[4][5]}]
            }
        ],
        // Tarde
        [
            {
            horario: "13:20",
            qualities: [{quality: qualities[5][0]}, {quality: qualities[5][1]}, {quality: qualities[5][2]}, {quality: qualities[5][3]}, {quality: qualities[5][4]}, {quality: qualities[5][5]}]
            },
            {
            horario: "14:10",
            qualities: [{quality: qualities[6][0]}, {quality: qualities[6][1]}, {quality: qualities[6][2]}, {quality: qualities[6][3]}, {quality: qualities[6][4]}, {quality: qualities[6][5]}]
            },
            {
            horario: "15:00",
            qualities: [{quality: qualities[7][0]}, {quality: qualities[7][1]}, {quality: qualities[7][2]}, {quality: qualities[7][3]}, {quality: qualities[7][4]}, {quality: qualities[7][5]}]
            },
            {
            horario: "16:00",
            qualities: [{quality: qualities[8][0]}, {quality: qualities[8][1]}, {quality: qualities[8][2]}, {quality: qualities[8][3]}, {quality: qualities[8][4]}, {quality: qualities[8][5]}]
            },
            {
            horario: "16:50",
            qualities: [{quality: qualities[9][0]}, {quality: qualities[9][1]}, {quality: qualities[9][2]}, {quality: qualities[9][3]}, {quality: qualities[9][4]}, {quality: qualities[9][5]}]
            },
            {
            horario: "17:40",
            qualities: [{quality: qualities[10][0]}, {quality: qualities[10][1]}, {quality: qualities[10][2]}, {quality: qualities[10][3]}, {quality: qualities[10][4]}, {quality: qualities[10][5]}]
            }
        ],
        // Noite
        [
            {
            horario: "18:50",
            qualities: [{quality: qualities[11][0]}, {quality: qualities[11][1]}, {quality: qualities[11][2]}, {quality: qualities[11][3]}, {quality: qualities[11][4]}, {quality: qualities[11][5]}]
            },
            {
            horario: "19:40",
            qualities: [{quality: qualities[12][0]}, {quality: qualities[12][1]}, {quality: qualities[12][2]}, {quality: qualities[12][3]}, {quality: qualities[12][4]}, {quality: qualities[12][5]}]
            },
            {
            horario: "20:30",
            qualities: [{quality: qualities[13][0]}, {quality: qualities[13][1]}, {quality: qualities[13][2]}, {quality: qualities[13][3]}, {quality: qualities[13][4]}, {quality: qualities[13][5]}]
            },
            {
            horario: "21:30",
            qualities: [{quality: qualities[14][0]}, {quality: qualities[14][1]}, {quality: qualities[14][2]}, {quality: qualities[14][3]}, {quality: qualities[14][4]}, {quality: qualities[14][5]}]
            },
            {
            horario: "22:20",
            qualities: [{quality: qualities[15][0]}, {quality: qualities[15][1]}, {quality: qualities[15][2]}, {quality: qualities[15][3]}, {quality: qualities[15][4]}, {quality: qualities[15][5]}]
            }
        ]
        ];

        return { salas: classrooms, horarios: Horario, materia: subject["name"], curso: await this.getCourseName(dto.course) }
    }
}