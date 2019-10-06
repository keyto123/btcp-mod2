const uuid4 = require('uuid/v4');
const fs = require('fs');
const moment = require('moment');

const loginsPath = './dbs/logins.json';
const tokensPath = './dbs/tokens.json';

class loginDB {
    constructor() {
        this.users = require(loginsPath);
        this.tokens = require(tokensPath);

        this.userPromise = null;
        this.tokenPromise = null;

        this.updateUsers = this.updateUsers.bind(this);
        this.updateTokens = this.updateTokens.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.checkToken = this.checkToken.bind(this);
    }

    updateUsers() {
        return new Promise((resolve, reject) => {
            fs.writeFileSync(loginsPath, JSON.stringify(this.users));
            resolve()
        })
    }

    updateTokens() {
        return new Promise((resolve, reject) => {
            fs.writeFileSync(tokensPath, JSON.stringify(this.tokens));
            resolve();
        })
    }

    createAccount(username, password) {
        if(this.users[username]) {
            throw { status: 409, message: 'Usuário já existe' }
        }

        this.users[username] = {
            username,
            password,
        }

        this.updateUsers();
    }

    login(username, password) {
        const user = this.users[username];
        if(!user || password !== user['password']) {
            throw { status: 400, message: 'Usuário ou senha inválido' };
        }
        const token = uuid4();
        this.tokens[token] = {
            value: token,
            expiration: moment().add(1, 'minute'),
            user: username,
            valid: true
        };

        this.updateTokens();

        return token;
    }

    logout(token) {
        if(!token) {
            throw { status: 400, message: 'Token não fornecido' };
        }

        if(!this.tokens[token]) {
            throw { status: 404, message: 'Usuário não está logado' };
        }

        delete this.tokens[token];
        this.updateTokens();
    }

    checkToken(token) {
        if(!token) {
            throw { status: 400, message: 'Token não fornecido' };
        }

        const _token = this.tokens[token];
        if(!_token) {
            throw { status: 404, message: 'Token não encontrado' };
        }

        if(!_token.valid) {
            throw { status: 401, message: 'Token inválido' }
        }

        const isExpired = moment().diff(_token.expiration) >= 0;
        if(isExpired) {
            _token.valid = false;
            this.updateTokens();
            throw { status: 401, message: 'Token expirado' };
        }

        return true;
    }
}

module.exports = new loginDB();