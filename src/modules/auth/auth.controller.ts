import { Request, Response } from "express";
import { SignupAuthDto } from "./dto/signup.dto";
import AuthService from "./auth.service";
import { validationSignupSchema } from "./schema/validation-signup.schema";
import { validation2FAGenerationSchema } from "./schema/validation-2faGenerate.schema";
import { validation2FAverifySchema } from "./schema/validation-2faVerify.schema";
import { IUser } from "../user/interfaces/user.interface";


export default class AuthController {
    constructor(private readonly authService: AuthService) { }

    async signup(req: Request, res: Response): Promise<Response<any>> {
        try {
            const signupAuthDto: SignupAuthDto = req.body;
            const validation = validationSignupSchema.safeParse(signupAuthDto);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    error: validation.error.flatten().fieldErrors
                })
            }
            const user = await this.authService.signup(signupAuthDto);
            return res.status(201).json({ message: 'Usuario registrado!', user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar registrar usuário!'
            })
        }
    }

    async signin(req: Request, res: Response): Promise<Response<any>> {
        try {
            const result = await this.authService.signin(req.body);
            console.log(result)
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Credenciais inválidas" });
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