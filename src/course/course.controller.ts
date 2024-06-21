import { Controller, Get } from "@nestjs/common";
import CourseService from "./course.service";

@Controller("courses")
export default class CourseController{
    private courseService : CourseService;
    constructor(courseService : CourseService){
        this.courseService = courseService;
    }

    @Get("")
    obterTodos(){
        return this.courseService.getAll();
    }
}