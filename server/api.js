var Db = require('./dboperations');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();
var csrf = require('csurf');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);
app.use(csrf({cookie: true}))

router.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' 'http://localhost:3000'; font-src 'self'; img-src *; script-src 'self'; style-src 'self'; frame-src 'self'"
      );
    next();
});

router.route('/tables').get((req, res) => {
    Db.getTables().then((data) => {
         console.log(data,"sdhhjfsd");
         res.json(data)
    })
})

router.route('/tables/:id').get((req, res) => {
    Db.getTable(req.params.id).then((data) => {
        res.json(data);
    })
})

router.route('/register').post((req, res) => {
    console.log(req.body,"sfsddjfj");
    let table ={...req.body};
    Db.addTable(table).then((data) => {
        res.status(201).json(data);
        console.log(res.status(201).json(data),"ABCD")
    })
})

router.route('/login').post((req, res) => {
    let credentials ={...req.body};
    console.log(credentials,"credentials");

    Db.login(res,credentials).then((data) => {
        res.status(201).json(data);
    })
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('Table API is running at ' + port)