import express from 'express';
import {MongoClient} from 'mongodb';

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req,res) =>{
    const {name} =req.params;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');


    const article = await db.collection('articles').findOne({name});

    if (article) {
        res.json(article);
    } else {
        res.sendStatus(404).send();
    }

    res.json(article);
                
});

app.put('/api/articles/:name/upvote',async (req,res)=>{
    const {name } =req.params;
    
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');
    await db.collection('articles').updateOne({name},{
        $inc:{ upvotes: 1},
    });
    const article = await db.collection('articles').findOne({name});

    if (article) {
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.post('/api/articles/:name/comments',async (req,res)=>{
    const {name} = req.params;
    const {postedBy, text } = req.body;
    // connects to Mongo driver
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    // connects to Mongo database
    const db = client.db('react-blog-db');
    await db.collection('articles').updateOne({name}, { 
        $push: {comments:{postedBy,text}},

    });
    const article = await db.collection('articles').findOne({name});    

    if (article) {
        res.send(article.comments);
    } else {
        res.send("Articles collection does not contain that req name");
    }

})

app.listen(8888,()=>{
    console.log("SERVER IS LISTENING ON PORT 8888");
})
















