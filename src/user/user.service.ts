import { Injectable } from "@nestjs/common";
import UserRequestDTO from "./dto/UserRequest.dto";
import UserResponseDTO from "./dto/UserResponse.dto";
import { firebaseAuth, firebaseDB } from "src/firebase";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import * as bcrypt from "bcrypt";
import LoginRequestDTO from "./dto/LoginRequest.dto";
import LoginResponseDTO from "./dto/LoginResponse.dto";

@Injectable()
export default class UserService{
    constructor(@InjectMapper() private mapper: Mapper){}

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

    async getById(id: string): Promise<UserResponseDTO | null>{
        return firebaseDB.collection("Users").doc(id).get()
        .then((doc) => {
            if(!doc.exists){
                throw new Error("Usuário não encontrado");
            }
            return this.mapQueryUserResponse(doc);
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
    }

    async getByEmail(email: string): Promise<UserResponseDTO | null>{
        const usersRef = firebaseDB.collection("Users");
        let snapshot = await usersRef.where("email", "==", email).get();
        if(snapshot.empty){
            return null;
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
                return null;
            });
        }
        return null;
    }

    async signup(dto: LoginRequestDTO): Promise<LoginResponseDTO | null>{
        const user = await this.getByEmail(dto.email);
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
                    console.log(err);
                });
            });
        }
        return null;
    }

    delete(id: string){
        this.getById(id);
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

    async resetPass(id: string, dto: UserRequestDTO): Promise<UserResponseDTO>{
        return this.getById(id)
        .then(async (user) => {
            return bcrypt.genSalt(10)
            .then((salt) => bcrypt.hash(dto.password, salt))
            .then(async (hash) => {
                return firebaseAuth.updateUser(id, {
                    password: hash
                })
                .then(async (userRecord) => {
                    const res = await firebaseDB.collection("Users").doc(userRecord.uid).update({
                        password: hash,
                    });
                    return this.getById(userRecord.uid);
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }
}