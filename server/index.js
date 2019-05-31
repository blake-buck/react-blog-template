
require('dotenv').config();
const express = require('express');
const {json} = require('body-parser');

const app = express();
app.use(json());


const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_CONNECTION;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url, {useNewUrlParser:true});



app.post('/api/publish', (req, res) => { 
    client.connect((err)=>{
        if(err) console.log(err)
        else{
            const db = client.db(dbName);
            let placeholder = req.body;
            
            db.collection('articles').countDocuments().then(results => {
                placeholder['id'] = results + 1;
                db.collection('articles').insertOne(placeholder, (err,r) => {
                    if(err) {
                        res.status(500).json({message:'An error occured'});
                    }
                    else{
                        res.status(200).json({message:'Article published!'});
                    }
                    client.close();
                })
            })
            
        }
    })

})

app.post('/api/savedraft', (req, res) => {
    client.connect((err)=>{
        if(err)console.log(err);
        else{
            const db = client.db(dbName);
            let placeholder = req.body;
            const {title, description, post} = placeholder;

            if(placeholder.id){
                console.log("PLACEHOLDER ID: " + placeholder.id)
                db.collection('drafts').updateOne({id:placeholder.id},{$set: {title:title}}).then(() => {
                   res.status(200).json({message:'Draft saved!'})
                }).catch((err)=>console.log("ERROR OCCURED " + err))
            }
            else{
                db.collection('drafts').countDocuments().then(results => {
                    placeholder['id'] = results + 1;
                    db.collection('drafts').insertOne(req.body, (err) => {
                        if(err){
                            res.status(500).json({message:'An error occured'});
                        }
                        else{
                            res.status(200).json({message:'Draft saved!', id:placeholder.id})
                        }
                        
                    })
                })
            }
            
            
        }
    })
})


app.listen(5050, ()=>console.log('listening on 5050'));