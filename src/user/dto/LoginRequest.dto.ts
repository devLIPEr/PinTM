import { AutoMap } from "@automapper/classes";
import { IsEmail, IsNotEmpty, Length } from "@nestjs/class-validator";

export default class LoginRequestDTO{
    @AutoMap()
    @IsEmail()
    private _email: string;

    @AutoMap()
    @IsNotEmpty()
    private _username: string;

    @AutoMap()
    @IsNotEmpty()
    @Length(6)
    private _password: string;

    @AutoMap()
    private _isColorBlind: boolean = false;

    /**
     * Getter email
     * @return {string}
     */
	public get email(): string {
		return this._email;
	}

    /**
     * Getter username
     * @return {string}
     */
	public get username(): string {
		return this._username;
	}

    /**
     * Getter password
     * @return {string}
     */
	public get password(): string {
		return this._password;
	}

    /**
     * Getter isColorBlind
     * @return {boolean}
     */
	public get isColorBlind(): boolean {
		return this._isColorBlind;
	}
    
    /**
     * Setter email
     * @param {string} value
     */
	public set email(value: string) {
		this._email = value;
	}
    
    /**
     * Setter username
     * @param {string} value
     */
	public set username(value: string) {
		this._username = value;
	}

    /**
     * Setter password
     * @param {string} value
     */
	public set password(value: string) {
		this._password = value;
	}

    /**
     * Setter isColorBlind
     * @param {boolean} value
     */
	public set isColorBlind(value: boolean) {
		this._isColorBlind = value;
	}
}