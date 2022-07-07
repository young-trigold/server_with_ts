import { Router } from 'express';

import articleController from '../controllers/article.js';
import upload from '../middlewares/upload.js';
import protect from '../middlewares/auth.js';

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
