//é necessário que possamos obter email e senha para confirmação de user
//obs : existem códigos que não valem a pena decorar , mas sim
//entender o porquê por debaixo dos panos e apenas implementar
//por agr as coisas apenas tem que dar certo
import { 
    Controller , 
    HttpCode, 
    HttpStatus, 
    Post , 
    Request, 
    Res,
    UseGuards,
    Get,
    Req
  } from '@nestjs/common';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthRequest } from './models/authRequest';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { send } from 'process';


//apenas passar a requisição do client

@Controller('auth')
export class AuthController{
   constructor(private readonly authService:AuthService){}


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
   @UseGuards(LocalAuthGuard)
   async login(@Request() req:AuthRequest , @Res() res:Response){

    //lá no authService terá a lógica e o tratamento desses dados do user

    try {
      
      const authObject = await this.authService.login(req.user);
      return res.status(202).json({
      status:202,
      accessToken: authObject.access_token
     })

    } catch (error) {
      throw error
    }


  }

  @IsPublic()
  @Get('data')
  async getUser(@Req() req){

    try {
      const authUser = req.headers.authorization;
  
      const token = authUser && authUser.split(' ')[1];

      if(token){
        const user = await this.authService.findUserBySub(token);
        if(user){
          return {
             status:202,
             user:user
          }
          
        }else{
          return {
            status:401,
            message:'Usuário inexistente!'

          }
        }
       }else{
      return{
         status:403,
         message:'Token Inválido ! Tente novamente mais tarde'
      }
    }
    
   } catch (error) {
    throw new Error
   }

  }


}