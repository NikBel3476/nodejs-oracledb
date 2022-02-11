import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => res.json('it finally working'));

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
