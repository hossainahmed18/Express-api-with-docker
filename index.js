import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import express, { json } from 'express';
import bodyParser from 'body-parser';

const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});

const readFile = async ({ bucket, folder, client, fileName }) => {
    const key = `${folder}/${fileName}`;
    const params = {
        Bucket: bucket,
        Key: key,
    };
    const command = new GetObjectCommand(params);
    try{
        const response = await client.send(command);
        const { Body } = response;
        const data = streamToString(Body);
        return JSON.parse(data);
    }catch (error){
       return error;
    }
};

const getFile = async (event) => {
    const region = '';
    const bucket = '';
    const folder = '';
    const fileName = '';
    const client = new S3Client({ region });
    return readFile({ bucket, fileName, folder, client });
};

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

app.post('/api', async (req, res) => {
    const data = await getFile();
    const responseData = {
      message: 'Received POST request',
      data: data,
    };
    res.json(responseData);
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});