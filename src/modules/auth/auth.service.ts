import { SignupAuthDto } from "./dto/signup.dto";
import { hashPassword } from "../../shared/hashPassword";
import AuthRepository from "./auth.repository";
import { comparePassword } from "../../shared/hashPassword";
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { generateToken } from "../../shared/generateToken.shared";
import { RoleRepository } from "../role/role.repository";

export default class AuthService {
    private userRepository = new AuthRepository();
    private RoleRepository = new RoleRepository();


    async signup(data: SignupAuthDto): Promise<any> {
        try {
            const userExist = await this.userRepository.getByEmail(data.email);
            const roleExist = await this.RoleRepository.getByName('usuário registrado');

            if (userExist) return { message: "Email já está em uso" }
            if (!roleExist) return { message: "Role padrão não existe para aplicar ao usuário registrado!" }

            const password_hash = await hashPassword(data.password_hash);

            const newData: SignupAuthDto = {
                name: data.name.toLocaleLowerCase(),
                fullName: data.fullName.toLocaleLowerCase(),
                email: data.email.toLocaleLowerCase(),
                password_hash: password_hash,
                bio: data?.bio?.toLocaleLowerCase(),
                avatarUrl: data?.avatarUrl,
                role_id: roleExist.id
            }
            const createUser = await this.userRepository.signup(newData);
            return { message: "Usuário criado com sucesso", user: createUser }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async signin(data: { email: string, password_hash: string }): Promise<any> {
        try {
            const newData = {
                email: data.email.toLocaleLowerCase(),
                password_hash: data.password_hash
            }

            const user = await this.userRepository.findByEmailWithPassword(newData.email);
            if (!user) return { message: 'Usuário não encontrado' };

            const isPasswordValid = await comparePassword(newData.password_hash, user.password_hash);
            if (!isPasswordValid) {
                return { message: 'Senha inválida' };
            }

            if (user.isTwoFactorEnabled) {
                // Aqui você pode decidir se vai exigir token 2FA agora ou em outra etapa
                return {
                    message: "2FA obrigatório",
                    userId: user.id,
                    twoFactorEnabled: true
                };
            }

            return {
                message: 'Usuário autenticado',
                user: {
                    id: user.id,
                    name: user.name,
                    fullName: user.fullName,
                    email: user.email,
                    isTwoFactorEnabled: user.isTwoFactorEnabled,
                }
            };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async generate2FA(userId: number): Promise<any> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return {
                message: 'Usuário não encontrado'
            }
        }
        if (user.isTwoFactorEnabled && user.twoFactorSecret) {
            return { message: '2FA já ativado para este usuário' };
        }

        const secret = speakeasy.generateSecret({
            name: `BlogApp ${user.email}`
        });
        await this.userRepository.updateTwoFactorSecret(userId, secret.base32);
        const qrCode = await qrcode.toDataURL(secret.otpauth_url || '');
        return {
            message: '2FA Gerado',
            secret: secret.base32,
            qrCode
        };
    }

    async verify2FA(userId: number, token: string): Promise<any> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user || !user.twoFactorSecret) {
                return {
                    message: 'Usuário sem 2FA configurado',
                    user
                }
            }

            const verified = speakeasy.totp.verify({
                secret: user?.twoFactorSecret,
                encoding: 'base32',
                token
            })

            if (!verified) return { message: 'Token 2FA inválido' };


            // Se 2FA não ativado, autentica direto
            // Gera token JWT ou sessão aqui, por exemplo:
            const newUser = {
                id: user.id,
                name: user.name,
                fullName: user.fullName,
                role: user.role
            }
            const jwtToken = generateToken(newUser); // Implemente a função generateJWT conforme seu contexto

            await this.userRepository.updateRefreshToken(user.id, jwtToken.refreshToken);

            return {
                message: '2FA verificado com sucesso',
                user,
                accessToken: jwtToken.accessToken,
                refreshToken: jwtToken.refreshToken
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async logout(userId: number): Promise<{ message: string }> {
        if (!userId || isNaN(userId)) {
            throw new Error("ID do usuário inválido.");
        }
        try {
            await this.userRepository.clearRefreshToken(userId);
            return { message: "Logout realizado com sucesso" };
        }catch(error) {
            console.log(error);
            throw error;
        }
    }
}