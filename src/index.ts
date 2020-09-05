import express from './express';

const PORT = process.env.PORT || 3000;

express.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));