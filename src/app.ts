import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import {getCityCoordinates} from "./wheatherApi/geocodingApi";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => res.json('working'));

getCityCoordinates('Izhevsk').then(coordinates => {
    console.log(coordinates);
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
