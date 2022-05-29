import { Application } from "express";
import passport from "passport";

export default function (app: Application) {
    app.post("/token", passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
        function (req, res) {
            const { username } = req.user as any;
            res.redirect('/~' + username);
        });
}