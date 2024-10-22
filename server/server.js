import express from 'express'
import cors from 'cors'
import { promisify } from 'util';
import child_process from 'child_process';
import multer from 'multer';
import fs from 'fs';

const exec = promisify(child_process.exec);

const storage = multer.diskStorage({
    destination: './dynamic/',
    filename: (req, file, cb) => {
        cb(null, 'prompt.jpg');
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
});

const app = express();

app.use(cors({origin: true, credentials: true}));

app.post('/api/upload', upload.single('image'), async (req, res) => {
    console.log('got upload');
    try {
        if (!req.file) {
            return res.status(500).send("Couldn't Save your Image");
        }
        const {stdout, stderr} = await exec('python3 ./main.py');
        // console.log(stdout, stderr);
        const data = fs.readFileSync('./dynamic/detected.json', 'utf8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData);
        res.json(jsonData);
    } catch (error) {
        console.log('error in POST /api/upload: ', error);
        return res.status(500).send("Internal Server Error");
    }

});

app.get('/api/test', (req, res) => {
    res.send('Online');
})

app.post('/api/uploadDemo', (req, res) => {
    return res.json({
        "aadhar_number": [
            "2943 6593 3461",
            "2943 6593 3461"
        ],
        "dob": [
            "12/12/1988"
        ],
        "name": "MERAJ KHAN \n"
    })
})

app.listen(3000, () => console.log('Server is online on port 3000'));