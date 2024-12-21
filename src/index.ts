import express from "express";
import dotenv from 'dotenv'
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from "passport";
import Auth0Strategy, { Profile } from 'passport-auth0'

import UserRoutes from './routes/user'
import AuthRoutes from './routes/auth'
import { PrismaClient, User as PrismaUser, User } from "@prisma/client";

// INITIALIZING
dotenv.config();
const app = express();
app.use(express.json());

//SESSION CONFIG
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    ),
    saveUninitialized: false,
    cookie: {
        secure: app.get("env") === "production",
        maxAge: 60 * 10000
    }
}));

//AUTH0 STRATEGY
const strategy = new Auth0Strategy({
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN!,
    callbackURL: process.env.AUTH0_CALLBACK_URL!
}, function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
})

//PASSPORT CONFIG
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session())

const prisma = new PrismaClient()

passport.serializeUser(function (user: any, done) {
    done(null, user.id)
})

passport.deserializeUser(async function (id: string, done) {
    try {
        const user = await prisma.user.findUnique({ where: { id } }); // Encontrar o usuário no banco de dados
        done(null, user); // Recupera os dados do usuário e os coloca na sessão
    } catch (err) {
        done(err);
    }
});

//ROUTES
app.use("/user", UserRoutes);
app.use("/auth", AuthRoutes);
app.get("/", (req, res) => {
    res.send("HOME");
})


//LISTEN
app.listen(process.env.PORT || 3333, () => {
    console.log("Server running on port 8000")
});