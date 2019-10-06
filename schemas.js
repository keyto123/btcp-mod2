const Joi = require('joi');

const createUserBody = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
}).required();

const loginBody = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
}).required();

const createInternalUser = Joi.object().keys({
    Nome: Joi.string().required(),
    Idade: Joi.number().required(),
    Email: Joi.string().email().required(),
    Endereco: Joi.string().allow(null).required()
}).required();

const internalUser = Joi.object().keys({
    ID: Joi.string().uuid().required(),
    Nome: Joi.string().required(),
    Idade: Joi.number().required(),
    Email: Joi.string().email().required(),
    Endereco: Joi.string().allow(null).required()
}).required();

const queryID = Joi.object().keys({
    id: Joi.string().uuid().required()
}).required()

module.exports = {
    createUserBody,
    loginBody,
    createInternalUser,
    internalUser,
    queryID,
}