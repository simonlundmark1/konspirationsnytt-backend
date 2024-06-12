const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all posts
router.get('/', authenticateToken, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: true
            }
        });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    if (req.user) {
        console.log('Authenticated user:', req.user);  // Kontrollera användaren
        try {
            const { content } = req.body;
            const post = await prisma.post.create({
                data: {
                    content: content,
                    userId: req.user.id
                },
                include: {
                    user: true  // Inkludera användarinformation i svaret
                }
            });
            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(403).send('Unauthorized');
    }
});

// Export the router
module.exports = router;
