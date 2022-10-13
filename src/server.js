import express from 'express';

const app = express();

app.get('/hello', (req,res)=>{
    res.send("PICKCHU");
});

app.listen(8888,()=>{
    console.log("SERVER IS LISTENING ON PORT 8888");
})
















