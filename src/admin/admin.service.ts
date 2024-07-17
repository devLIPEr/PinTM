import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { firebaseDB } from "src/firebase";
import FailureRequest from "./dto/FailureRequest.dto";

@Injectable()
export default class AdminService {
  constructor(@InjectMapper() private mapper: Mapper) { }

  async getCourses(): Promise<any> {
    return firebaseDB.collection("Courses").get()
      .then((coursesRef) => {
        return coursesRef.docs;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getSubjects(course: string): Promise<any> {
    return firebaseDB.collection("Courses").doc(course).get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error("Curso não existente");
        }
        return doc.get("subjects");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  
  async getSubject(course: string, subject: string): Promise<any>{
    return firebaseDB.collection("Courses").doc(course).get()
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

  async saveFailureRate(request: FailureRequest){
    let updates = {};
    request.subjects.forEach( (subject) => {
      if(subject.failureRate < 0 || subject.failureRate > 100){
        throw new HttpException("Taxa de reprovação inválida, deve estar entre 0 e 100", HttpStatus.BAD_REQUEST);
      }
      updates[`subjects.${subject["key"]}.failureRate`] = (subject["failureRate"] as number);
    })
    firebaseDB.collection("Courses").doc(request.course).update(updates)
    .catch((err) => {
      console.log(err);
      throw new HttpException("Erro ao salvar os dados", HttpStatus.INTERNAL_SERVER_ERROR);
  });
  }
}