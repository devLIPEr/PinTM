import { AutoMap } from "@automapper/classes";

export default class RepositionResponseDTO{
    @AutoMap()
    private _id: string;
    @AutoMap()
    private _course: string;
    @AutoMap()
    private _subject: string;
    @AutoMap()
    private _classroom: string;
    @AutoMap()
    private _date: string;
    @AutoMap()
    private _start: string;
    @AutoMap()
    private _end: string;

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter course
     * @return {string}
     */
	public get course(): string {
		return this._course;
	}

    /**
     * Getter subject
     * @return {string}
     */
	public get subject(): string {
		return this._subject;
	}

    /**
     * Getter classroom
     * @return {string}
     */
	public get classroom(): string {
		return this._classroom;
	}

    /**
     * Getter date
     * @return {string}
     */
	public get date(): string {
		return this._date;
	}

    /**
     * Getter start
     * @return {string}
     */
	public get start(): string {
		return this._start;
	}

    /**
     * Getter end
     * @return {string}
     */
	public get end(): string {
		return this._end;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter course
     * @param {string} value
     */
	public set course(value: string) {
		this._course = value;
	}

    /**
     * Setter subject
     * @param {string} value
     */
	public set subject(value: string) {
		this._subject = value;
	}

    /**
     * Setter classroom
     * @param {string} value
     */
	public set classroom(value: string) {
		this._classroom = value;
	}

    /**
     * Setter date
     * @param {string} value
     */
	public set date(value: string) {
		this._date = value;
	}

    /**
     * Setter start
     * @param {string} value
     */
	public set start(value: string) {
		this._start = value;
	}

    /**
     * Setter end
     * @param {string} value
     */
	public set end(value: string) {
		this._end = value;
	}
}