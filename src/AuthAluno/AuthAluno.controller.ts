//é necessário que possamos obter email e senha para confirmação de user
//obs : existem códigos que não valem a pena decorar , mas sim
//entender o porquê por debaixo dos panos e apenas implementar
//por agr as coisas apenas tem que dar certo
import { 
  Body,
    Controller , 
    HttpCode, 
    HttpStatus, 
    Post , 
    Request, 
    Res,
    UseGuards} from '@nestjs/common';
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { AuthAluno } from './models/AuthAlunoRequest';
import { AuthAlunoService } from './AuthAluno.service';
import { LocalAlunoAuthGuard } from './guards/localAluno-auth.guard';
import { LocalAuthGuard } from 'src/Auth/guards/local-auth.guard';
import { Response } from 'express';
import { send } from 'process';
import { AuthJwt } from './models/authJwtDto.dto';


//apenas passar a requisição do client

@Controller('auth-aluno')
export class AuthAlunoController{
   constructor(private readonly authAlunoService:AuthAlunoService){}


   //não será colocada a rota no controlller pois
   //é necessário que o user já vá direto para a post de auth e não para auth
   //é necessário a utilização dos guards e das strategies, tanto o local que pega senha e email qnt a jwt
   

   //, colocarei o @IsPublic, somente quando eu validar ele lá  no jwt
  
  

   //anotation que é responsavel por identificar que o método login retorna um 201

   
   //IsPublic é um decorator personalizado
   
   //importante para realizar a autenticação, sempre deve vir com um LocalStrategy
   
   
   //req é a requisição do tipo AuthRequest que possui email e senha
   @IsPublic()
   @Post('login')
   @HttpCode(HttpStatus.OK)
   @UseGuards(LocalAlunoAuthGuard)
   async login(@Request() req:AuthAluno , @Res() res:Response){

    //lá no authService terá a lógica e o tratamento desses dados do user
   
    try {
      const authObject = await this.authAlunoService.login(req.user);
      
      const userObject = {
      id: authObject.id,
      username:authObject.username,
     
      email:authObject.email,
      
      jwtToken:authObject.access_token

    }
   

    return res.status(202).json({
      status:"Accepted",
      user: userObject,
      accessToken: authObject.access_token
      

    })

    } catch (error) {
      throw error
    }

  }

  @IsPublic()
  @Post('getUser')
  @HttpCode(HttpStatus.OK)
  async getUserByJwt(@Request()  req:AuthJwt , @Res() res:Response){

    try{
    console.log(req.jwtToken);
    const alunoResponse = await this.authAlunoService.getUserByJwt(req.jwtToken);

    if(alunoResponse){
      return res.send(202).json({
        status:'Requisição enviada com sucesso',
        aluno:alunoResponse
      })
    }


    }catch(error){
      throw error
    }

  }

}