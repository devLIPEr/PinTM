import { AutoMap } from "@automapper/classes";

export default class UserResponseDTO{
    @AutoMap()
    private _id: string;
    @AutoMap()
    private _email: string;
    @AutoMap()
    private _password: string;
    @AutoMap()
    private _username: string;
    @AutoMap()
    private _isAdmin: boolean;
    @AutoMap()
    private _isColorBlind: boolean;

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

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
     * Getter isAdmin
     * @return {boolean}
     */
	public get isAdmin(): boolean {
		return this._isAdmin;
	}

    /**
     * Getter isColorBlind
     * @return {boolean}
     */
	public get isColorBlind(): boolean {
		return this._isColorBlind;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
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
     * Setter isAdmin
     * @param {boolean} value
     */
	public set isAdmin(value: boolean) {
		this._isAdmin = value;
	}

    /**
     * Setter isColorBlind
     * @param {boolean} value
     */
	public set isColorBlind(value: boolean) {
		this._isColorBlind = value;
	}
}