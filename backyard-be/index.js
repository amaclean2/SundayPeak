const express = require('express');
const userRouter = require('./routes/user');
const lineRouter = require('./routes/line');
const tickRouter = require('./routes/tick');
const activityRouter = require('./routes/activity');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`);
    next();
});

app.use('/api/user', userRouter);
app.use('/api/line', lineRouter);
app.use('/api/tick', tickRouter);
app.use('/api/activity', activityRouter);

app.listen(PORT, () => {
    console.log(`Backyard running on http://localhost:${PORT}`);
});