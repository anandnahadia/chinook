// const fs=require('fs');

var sw = {
    "swagger": "2.0",
    "info": {
        "description": "This is a Simple web Project",
        "version": "1.0.0",
        "title": "Backend"
    },
    "host": "localhost:10010",
    "basePath": "/",
    "securityDefinitions": {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    },
    "schemes": [
        "http",
        "https"
    ],
    "paths": {}
}

function swaggerPaths(p) {
    let res = sw.paths[p.api];
    if (!res) { res = {}; }
    res[p.method] = { summary: p.summary, tags: [p.tags], produces: ["application/json"], responses: {} };
    if (p.parameters) { res[p.method].parameters = p.parameters; }
    if (p.items) { res[p.method].items = p.items; }
    sw.paths[p.api] = res;

    // console.log(JSON.stringify(sw));
    // fs.writeFile("output.json", JSON.stringify(sw), 'utf8', function (err) {
    //     if (err) {
    //         console.log("An error occured while writing JSON Object to File.");
    //         return console.log(err);
    //     }     
    //     console.log("JSON file has been saved.");
    // });   
}

module.exports = {
    sw: sw,
    swaggerPaths: swaggerPaths
}
