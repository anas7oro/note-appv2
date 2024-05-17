const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from the uuid package
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "notes";

const addNote = async (title, content, email) => {
    const id = uuidv4(); 
    const note = {
        id: id,
        title: title,
        email: email,
        content: content
    };
    
    const params = {
        TableName: TABLE_NAME,
        Item: note
    };

    try {
        await dynamoClient.put(params).promise();
        return note;
    } catch (error) {
        throw error;
    }
};


const getNoteById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "id = :id", 
        ExpressionAttributeValues: {
            ":id": id
        }
    };

    try {
        const data = await dynamoClient.query(params).promise();
        if (data.Items.length === 0) {
            return null; 
        }
        return data.Items[0]; 
    } catch (error) {
        throw error;
    }
};

const editNote = async (note) => {
    const NewNote = {
        id: note.id,
        title: note.title,
        content: note.content,
        email: note.email
    };
    
    const params = {
        TableName: TABLE_NAME,
        Item: NewNote
    };

    try {
        await dynamoClient.put(params).promise();
        return note;
    } catch (error) {
        throw error;
    }
};

const getNotesByEmail = async (email) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    };

    try {
        const data = await dynamoClient.scan(params).promise();
        return data.Items; 
    } catch (error) {
        throw error;
    }
};

const deleteNoteById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            "id": id
        }
    };

    try {
        await dynamoClient.delete(params).promise();
        return true; 
    } catch (error) {
        throw error;
    }
};



module.exports = {
    addNote,
    getNoteById,
    editNote,
    getNotesByEmail,
    deleteNoteById
};
