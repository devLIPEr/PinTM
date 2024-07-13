import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
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
      updates[`subjects.${subject["key"]}.failureRate`] = (subject["failureRate"] as number);
    })
    console.log(updates)
    firebaseDB.collection("Courses").doc(request.course).update(updates)
    .catch((err) => {
      console.log(err);
  });
  }
}