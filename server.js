var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var filename = '';

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/** Serving from the same express Server
 No cors required */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//storage for images
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, filename);
    }
});

var storage1 = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        filename = 'images.json';
        cb(null, filename);
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single('file');
var upload1 = multer({ //multer settings
    storage: storage1
}).single('images');


/** API path that will upload the files */
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null, name: filename});
    });
});
app.post('/savejson', function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null, name: filename});
    });
});

app.set('port', 3031);


app.listen(app.get('port'), () => {
    console.log(`Server started at: http://localhost:${app.get('port')}/`);
})
