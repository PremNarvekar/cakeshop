import express from 'express';
import {
  getCakes,
  getCakeById,
  getCakeBySlug,
  createCake,
  updateCake,
  deleteCake,
} from '../controllers/cake.controller';
import { adminProtect } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

router.get('/slug/:slug', getCakeBySlug);

router
  .route('/')
  .get(getCakes)
  .post(
    adminProtect,
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]),
    createCake
  );

router
  .route('/:id')
  .get(getCakeById)
  .put(
    adminProtect,
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]),
    updateCake
  )
  .delete(adminProtect, deleteCake);

export default router;
