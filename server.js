const express = require ('express')
const server = require('express')();
const apiRouter = require('./routes/api');

server.use(express.json())
server.use('/api', apiRouter);

module.exports = server;
