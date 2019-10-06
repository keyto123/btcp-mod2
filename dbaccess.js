const uuid4 = require('uuid/v4');
const fs = require('fs');

const dbsPath = './dbs/db.json';

class UserDB {

    constructor() {
        this.usersHash = require(dbsPath);
        this.users = Object.keys(this.usersHash).map(function(user) { return user });
        this.saveQueue = [];
        this.savePromise = null;

        this._save = this._save.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    _save() {
        if(this.saveQueue.length > 0) {
            return this.savePromise;
        }
        this.saveQueue.push(null);
        this.savePromise = new Promise((resolve) => {
            while(this.saveQueue.length > 0) {
                this.saveQueue.shift();
                fs.writeFileSync(dbsPath, JSON.stringify(this.usersHash));
            }
            resolve();
        });
        return this.savePromise;
    }

    get(id) {
        const user = this.usersHash[id];
        if(!user) {
            throw { status: 404, message: 'Usuário não existe' };
        }
        return user;
    }

    getAll() {
        return this.users.map(user => this.usersHash[user]);
    }

    update(body, waitWrite = false) {
        this.usersHash[body.ID] = body;

        const save = this._save();
        if(waitWrite) {
            return save.then(function() { return user });
        } else {
            return body;
        }
    }

    create(body, waitWrite = false) {
        if(body.ID) {
            throw { status: 400, message: 'Campo ID não deve existir' };
        }

        const newUser = {
            ID: uuid4(),
            Nome: body.Nome,
            Idade: body.Idade,
            Email: body.Email,
            Endereco: body.Endereco
        }

        this.usersHash[newUser.ID] = newUser;
        this.users.push(newUser.ID);

        const save = this._save();
        if(waitWrite) {
            return save.then(function() { return newUser });
        } else {
            return newUser;
        }
    }

    delete(id, waitWrite = false) {
        if(!this.usersHash[id]) {
            throw { status: 404, message: 'Usuário não encontrado' };
        }

        delete this.usersHash[id];
        const index = this.users.findIndex(function(user) { return user === id });
        this.users.splice(index, 1);

        const save = this._save();
        if(waitWrite) {
            return save;
        }
    }
}

module.exports = new UserDB();