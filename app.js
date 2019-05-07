'use strict';
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const request = require('request');

// Template String
// ES6 / ES2015 : ECMAScript 6


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    var file_cred = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, file_cred);
    console.log(file_cred);
    var file_format = path.extname(file.originalname);
    console.log(file_format);
    var file_name = path.basename(file_cred, path.extname(file.originalname));
    console.log(file_name);
    setTimeout(function () {
      console.log('timeout completed'); 
  }, 1000); 

    const subscriptionKey = 'e8d3eacc06db4a8aab2a693778095bb0';
    const uriBase ='https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';
    // const vin_url ='https://nodejsappimage.azurewebsites.net/'
    // var file_format = path.extname(file.originalname);
    // var file_name = path.basename(file_cred, path.extname(file.originalname));
    // const imageUrl = vin_url + file_format + file_name;
    const imageUrl = 'https://raw.githubusercontent.com/Ram-Dixital/Vin_scanner_Images_public/master/vin3.jpg';
    // Request parameters.
    const params = {
      'language': 'unk',
      'detectOrientation': 'true',
    };

    const options = {
         uri: uriBase,
         qs: params,
         body: '{"url": ' + '"' + imageUrl + '"}',
         headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
          }
    };

   request.post(options, (error, response, body) => {
       if (error) {
       console.log('Error: ', error);
       return;
      }
   let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
   console.log('JSON Response\n');
   console.log(jsonResponse);
   });
  }
});
// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});
const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));