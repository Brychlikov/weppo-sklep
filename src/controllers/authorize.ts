import { User } from "../models/User";

export function authorize(...args: string[]) {
    return function (req: any, res: any, next: any) {
        if (req.signedCookies.user) {
            req.user = req.signedCookies.user;
            (async function () {
                var user = await User.findByName(req.user);
                if (user == null || !args.includes(user.role)) {
                    // res.redirect('/login?returnUrl=' + req.url);
                    res.redirect("/annonymous");
                } else {
                    next();
                }
            })();
        } else {
            // res.redirect('/login?returnUrl=' + req.url);
            res.redirect("/annonymous");
        }
    };
}
