import { AutoMap } from "@automapper/classes";

export default class UserRequestDTO{
    @AutoMap()
    private _email: string;
    @AutoMap()
    private _password: string;
    @AutoMap()
    private _username: string;
    @AutoMap()
    private _isColorBlind: boolean;

    /**
     * Getter email
     * @return {string}
     */
	public get email(): string {
		return this._email;
	}

    /**
     * Getter password
     * @return {string}
     */
	public get password(): string {
		return this._password;
	}

    /**
     * Getter username
     * @return {string}
     */
	public get username(): string {
		return this._username;
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
     * Setter password
     * @param {string} value
     */
	public set password(value: string) {
		this._password = value;
	}

    /**
     * Setter username
     * @param {string} value
     */
	public set username(value: string) {
		this._username = value;
	}

    /**
     * Setter isColorBlind
     * @param {boolean} value
     */
	public set isColorBlind(value: boolean) {
		this._isColorBlind = value;
	}

}