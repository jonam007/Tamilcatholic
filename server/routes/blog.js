import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// Get published blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = { isPublished: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (tag) {
      filter.tags = { $in: [tag] };
    }
    
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .select('-content'); // Exclude full content for list view
    
    const total = await BlogPost.countDocuments(filter);
    
    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
});

// Create new blog post (Admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featuredImage, isPublished } = req.body;
    
    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and excerpt are required'
      });
    }
    
    let slug = generateSlug(title);
    
    // Ensure unique slug
    let counter = 1;
    let originalSlug = slug;
    while (await BlogPost.findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    const postData = {
      title,
      slug,
      content,
      excerpt,
      author: req.user._id,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      readingTime: Math.ceil(content.split(' ').length / 200) // Estimate reading time
    };
    
    const post = new BlogPost(postData);
    await post.save();
    await post.populate('author', 'name avatar');
    
    res.status(201).json({
      success: true,
      post,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
});

// Update blog post (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featuredImage, isPublished } = req.body;
    
    const updateData = {
      title,
      content,
      excerpt,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage,
      isPublished,
      readingTime: content ? Math.ceil(content.split(' ').length / 200) : undefined
    };
    
    // Update slug if title changed
    if (title) {
      const currentPost = await BlogPost.findById(req.params.id);
      if (currentPost && currentPost.title !== title) {
        let newSlug = generateSlug(title);
        let counter = 1;
        let originalSlug = newSlug;
        while (await BlogPost.findOne({ slug: newSlug, _id: { $ne: req.params.id } })) {
          newSlug = `${originalSlug}-${counter}`;
          counter++;
        }
        updateData.slug = newSlug;
      }
    }
    
    // Set publishedAt if publishing for the first time
    if (isPublished) {
      const currentPost = await BlogPost.findById(req.params.id);
      if (currentPost && !currentPost.isPublished) {
        updateData.publishedAt = new Date();
      }
    }
    
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      post,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
});

// Delete blog post (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
});

// Get all posts for admin
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .select('-content');
    
    const total = await BlogPost.countDocuments();
    
    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
});

export default router;