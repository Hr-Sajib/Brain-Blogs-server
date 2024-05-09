const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5500;


// middlewires
app.use(cors());


app.get('/', (req,res)=>{
    res.send('Server running ...');
})

app.listen(port, ()=>{
    console.log(`Server running in port ${port}`);
})