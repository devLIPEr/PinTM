import { Controller, Get, Render } from "@nestjs/common";
import AdminService from "./admin.service";

@Controller('admin')
export class AdminController {
    constructor(private adminService:AdminService){}

    @Get('/index')
    @Render('admin')
    branchAdminIndex(){}

    @Get('/reprovacao')
    @Render('reprovacaoAdmin')
    async branchAdminReprovacao(){
        return this.adminService.getCourses()
        .then((courses) => {
            let data = [];
            courses.forEach((course) => {
                data.push({
                    key: course.id,
                    nome: course.data().name
                });
            });
        const value_to_return = { cursos: data } 
        console.log(value_to_return)
        return value_to_return;
        })
        .catch((err) => {
        console.log(err);
        });
    }
}
