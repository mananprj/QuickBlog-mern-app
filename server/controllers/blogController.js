import fs from "fs"
import imagekit from "../configs/imageKit.js";
import Blog from "../models/blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req,res) => {
    try {

        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if(!title || !subTitle || !category || !imageFile){
            return res.json({success: false, message: "All fields are required"});
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: "auto"},
                {format: "webp"},
                {width: "1280"}
            ]
        })

        const image = optimizedImageUrl;

        await Blog.create({title, subTitle, description, category, image, isPublished});

        return res.json({success: true, message: "Blog added successfully"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const getAllBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find({isPublished: true});

        return res.json({success: true, blogs});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const getBlogById = async (req, res) => {
    try {
        
        const {blogId} = req.params;

        const blog = await Blog.findById(blogId);

        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }

        return res.json({success: true, blog})

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        
        const {id} = req.body;

        await Blog.findByIdAndDelete(id);

        await Comment.deleteMany({blog: id});

        return res.json({success: true, message: "Blog deleted successfully"})

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const togglePublish = async (req, res) => {
    try {

        const {id} = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();

        return res.json({success: true, message: "Blog status updated"})
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const addComment = async (req, res) => {
    try {

        const {blog, name, content} = req.body;
        
        await Comment.create({blog, name, content});

        return res.json({success: true, message: "Comment added for review"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const getBlogComment = async (req, res) => {
    try {

        const {blogId} = req.body;

        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});

        return res.json({success: true, comments});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const generateContent = async (req, res) => {
    try {

        const {prompt} = req.body;
        const content = await main(prompt + "Generate a blog content for this topic in simple text formate");

        return res.json({success: true, content});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}