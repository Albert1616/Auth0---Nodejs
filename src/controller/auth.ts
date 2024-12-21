import { Request, Response } from "express";
import passport from "passport";

export const Login = (req: Request, res: Response) => {
    // A função passport.authenticate retorna uma função middleware.
    // Isso fará com que o usuário seja redirecionado para a página de login do Auth0.
    passport.authenticate('auth0', { scope: 'openid email profile' })(req, res);
};

export const CallBack = (req: Request, res: Response) => {
    passport.authenticate('auth0', {
        failureRedirect: '/'
    })
    res.redirect('/');
}