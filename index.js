const express = require('express');

const {
    createUserBody,
    loginBody,
    createInternalUser,
    internalUser,
    queryID
} = require('./schemas');

const {
    bodyValidator,
    queryValidator,
    tokenValidator
} = require('./validators');

const {
    baseErrorHandler
} = require('./utils');

const userDB = require('./dbaccess');
const loginDB = require('./login');

const server = express();
server.use(express.json());

server.post(
    '/create-user',
    bodyValidator(createUserBody),
    function(req, res) {
        const { username, password } = req.body;
        try {
            loginDB.createAccount(username, password);
            res.status(204).send();
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
)

server.post(
    '/login',
    bodyValidator(loginBody),
    function(req, res) {
        const { username, password } = req.body;

        try {
            return res.json(loginDB.login(username, password));
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
);

server.post(
    '/logout',
    tokenValidator,
    function(req, res) {
        try {
            loginDB.logout(req.token);
            res.status(204).send();
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
)

server.get(
    '/test-login',
    tokenValidator,
    function(req, res) {
        try {
            loginDB.checkToken(req.token);
            res.status(204).send();
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
);

server.get(
    '/users',
    function(req, res) {
        return res.json(userDB.getAll());
    }
);

server.get(
    '/users/:id',
    queryValidator(queryID),
    function(req, res) {
        const id = req.params.id;

        try {
            return res.json(userDB.get(id));
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
);

server.put(
    '/users',
    bodyValidator(internalUser),
    function(req, res) {
        const user = req.body;

        try {
            return res.json(userDB.update(user));
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
);

server.post(
    '/users',
    bodyValidator(createInternalUser),
    function(req, res) {
        const userInfo = req.body;

        try {
            const result = userDB.create({
                Nome: userInfo.Nome,
                Idade: userInfo.Idade,
                Email: userInfo.Email,
                Endereco: userInfo.Endereco
            });
            return res.json(result);
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
);

server.delete(
    '/users/:id',
    queryValidator(queryID),
    function(req, res) {
        const id = req.params.id;

        try {
            userDB.delete(id);
            res.status(204).send();
        } catch(error) {
            baseErrorHandler(error, res);
        }
    }
);

server.listen(3005);