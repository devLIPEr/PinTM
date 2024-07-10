import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { firebaseDB } from "src/firebase";

@Injectable()
export default class AdminService {
    constructor(@InjectMapper() private mapper: Mapper){}

    async getCourses(): Promise<any>{
        return firebaseDB.collection("Cursos").get()
        .then((coursesRef) => {
            return coursesRef.docs;
        })
        .catch((err) => {
            console.log(err);
        });
    }
}