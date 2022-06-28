import path from 'path';

import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import articleApi from './apis/article';
import noteApi from './apis/note';
import userApi from './apis/user';
import connectingToDB from './db';

dotenv.config();

const { log } = console;

const server = express();

server.use(
  cors({
    origin: ['http://www.trigold.tech'],
  }),
);

server.use(morgan('dev'));
server.use(compression());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(path.join(__dirname, 'dist')));

server.use('/api', articleApi);
server.use('/api', noteApi);
server.use('/api', userApi);

server.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT;

server.listen(port, () => log(`web 服务器进程已经监听在 localhost:${port}`));

connectingToDB();
