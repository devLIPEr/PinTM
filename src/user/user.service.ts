import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import UserRequestDTO from "./dto/UserRequest.dto";
import UserResponseDTO from "./dto/UserResponse.dto";
import { auth, firebaseAuth, firebaseDB, verifyPassCode } from "src/firebase";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import * as bcrypt from "bcrypt";
import LoginRequestDTO from "./dto/LoginRequest.dto";
import LoginResponseDTO from "./dto/LoginResponse.dto";

@Injectable()
export default class UserService{
    constructor(
        @InjectMapper() private mapper: Mapper,
    ){}

    mapQueryUserResponse(query): UserResponseDTO{
        let user = {
            id: query['_ref']['_path']['segments'][1],
            email: query['_fieldsProto']['email']['stringValue'],
            password: query['_fieldsProto']['password']['stringValue'],
            username: query['_fieldsProto']['username']['stringValue'],
            isAdmin: query['_fieldsProto']['isAdmin']['booleanValue'],
            isColorBlind: query['_fieldsProto']['isColorBlind']['booleanValue']
        }

        let response = new UserResponseDTO();
        response.id = user.id;
        response.email = user.email;
        response.password = user.password;
        response.username = user.username;
        response.isAdmin = user.isAdmin;
        response.isColorBlind = user.isColorBlind;
        
        return response;
    }

    async getById(id: string): Promise<UserResponseDTO>{
        return firebaseDB.collection("Users").doc(id).get()
        .then((doc) => {
            if(!doc.exists){
                throw new HttpException(`Usuário com o id ${id} não encontrado.`, HttpStatus.NOT_FOUND);
            }
            return this.mapQueryUserResponse(doc);
        })
        .catch((err) => {
            throw new HttpException(`Usuário com o id ${id} não encontrado.`, HttpStatus.NOT_FOUND);
        });
    }

    async getByEmail(email: string): Promise<UserResponseDTO>{
        const usersRef = firebaseDB.collection("Users");
        let snapshot = await usersRef.where("email", "==", email).get();
        if(snapshot.empty){
            throw new HttpException(`Usuário com o email ${email} não encontrado.`, HttpStatus.NOT_FOUND);
        }
        return this.mapQueryUserResponse(snapshot.docs[0]);
    }

    async authenticate(dto: LoginRequestDTO): Promise<LoginResponseDTO>{
        const user = await this.getByEmail(dto.email);
        if(user != null){
            return bcrypt.compare(dto.password, user.password)
            .then(async (result) => {
                if(result){
                    return firebaseAuth.createCustomToken(user.id, {isAdmin: user.isAdmin})
                    .then((token) => {
                        let response = new LoginResponseDTO();
                        response.token = token;
                        response.userResponse = user;
                        return response;
                    });
                }
                throw new HttpException("Senha incorreta.", HttpStatus.BAD_REQUEST);
            });
        }
    }

    async signup(dto: LoginRequestDTO): Promise<LoginResponseDTO>{
        const user = await this.getByEmail(dto.email).catch((err) => {});
        if(dto.username.length == 0){
            throw new HttpException("Nome de usuário é obrigatório.", HttpStatus.BAD_REQUEST);
        }
        if(dto.password.length < 8){
            throw new HttpException("Senha precisa ter no mínimo 8 caracteres.", HttpStatus.BAD_REQUEST);
        }
        if(user == null){
            return bcrypt.genSalt(10)
            .then((salt) => bcrypt.hash(dto.password, salt))
            .then(async (hash) => {
                return firebaseAuth.createUser({
                    email: dto.email,
                    password: hash,
                    displayName: dto.username
                })
                .then(async (userRecord) => {
                    const ref = firebaseDB.collection("Users").doc(userRecord.uid);
                    const res = await ref.set({
                        email: dto.email,
                        password: hash,
                        username: dto.username,
                        isAdmin: false,
                        isColorBlind: dto.isColorBlind,
                        isDisabled: false
                    });
                    return this.authenticate(dto);
                })
                .catch((err) => {
                    if(err.code == "auth/invalid-email"){
                        throw new HttpException("Email inválido.", HttpStatus.BAD_REQUEST);
                    }
                });
            });
        }
        throw new HttpException("Usuário já existente.", HttpStatus.BAD_REQUEST);
    }

    async delete(id: string){
        await this.getById(id);
        firebaseAuth.updateUser(id, {
            disabled: true
        })
        .then(async (userRecord) => {
            const res = await firebaseDB.collection("Users").doc(id).update({
                isDisabled: true
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async edit(id: string, dto: UserRequestDTO): Promise<UserResponseDTO>{
        return this.getById(id)
        .then(async (user) => {
            let updatedUser = {};
            let firebaseUpdatedUser = {};
            if(dto.username){
                updatedUser["username"] = dto.username;
                firebaseUpdatedUser["displayName"] = dto.username;
                user.username = dto.username;
            }
            if(dto.isColorBlind != undefined){
                updatedUser["isColorBlind"] = dto.isColorBlind;
                user.isColorBlind = dto.isColorBlind;
            }
            return firebaseAuth.updateUser(id, firebaseUpdatedUser)
            .then(async (userRecord) => {
                const res = await firebaseDB.collection("Users").doc(userRecord.uid).update(updatedUser);
                return user;
            })
            .catch((err) => {
                console.log(err);
                throw new HttpException("Erro ao atualizar usuário", HttpStatus.INTERNAL_SERVER_ERROR);
            });
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException(`Usuário com o id: ${id} não encontrado`, HttpStatus.NOT_FOUND);
        })
    }

    async resetPass(email: string, code: string, dto: UserRequestDTO): Promise<LoginResponseDTO>{
        return verifyPassCode(code)
        .then(() => {
            return bcrypt.genSalt(10)
            .then((salt) => bcrypt.hash(dto.password, salt))
            .then(async (hash) => {
                return await this.getByEmail(email)
                .then(async (user) => {
                    return firebaseAuth.updateUser(user.id, {
                        password: hash
                    })
                    .then(async (userRecord) => {
                        const res = await firebaseDB.collection("Users").doc(userRecord.uid).update({
                            password: hash,
                        });
                        let loginRequest = new LoginRequestDTO();
                        loginRequest.email = email;
                        loginRequest.password = dto.password;
                        return await this.authenticate(loginRequest);
                    })
                    .catch((err) => {
                        console.log(err);
                        throw new HttpException("Erro ao alterar usuário", HttpStatus.INTERNAL_SERVER_ERROR);
                    });
                })
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
            throw new HttpException("Código inválido", HttpStatus.BAD_REQUEST);
        });
    }
}