import { Router } from 'express';

import articleController from '../controllers/article';
import upload from '../middlewares/upload';
import protect from '../middlewares/auth';

const articleApi = Router();

articleApi
  .route('/articles')
  .get(articleController.getArticles)
  .post(upload, articleController.createArticle);

articleApi
  .route('/articles/:articleId')
  .get(articleController.getArticle)
  .delete(protect, articleController.deleteArticle)
  .put(protect, articleController.updateArticle);

export default articleApi;
