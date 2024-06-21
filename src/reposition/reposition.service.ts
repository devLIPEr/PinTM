import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
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

    async getAll(uid: string): Promise<RepositionResponseDTO[] | null>{
        return firebaseDB.collection("Reposicoes").where("userId", "==", uid).get()
        .then((snapshot) => {
            let repositions: RepositionResponseDTO[] = [];
            snapshot.forEach((element) => {
                repositions.push(this.mapQueryRepositionResponse(element));
            });
            return repositions;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
    }

    async getById(id: string): Promise<RepositionResponseDTO>{
        return firebaseDB.collection("Reposicoes").doc(id).get()
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
            return new RepositionResponseDTO();
        });
    }

    async create(uid: string, dto: RepositionRequestDTO): Promise<RepositionResponseDTO | null>{
        let ref = firebaseDB.collection("Reposicoes").doc();
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
            return null;
        });
    }

    delete(id: string){
        this.getById(id);
        firebaseDB.collection("Reposicoes").doc(id).delete()
        .catch((err) => {
            console.log(err);
        })
    }

    async getSubjects(course: string): Promise<any>{
        return firebaseDB.collection("Cursos").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new Error("Curso não existente");
            }
            return doc.get("subjects");
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async getSubject(course: string, subject: string): Promise<any>{
        return firebaseDB.collection("Cursos").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new Error("Curso não existente");
            }
            return doc.get("subjects")[subject];
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async getSchedules(course: string): Promise<any>{
        return firebaseDB.collection("Cursos").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new Error("Curso não existente");
            }
            return doc.get("schedules");
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async getSchedule(course: string, grade: string): Promise<any>{
        return firebaseDB.collection("Cursos").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new Error("Curso não existente");
            }
            return doc.get("schedules")[grade];
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async getCourses(): Promise<any>{
        return firebaseDB.collection("Cursos").get()
        .then((coursesRef) => {
            return coursesRef.docs;
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async getCourseName(course: string): Promise<string>{
        return firebaseDB.collection("Cursos").doc(course).get()
        .then((doc) => {
            if(!doc.exists){
                throw new Error("Curso não existente");
            }
            return doc['_fieldsProto']['name']['stringValue'];
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async getClassrooms(): Promise<any>{
        return firebaseDB.collection("Salas").get()
        .then((doc) => {
            let classrooms = [];
            doc.forEach((classroom) => {
                classrooms.push(classroom['_ref']['_path']['segments'][1]);
            });
            return classrooms;
        })
        .catch((err) => {
            console.log(err);
        });
    }

    dict2Mat(dict){
        let mat = [];
        for(let i = 0; i < dict.length; i++){
            let row = [];
            for(let j = 0; j < Object.keys(dict[i]).length; j++){
                let classes = [];
                for(let k = 0; k < Object.keys(dict[i][j.toString()]).length; k++){
                    classes.push(dict[i][j.toString()][k.toString()]);
                }
                row.push(classes);
            }
            mat.push(row);
        }
        console.log(mat);
        return mat;
    }

    async generateSchedule(dto: RepositionRequestDTO){
        const classrooms = await this.getClassrooms();

        const subject = await this.getSubject(dto.course, dto.subject);
        const grade = subject["serie"];
        const schedule = await this.getSchedule(dto.course, grade);
        
        type Qualities = number[][];
        
        var qualities: Qualities = new Array(16).fill(0).map(() => new Array(6).fill(4));
        var horariosValues = this.dict2Mat(Object.values(schedule));

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
                if (horariosValues[i][j] != '') {
                    qualities[i + correct][j] = 0;
                }
            }
        }

        console.log(qualities);

        const horariosOcupados = qualities.map((linha) => linha.includes(0));

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
                qualities[i][j] = 3;
            } else if (distanciaMinima <= 7) {
                qualities[i][j] = 2;
            } else {
                qualities[i][j] = 1;
            }
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
        ];

        return { salas: classrooms, horarios: Horario, materia: subject["nome"], curso: await this.getCourseName(dto.course) }
    }
}