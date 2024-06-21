import { Injectable } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { firebaseDB } from "src/firebase";
import CourseResponseDTO from "./dto/courseResponse.dto";

@Injectable()
export default class CourseService{
    constructor(@InjectMapper() private mapper: Mapper){}

    mapQueryRepositionResponse(query): CourseResponseDTO{
        let course = {
            name : query['_fieldsProto']['name']['stringValue']
        }

        let courseResponse = new CourseResponseDTO();
        courseResponse.nome = course.name;        
        return courseResponse;
    }

    async getAll(){
        return firebaseDB.collection("Cursos").get()
        .then(snapshot =>{
            let courses : CourseResponseDTO[] = [];
            snapshot.forEach(element => {
                courses.push(this.mapQueryRepositionResponse(element));
            });
            return courses;
        })
        .catch(err => {
            console.log(err);
            return null;
        });   
    }
}