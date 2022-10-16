import express from 'express';

// PUT /articles/learn-react/upvote

let articlesInfo = [{
    name:'learn-react',
    upvotes:0,

}, {
    name:'learn-node',
    upvotes:0,
}, {
    name:'mongodb',
    upvotes:0,
}]


const app = express();
app.use(express.json());

app.put('/api/articles/:name/upvote',(req,res)=>{
    const {name } =req.params;
    const article = articlesInfo.find(a => a.name ===name);

    if (article) {
        article.upvotes += 1;
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.listen(8888,()=>{
    console.log("SERVER IS LISTENING ON PORT 8888");
})
















