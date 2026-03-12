import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Cake from '../models/Cake';

// @desc    Get all cakes
// @route   GET /api/cakes
// @access  Public
export const getCakes = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.limit) || 30;
  const page = Number(req.query.page) || 1;
  const category = req.query.category ? { category: req.query.category as string } : {};
  
  const keyword = req.query.search
    ? {
        name: {
          $regex: req.query.search as string,
          $options: 'i',
        },
      }
    : {};

  const query = { ...keyword, ...category };

  const count = await Cake.countDocuments(query);
  const cakes = await Cake.find(query)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    data: cakes,
    page,
    totalPages: Math.ceil(count / pageSize),
    totalProducts: count
  });
});

// @desc    Get cake by ID
// @route   GET /api/cakes/:id
// @access  Public
export const getCakeById = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.findById(req.params.id);
  if (cake) {
    res.json({ success: true, data: cake });
  } else {
    res.status(404);
    throw new Error('Cake not found');
  }
});

// @desc    Get cake by slug
// @route   GET /api/cakes/slug/:slug
// @access  Public
export const getCakeBySlug = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.findOne({ slug: req.params.slug });
  if (cake) {
    res.json({ success: true, data: cake });
  } else {
    res.status(404);
    throw new Error('Cake not found');
  }
});

// @desc    Create a cake
// @route   POST /api/cakes
// @access  Private/Admin
export const createCake = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, price, category } = req.body;
  
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFiles = files?.['images'] || [];
  const videoFiles = files?.['video'] || [];

  const images = imageFiles.map((file: any) => file.path);
  const video = videoFiles.length > 0 ? (videoFiles[0] as any).path : undefined;

  const cake = await Cake.create({
    name,
    slug,
    description,
    price: Number(price),
    category,
    images: images.length > 0 ? images : [], 
    video,
  });

  res.status(201).json({ success: true, data: cake });
});

// @desc    Update a cake
// @route   PUT /api/cakes/:id
// @access  Private/Admin
export const updateCake = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, price, category } = req.body;
  
  const cake = await Cake.findById(req.params.id);
  
  if (cake) {
    cake.name = name || cake.name;
    cake.slug = slug || cake.slug;
    cake.description = description || cake.description;
    cake.price = price !== undefined ? Number(price) : cake.price;
    cake.category = category || cake.category;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files) {
      if (files['images']) {
        const images = files['images'].map((file: any) => file.path);
        cake.images = images.length > 0 ? images : cake.images;
      }
      if (files['video']) {
         cake.video = (files['video'][0] as any).path;
      }
    }

    const updatedCake = await cake.save();
    res.json({ success: true, data: updatedCake });
  } else {
    res.status(404);
    throw new Error('Cake not found');
  }
});

// @desc    Delete a cake
// @route   DELETE /api/cakes/:id
// @access  Private/Admin
export const deleteCake = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.findById(req.params.id);
  
  if (cake) {
    await cake.deleteOne();
    res.json({ success: true, message: 'Cake removed' });
  } else {
    res.status(404);
    throw new Error('Cake not found');
  }
});
