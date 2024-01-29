const mongoose = require('mongoose');
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

// import json into mongodb
// mongoimport "C:\Users\ankit\OneDrive\Documents\Ankit\Projects\Data\characters.json" -d Narutodb -c characters --jsonArray --drop

// Schema is declared here
const narutodbSchema = new mongoose.Schema({
    id: Number,
    name: String,
    images: [String],
    debut: {
      manga: String,
      anime: String,
      novel: String,
      movie: String,
      game: String,
      ova: String,
      appearsIn: String
    },
    family: {
      father: String,
      'adoptive brother': String,
      cousin: String
    },
    jutsu: [String],
    natureType: [String],
    personal: {
      birthdate: String,
      sex: String,
      age: {
        'Part II': String
      },
      height: {
        'Part II': String
      },
      weight: {
        'Part II': String
      },
      bloodType: String,
      occupation: [String],
      affiliation: [String],
      team: [String],
      partner: String
    },
    rank: {
      ninjaRank: {
        'Part II': String
      },
      ninjaRegistration: String
    },
    tools: [String],
    voiceActors: {
      japanese: String,
      english: String
    }
  })
  
// Model is declared here
const Characters = mongoose.model('characters', narutodbSchema);
// const Akatsukis = mongoose.model('akatsukis', narutodbSchema);


const app = express();
app.use(cors())
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//Search Logic
app.get('/getAll/:key', function(req, res) {
const promises = [Characters].map(model => {
    return model.find({"$or" :[{'name':{$regex: req.params.key, $options: 'i'}}]}).limit(5).exec();
  });
Promise.all(promises)
    .then(results => {
     
      const docs = results.flat();
      res.send(docs);
    })
    .catch(err => {
      console.log(err);
    });
});
 
//Update Logic
app.patch("/update/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  Characters.findOneAndUpdate({id: id }, updatedData, { new: true ,multi: true})
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        console.log(`No document found with id: ${id}`);
        res.status(404).send(`No document found with id: ${id}`);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('An error occurred while updating the data.');
    });
});

app.patch("/updatechardetails/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = { $set: req.body };

  Characters.findOneAndUpdate({id: id }, updatedData, { new: true })
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        console.log(`No document found with id: ${id}`);
        res.status(404).send(`No document found with id: ${id}`);
      }
    })
    .catch((error) => {
      console.error(`An error occurred: ${error}`);
      res.status(500).send('An error occurred while updating the data.');
    });
});





//App started
app.listen(8000, function() {
  console.log('Server is running at port 8000...');
  mongoose.connect(process.env.DB);
});

