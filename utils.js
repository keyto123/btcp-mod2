function baseErrorHandler(error, res) {
    if(!error.status) {
        res.status(500).send('Erro interno');
    } else {
        res.status(error.status).send({ error_message: error.message });
    }
}

module.exports = {
    baseErrorHandler
}