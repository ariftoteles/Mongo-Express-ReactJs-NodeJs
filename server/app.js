const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();

app.use(cors())
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/kampus', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const mySchema = new mongoose.Schema({
  nama: String,
  ipk: Number
}, {
  collection: 'mahasiswa'
});
const Mahasiswa = mongoose.model('Mahasiswa', mySchema);

app.get("/data", function (req, res) {
  Mahasiswa.find({}, function (err, data) {
    res.send(data);
  });
});

app.get("/update/:id", function (req, res) {
  Mahasiswa.findOne({
    _id: req.params.id
  }, function (err, foundContent) {
    if (!err) {
      res.send(foundContent);
    } else {
      res.send(err);
    }
  })
});

app.post("/data", function (req, res) {
  const newData = new Mahasiswa({
    nama: req.body.nama,
    ipk: req.body.ipk
  });
  if (newData.nama === "" | newData.ipk === ""){
    res.send("Data undefined")
  } else {
    newData.save(function (err) {
      if (err) return handleError(err);
    });
    res.send();
  }
})

app.delete("/delete/:id", function (req, res) {
  console.log(req.params.id);
  Mahasiswa.deleteOne({
      _id: req.params.id
    },
    function (err) {
      if (!err) {
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    }
  )
})

app.patch("/update/:id",function(req, res) { 
  Mahasiswa.updateOne( 
      {_id: req.params.id},
      {$set : req.body},
      function(err){
          if(!err) {
              res.send("Successfully update");
          } else{
              res.send(err);
          }
      }
  )
});


app.listen(5000, function () {
  console.log("Server started on port 5000");
});