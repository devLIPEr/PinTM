import { Controller, Get, Render } from "@nestjs/common";

@Controller('admin')
export class AdminController {
    @Get('/index')
    @Render('admin')
    branchAdminIndex(){}

    @Get('/reprovacao')
    @Render('reprovacaoAdmin')
    branchAdminReprovacao(){}
}