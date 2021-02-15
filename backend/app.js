var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger/swagger');
const bodyParser = require('body-parser');
var options = {
    explorer: true
  };

var filmsrouter = require('./src/app/controllers/filmsController');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.sw, options));

app.use(bodyParser.json());
app.use('/films',filmsrouter);

console.log('listening on 3000');
app.listen(10010);