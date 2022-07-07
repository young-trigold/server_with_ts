import { Request, Response } from 'express';
import fsPromise from 'fs/promises';
import path from 'path';

import Article from '../models/article.js';
import Comment from '../models/comment.js';
import isRelated from '../utils/isRelated.js';

const getArticles = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  if (keyword) {
    const articles = await Article.find();
    const result = articles.filter((article) => isRelated(article.title, String(keyword)));
    res.status(200).json(result);
  } else {
    try {
      const tags = await Article.aggregate([
        {
          $group: {
            _id: '$tag',
            articles: { $addToSet: '$$ROOT' },
            count: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(tags.sort((a, b) => b.count - a.count));
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ message: '服务器错误!', stack: error.stack });
    }
  }
};

const getArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { views: 1 } },
      { upsert: true },
    ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

    if (article) {
      const buffers = await fsPromise.readFile(path.resolve(__dirname, '../', article.url));

      res.status(200).json({ comments: article.comments, content: buffers.toString() });
    } else {
      res.status(404).json({ message: '找不到该文章!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const createArticle = async (req: Request, res: Response) => {
  const newArticle = new Article({
    title: `${req?.file?.originalname.split('.')[0]}`,
    url: `${req?.file?.destination}${req?.file?.filename}`,
    tag: `${req.body.tag}`,
    likes: 0,
    views: 0,
  });

  try {
    const articleWithSameTitle = await Article.findOne({
      title: `${req?.file?.originalname.split('.')[0]}`,
    });
    if (articleWithSameTitle) {
      res.status(409).json({ message: '文章已经存在!' });
    } else {
      await newArticle.save();
      res.status(200).json(newArticle);
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  const { user } = req;
  const { articleId } = req.params;

  if (user.role === 'admin') {
    try {
      Article.findByIdAndRemove(articleId).then((article) => {
        if (article) {
          fsPromise
            .unlink(path.resolve(__dirname, '../', article.url))
            .then(() => res.status(200).json(article));
        } else {
          res.status(404).json({ message: '找不到该文章!' });
        }
      });
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ message: '服务器错误!', stack: error.stack });
    }
  } else {
    res.status(401).json({ message: '权限不足!' });
  }
};

const updateArticle = async (req: Request, res: Response) => {
  const { user } = req;
  const { articleId } = req.params;
  const { addLikes, comment } = req.body;

  try {
    if (addLikes) {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { likes: 1 } },
        { upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedArticle);
    }

    if (comment) {
      const newComment = new Comment({
        user: user.id,
        content: comment,
      });

      await newComment.save();

      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          $push: {
            comments: {
              _id: newComment._id,
            },
          },
        },
        { safe: true, upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedArticle);
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

export default { getArticles, createArticle, deleteArticle, updateArticle, getArticle };
