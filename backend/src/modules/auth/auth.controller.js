const authService = require("./auth.service");
const { AuthBody } = require("../../schemas");

exports.signup = async (req, res) => {
    const body = AuthBody.safeParse(req.body ?? {});
    if (!body.success) {
        return res.status(400).json({ error: body.error.issues[0].message });
    }
    const user = await authService.createUser(body.data.username, body.data.password);
    if (!user) {
        return res
            .status(409)
            .json({ error: "that username is already taken" });
    }
    res.status(201).json({ token: authService.signToken(user), user });
};

exports.login = async (req, res) => {
    const body = AuthBody.safeParse(req.body ?? {});
    if (!body.success) {
        return res.status(400).json({ error: body.error.issues[0].message });
    }
    const user = await authService.verifyCredentials(body.data.username, body.data.password);
    if (!user) {
        return res.status(401).json({ error: "invalid username or password" });
    }
    res.json({ token: authService.signToken(user), user });
};
