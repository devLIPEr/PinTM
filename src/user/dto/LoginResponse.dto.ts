import { AutoMap } from "@automapper/classes";
import UserResponseDTO from "./UserResponse.dto";

export default class LoginResponseDTO{
    @AutoMap()
    private _token: string;

    @AutoMap()
    private _userResponse: UserResponseDTO;

    /**
     * Getter token
     * @return {string}
     */
	public get token(): string {
		return this._token;
	}

    /**
     * Getter userResponse
     * @return {UserResponseDTO}
     */
	public get userResponse(): UserResponseDTO {
		return this._userResponse;
	}
    
    /**
     * Setter token
     * @param {string} value
     */
	public set token(value: string) {
		this._token = value;
	}

    /**
     * Setter userResponse
     * @param {UserResponseDTO} value
     */
	public set userResponse(value: UserResponseDTO) {
		this._userResponse = value;
	}
}