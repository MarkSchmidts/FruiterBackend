const express = require('express');
const app = express();

const {MongoClient} = require('mongodb');


function afterRequestDo(request){
    let currentTime = new Date().toISOString();
    console.log('got request on', request.url, 'time', currentTime);
}


function getMongoCollection(client, database, collectionName) {
    let arrayPromise = client.db(database).collection(collectionName).find({}).toArray();
    return arrayPromise;
}
function getAllMongoCollections(client, database){
    let arrayPromise = client.db(database).listCollections().toArray();
    return arrayPromise;
}



async function main() {
    const uri = "mongodb://127.0.0.1:27020";
    const client = new MongoClient(uri);
    
 
    await client.connect();

    app.get('/', (request, response) => {
        response.send('Our first Node.js webserver');
        afterRequestDo(request);
    });
    
    app.get('/:yourName', (req, res) => {
        res.send('Hi $1 ' + req.params.yourName);
        afterRequestDo(req);
    });
    

    app.get('/mongo/collection/', async(request, response) => {
        getAllMongoCollections(client, 'food').then((collections) => {
            response.send(collections);
            afterRequestDo(request);
        })
    });
    app.get('/mongo/collection/:name', (request, response) => {
        let collectionName = request.params.name;
        getMongoCollection(client, 'food', collectionName).then((data) => {
            response.send(data);
            afterRequestDo(request);
        })
    });
    
    app.listen(3000, () => console.log('Server running on port 3000'));
}

main().catch(console.error);
