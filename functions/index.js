const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
admin.initializeApp();

const app = express();
app.use(cors());

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Origin', 'https://kos-wound-scanning.web.app/users');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});



app.get("/", async(req, res) => {
    const snapshot = await admin.firestore().collection('NewPatients').get();
  let users = [];
  snapshot.forEach(doc => {
    let id = doc.id;
    let data = doc.data();
    users.push({id, ...data});
  });
  res.status(200).send(users);
});

app.post('/create', async (req, res) => {
  const user = req.body;
  await admin.firestore().collection('NewPatients').add(user);
  res.status(201).send({ msg: "Patient Added" });
});

app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  delete req.params.id;
  const body = req.body;
  console.log(body);
  await 
  admin.firestore().collection('NewPatients').doc(id).update(body);
  res.status(200).send({ msg: "Updated" })
});


app.delete("/:id", async (req, res) => {
  await admin.firestore().collection("NewPatients").doc(req.params.id).delete();
  
  res.status(200).send({ msg: "Deleted" });
})

// app.post("/create", async(req, res) => {
//     const patient = req.body;
//     await admin.firestore().collection('NewPatients').add(patient);
//     res.status(201).send({ msg: "Patient Added" });
// });


exports.user = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
