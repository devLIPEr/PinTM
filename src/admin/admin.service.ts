import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class AdminService {
    constructor(@InjectMapper() private mapper: Mapper){}
}