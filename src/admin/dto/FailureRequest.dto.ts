import { AutoMap } from "@automapper/classes";
import { IsInt, Max, Min } from "@nestjs/class-validator";

class dataType{
    key: number;
    @IsInt()
    @Min(0)
    @Max(100)
    failureRate: number;
} 

export default class FailureRequest{
    @AutoMap()
    private _course: string;
    @AutoMap()
    private _subjects: dataType[];
    
    public get course(): string {
        return this._course;
    }
    public set course(value: string) {
        this._course = value;
    }
    public get subjects(): dataType[] {
        return this._subjects;
    }
    public set subjects(value: dataType[]) {
        this._subjects = value;
    }
}
