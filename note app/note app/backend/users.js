const AWS = require("aws-sdk");
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();


const TABLE_NAME = "users";

const createUser = async (name, email, password) => {
    // Check if the email already exists in the database
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // If email does not exist, create the new user
    const user = {
        name: name,
        email: email,
        password: password
    };

    const params = {
        TableName: TABLE_NAME,
        Item: user
    };

    try {
        await dynamoClient.put(params).promise();
        return user;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email": email
        }
    };

    try {
        const data = await dynamoClient.scan(params).promise();
        if (data.Items.length === 0) {
            throw new Error("User not found");
        }

        const user = data.Items[0];
        if (user.password !== password) {
            throw new Error("Invalid password");
        }

        return user;
    } catch (error) {
        throw error;
    }
};

const getUserByEmail = async (email) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    };

    try {
        const data = await dynamoClient.scan(params).promise();
        if (data.Items.length === 0) {
            return null;
        }
        return data.Items[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    loginUser,
    getUserByEmail
   
};
