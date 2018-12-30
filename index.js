require('dotenv').config()
const app = require('express')()
const path = require('path')
const server = require('http').Server(app)
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const PORT = Number(process.env.PORT || 9999)
const io = require('socket.io')(server)
server.listen(PORT)
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {
  escape
} = require('mongo-escape');

const url = process.env.DB_HOST;
const dbName = 'twilio_db';
let db;
let ioClient;
const moment = require('moment');

MongoClient.connect(url, {
  useNewUrlParser: true
}, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = client.db(dbName);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

io.on('connection', (client) => {
  console.log('connection')
  ioClient = client;
});

if (process.env.NODE_ENV === 'development') {
  app.use(basicAuth({
    users: {
      [process.env.USER_ID]: [process.env.USER_PASS]
    },
    challenge: true
  }))
}


app.post('/api/send', async (req, res) => {
  console.log('POST route hit');
  const accountSid = process.env.Twilio_accountSid
  const authToken = process.env.Twilio_authToken
  const client = require('twilio')(accountSid, authToken)


  try {
    const messageSent = escape({
      incoming: false,
      body: req.body.message,
      contactPhone: req.body.recipient,
      timestamp: moment().unix()
    });

    const collection = db.collection('messages');
    const message = await client.messages
      .create({
        body: req.body.message,
        from: '+15128042500',
        to: req.body.recipient
      });

    await collection.insertOne(messageSent);

    console.log(message.sid)
    res.status(201)
      .send({
        status: 'success',
        message: 'message sent'
      });
  } catch (error) {
    console.error(err)
    res.status(500)
      .send({
        status: 'success',
        message: 'an error occurred',
        error: err
      });
  }
})

app.use(serveStatic(
  'build', {
    index: 'index.html'
  }
))

app.post('/api/sms-webhook', async (req, res) => {
  console.log('sms post below');
  console.log(req.body);

  const {
    SmsMessageSid,
    Body,
    From,
  } = req.body;

  const messageData = escape({
    incoming: true,
    timestamp: moment().unix(),
    contactPhone: From,
    twilioMessageId: SmsMessageSid,
    body: Body,
  });
/** create a new array within the messageData object and insert the  */
  messageData.media = [];
  for (let i = 0; i < parseInt(req.body.NumMedia); i++) {
    let MediaContentType = req.body['MediaType' + i];
    let MediaContentUrl = req.body['MediaUrl' + i];

    messageData.media.push({
      url: MediaContentUrl,
      isImage: (MediaContentType === 'image/jpeg')
    });
  }
  console.log('hello', req.body);
  console.log(messageData, req.body.NumMedia);


  try {
    console.log(ioClient.emit)
    ioClient.emit('message', req.body);
    // Get the documents collection
    const collection = db.collection('messages');
    await collection.insertOne(messageData);
    console.log(messageData);
    console.log("Inserted message into the collection");
    return res
      .status(201)
      .send('Your message has been sent');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({
        err
      });
  }

});

app.get('/all', async (req, res) => {
  const collection = db.collection('messages');
  try {
    // Get all messages from db collection 
    const allMessages = await collection.find().sort({
      '_id': -1
    }).toArray();
    // console.log(allMessages);
    return res
      .status(200)
      .json(allMessages);

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({
        err
      });
  }

});

app.get('/search/:search', async (req, res) => {
  const collection = db.collection('messages');
  const searched = req.params.search;

  const regex = new RegExp(searched);

  try {
    const allSearched = await collection.find({
      contactPhone: {
        $regex: regex,
        $options: 'i'
      }
    }).sort({
      '_id': -1
    }).toArray();
    console.log(allSearched);
    return res
      .status(200)
      .json(allSearched);

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({
        err
      });
  }



});