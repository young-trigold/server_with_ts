import { Router } from 'express';

import userController from '../controllers/article';
import protect from '../middlewares/auth';

const userApi = Router();

userApi.post('/register', userController.register);
userApi.post('/login', userController.login);
userApi.get('/validateRole', protect, userController.validateRole);

export default userApi;
