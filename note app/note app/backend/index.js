const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const AWS = require("aws-sdk");
const { createUser, loginUser, getUserByEmail } = require("./users");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const { authenticationToken } = require("./fucntions");
const { addNote, getNoteById, editNote, getNotesByEmail, deleteNoteById } = require("./notes");
const { uploadFileToS3, downloadFileFromS3 , deleteFileFromS3} = require('./S3');


AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

app.use(cors({
    origin: "*",
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "notes";

app.post('/api/createUser', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await createUser(name, email, password);
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        await loginUser(email, password);
        const user = await getUserByEmail(email)
        const token = jwt.sign(user , process.env.SECRET , {
            expiresIn: "3600m",
        })
        res.status(200).json({ message: "User logined successfully" , accessToken: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "user not found" });
    }
});


app.get('/api/getUser' , authenticationToken , async (req , res) => {
    const user = req.user
    try {
        const userData = await getUserByEmail(user.email)
        res.status(200).json({ name: userData.name , email: userData.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "cannot retrieve user" });
    }
})

app.post('/api/addNote' ,authenticationToken, async (req, res) =>{
    const {title , content} = req.body
    const  user  = req.user
   
    try {
        await addNote(title , content , user.email)
        res.status(200).json({ message: "note added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "cannot add note" });
    }

})

app.put('/api/editNote/:noteId' ,authenticationToken , async (req,res) =>{
    const noteId = req.params.noteId
    const {title , content} = req.body
    const  user  = req.user

    try {
        const note = await getNoteById(noteId)
        if(note){
            if (title)
                note.title = title
            if(content)
                note.content = content
                 
        }
        await editNote(note)
        res.status(200).json({ message: "note edited successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "cannot edit note" });
    }
})


app.get('/api/myNotes' , authenticationToken , async (req , res) =>{
    user=req.user
    try {
        notes = await getNotesByEmail(user.email)
        res.status(200).json({ notes , message : "notes retrieved"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "cannot retrieve notes" });
    }

})

app.delete('/api/deleteNote/:noteId' , authenticationToken , async (req , res) =>{
    const noteId = req.params.noteId
    const user = req.user

    try {
        await deleteNoteById(noteId)
        res.status(200).json({ message: "note deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "cannot delete note" });
    }
});

const multer = require('multer');
const upload = multer(); // Initialize multer

app.post('/api/uploadFileToS3', authenticationToken, upload.single('file'), async (req, res) => {
    try {
        // Accessing file key and body from the request
        const fileKey = req.body.fileKey;
        const fileBody = req.file.buffer; // Access file buffer directly
        console.log(fileKey, fileBody);

        // Check if both file key and body are present
        if (!fileKey || !fileBody) {
            return res.status(400).json({ error: "File key or body is missing" });
        }

        // Upload file to S3
        const fileUrl = await uploadFileToS3(fileKey, fileBody);
        res.status(200).json({ message: "File uploaded successfully", fileUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cannot upload file" });
    }
});

app.get('/api/downloadFileFromS3/:fileKey', authenticationToken, async (req, res) => {
    const { fileKey } = req.params;

    try {
        if (!fileKey) {
            return res.status(400).json({ error: 'File key is missing' });
        }

        // Construct the CloudFront link based on your configuration
        const cloudFrontLink = `http://d10vtxeo7xa4r3.cloudfront.net/${fileKey}`;
        
        // Return the CloudFront link
        res.status(200).json({ link: cloudFrontLink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// DELETE route for deleting a file from S3
app.delete('/api/deleteFileFromS3/:fileKey', authenticationToken, async (req, res) => {
    try {
        const fileKey = req.params.fileKey;

        // Check if the file key is present
        if (!fileKey) {
            return res.status(400).json({ error: "File key is missing" });
        }

        // Delete file from S3
        await deleteFileFromS3(fileKey);

        // Send success response
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cannot delete file" });
    }
});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
