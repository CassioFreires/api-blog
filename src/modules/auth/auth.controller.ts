import { Request, Response } from "express";
import { SignupAuthDto } from "./dto/signup.dto";
import AuthService from "./auth.service";
import { validationSignupSchema } from "./schema/validation-signup.schema";
import { validation2FAGenerationSchema } from "./schema/validation-2faGenerate.schema";
import { validation2FAverifySchema } from "./schema/validation-2faVerify.schema";
import jwt from 'jsonwebtoken';
import { UserService } from "../user/user.service";

export default class AuthController {
    private userService = new UserService();
    constructor(private readonly authService: AuthService) { }

    async signup(req: Request, res: Response): Promise<Response<any>> {
        try {
            const signupAuthDto: SignupAuthDto = req.body.data;
            console.log(signupAuthDto)
            const validation = validationSignupSchema.safeParse(signupAuthDto);

             const resultUser = await this.userService.getByEmail(signupAuthDto.email);

            if (resultUser) {
                return res.status(400).json({ message: 'Email já está em uso'});
            }

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    error: validation.error.flatten().fieldErrors
                })
            }

            const user = await this.userService.create(signupAuthDto);
            return res.status(201).json({ message: 'Usuario registrado!', user });
        } catch (error:any) {
            console.error('Error creating user:', error);
            // Tratamento específico para erro de e-mail duplicado (fallback caso falhe o getByEmail)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'E-mail já registrado' });
            }

            return res.status(500).json({
                message: 'Internal server error while creating user'
            });
        }
    }

    async signin(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.authService.signin(req.body);

            // Verificações específicas por mensagem de erro
            if (result?.message === 'Usuário não encontrado') {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            if (result?.message === 'Senha inválida') {
                return res.status(401).json({ message: 'Senha inválida' });
            }

            const privateKey = String(process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY);
            const token = jwt.sign(result, privateKey, { expiresIn: '1d' });
            // Sucesso: retorna token e usuário
            return res.status(200).json({
                token,
                result
            });

        } catch (error: any) {
            console.error('[ERRO - SIGNIN]', error);

            // Verifica se o erro tem uma mensagem específica
            const message = error?.message || 'Erro interno do servidor';

            return res.status(500).json({ message });
        }
    }


    async generate2FA(req: Request, res: Response): Promise<Response<any>> {
        try {
            const userId = req.body.userId;
            const validation = validation2FAGenerationSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'O ID do usuário é obrigatório'
                });
            }
            const result = await this.authService.generate2FA(userId);
            return res.json({ message: '2FA gerado com sucesso', result })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async verify2FA(req: Request, res: Response): Promise<Response<any>> {
        try {
            const { userId, token } = req.body;
            const validation = validation2FAverifySchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    message: "Validation failed",
                    error: validation.error.flatten().fieldErrors
                })
            }
            const result = await this.authService.verify2FA(userId, token);
            if (!result.user) {
                return res.status(400).json({
                    result
                })
            }
            return res.json({
                message: 'Autenticado com sucesso',
                result
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar verificar o 2FA',
                error
            })
        }
    }

    async logout(req: Request, res: Response): Promise<Response<any>> {
        try {
            const { userId } = req.body;

            if (!userId || typeof userId !== 'number') {
                return res.status(400).json({
                    message: "O ID do usuário é obrigatório e deve ser um número válido"
                });
            }

            const result = await this.authService.logout(userId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Erro no logout:", error);
            return res.status(500).json({
                message: "Erro ao realizar logout",
                error
            });
        }
    }
}