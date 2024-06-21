export default class CourseResponseDTO{
    private _nome : string;

    get nome(){
        return this._nome;
    }
    set nome(value : string){
        this._nome = value;
    }
}