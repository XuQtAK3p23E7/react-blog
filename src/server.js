import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import {db, connectToDb} from './db.js';

const credentials = JSON.parse(
    fs.readFileSync('../credentials.json')
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

app.use(async (req,res,next) =>{
    const {authtoken} = req.headers;
    
    if (authtoken){
        try {
            req.user = await admin.auth().verifyIdToken(auth);
        } catch (e) {
            res.sendStatus(400);
        }
    }
    next();
});

app.get('/api/articles/:name', async (req,res) =>{
    const {name} = req.params;

    const article = await db.collection('articles').findOne({name});

    if (article) {
        res.json(article);
    } else {
        res.sendStatus(404);
    }                
});

app.put('/api/articles/:name/upvote',async (req,res)=>{
    const {name } = req.params;
    
    await db.collection('articles').updateOne({name},{
        $inc:{ upvotes: 1},
    });
    const article = await db.collection('articles').findOne({name});

    if (article) {
        res.json(article);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.post('/api/articles/:name/comments',async (req,res)=>{
    const {name} = req.params;
    const {postedBy, text } = req.body;
    
    await db.collection('articles').updateOne({name}, { 
        $push: {comments:{postedBy,text}},

    });
    const article = await db.collection('articles').findOne({name});    

    if (article) {
        res.json(article);
    } else {
        res.send("Articles collection does not contain that req name");
    }

})

connectToDb(()=>{
    console.log("SUCCESS CONNECT TO DATABASE");
    app.listen(8888,()=>{
        console.log("SERVER IS LISTENING ON PORT 8888");
    })
})






