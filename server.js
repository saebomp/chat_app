const path = require('path')
const express = require('express');
const app = express();

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//npm run dev
// https://www.youtube.com/watch?v=jD7FnbI76Hg   8:47