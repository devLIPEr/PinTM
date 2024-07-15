import { AutoMap } from "@automapper/classes";
import dataType from "./DataType";

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
