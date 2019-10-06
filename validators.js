function bodyValidator(schema) {
    return function(req, res, next) {
        const result = schema.validate(req.body);
        if(result.error) {
            res.status(400).send({ error_message: 'Formato inválido de body' });
        } else {
            return next();
        }
    }
}

function headerValidator(schema) {
    return function(req, res, next) {
        const result = schema.validate(req.headers);
        if(result.error) {
            res.status(400).send({ error_message: 'Formato inválido de headers' });
        } else {
            return next();
        }
    }
}

function queryValidator(schema) {
    return function(req, res, next) {
        const result = schema.validate(req.params);
        if(result.error) {
            res.status(400).send({ error_message: 'Formato inválido de query' });
        } else {
            return next();
        }
    }
}

function tokenValidator(req, res, next) {
    const auth = req.headers.authorization;

    if(!auth) {
        res.status(400).send({ error_message: 'Authorization não fornecido' });
    }

    const token = auth.split(' ')[1];
    if(!token) {
        res.status(400).send({ error_message: 'Token não fornecido' });
    }

    req.token = token;
    return next();
}

module.exports = {
    bodyValidator,
    headerValidator,
    queryValidator,
    tokenValidator
}