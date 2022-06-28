import { Router } from 'express';

import noteController from '../controllers/article';
import protect from '../middlewares/auth';
import upload from '../middlewares/upload';

const noteApi = Router();

noteApi.route('/notes').get(noteController.getNotes).post(noteController.createNote);
noteApi.get('/chapters', noteController.getChapters);
noteApi.get('/chapters/:noteId', noteController.getChaptersByNoteId);

noteApi
  .route('/notes/:chapterId')
  .get(noteController.getChapter)
  .put(protect, noteController.updateChapter);

noteApi
  .route('/notes/:noteId/:chapterId')
  .post(upload, noteController.createChapter)
  .delete(protect, noteController.deleteChapter);

export default noteApi;
