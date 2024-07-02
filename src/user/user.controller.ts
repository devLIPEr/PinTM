import { Get, Controller, Render, Post, Body, Put, Delete, Param, Res, Req } from '@nestjs/common';
import UserService from './user.service';
import UserRequestDTO from './dto/UserRequest.dto';
import { Request, Response } from 'express';
import LoginRequestDTO from './dto/LoginRequest.dto';
import { firebaseAuth } from 'src/firebase';
import { RequestWithUser } from 'src/middleware/user.middleware';

@Controller('user')
export class UserController {
  constructor(private userService: UserService){}

  // Base Pages
  @Get('/login')
  @Render('login')
  branchIndex(){}

  @Get('/signup')
  @Render('signup')
  branchSignup(){}

  @Get('/account')
  @Render('minhasRepos')
  branchMinhasRepos(){}

  @Get('/accountInfo')
  @Render('minhaConta')
  branchMinhaConta(){}
  
  @Get('/resetPassword')
  @Render('resetPassword')
  branchResetPass(){}

  // Requests
  @Post("/login")
  authenticate(@Body() dto: LoginRequestDTO, @Res() res: Response){
    this.userService.authenticate(dto)
    .then((response) => {
      if(response != null){
        res.cookie('token', response.token, {maxAge: 60*60*1000, httpOnly: true}); // 1 hour cookie
        var jsonResponse = JSON.stringify({
          username: response.userResponse.username,
          isColorBlind: response.userResponse.isColorBlind,
          isAdmin: response.userResponse.isAdmin
        });
        res.send(jsonResponse);
      }
    })
    .catch((err) => {
      res.status(err.status).send({error: err.message});
    });
  }
  
  @Post("/signup")
  signup(@Body() dto: LoginRequestDTO, @Res() res: Response){
    this.userService.signup(dto)
    .then((response) => {
      if(response != null){
        res.cookie('token', response.token, {maxAge: 60*60*1000, httpOnly: true}); // 1 hour cookie
        res.send(JSON.stringify({
          username: response.userResponse.username,
          isColorBlind: response.userResponse.isColorBlind
        }));
      }
    })
    .catch((err) => {
      res.status(err.status).send({error: err.message});
    });
  }

  @Put("/resetPassword/:id")
  resetPass(@Param("id") id: string, @Body() dto: UserRequestDTO, @Res() res: Response){
    this.userService.resetPass(id, dto)
    .then((user) => {
      res.clearCookie('token');
      res.redirect("/user/login");
    })
    .catch((err) => {
      console.log(err);
    });
  }

  @Delete(":id")
  delete(@Param() id: string, @Req() req: Request, @Res() res: Response){
    if(req.cookies && req.cookies['token']){
      firebaseAuth.verifyIdToken(req.cookies['token'])
      .then((decodedToken) => {
        if(decodedToken.uid == id){
          this.userService.delete(decodedToken.uid);
        }
      })
    }
    res.end();
  }

  // Test token
  @Post('/verifyToken')
  verifyToken(@Req() req : RequestWithUser, @Res() res : Response){
    if(!req.user){
      return res.status(403).send({message : "No user found."});
    }
    res.json(req.user);
  } 

  @Get('/deleteCookie')
  async deleteCookie(@Req() req : Request, @Res() res : Response){
    res.clearCookie('token', {httpOnly: true});
  }
}