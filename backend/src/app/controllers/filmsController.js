const express = require('express');
const films = require('../models/films');
var rs = require('../utilities/responseStructure');
var sw = require('../../swagger/swagger');
const router = express.Router();
const { check, validationResult } = require('express-validator');


//get api of alert



let getparams = { api: "/films", method: "get", summary: "Fetch all alert", tags: "films" };
getparams.parameters = [
    { name: "filter", required: false, in: "query", type: "string" },
    { name: "search", required: false, in: "query", type: "string" },
    { name: "page", required: true, in: "query", type: "integer" },
    { name: "limit", required: true, in: "query", type: "integer" },
];
sw.swaggerPaths(getparams);

router.get('/', [
    check('page', 'page should be an integer').optional().isInt(),
    check('limit', 'limit should be an integer').optional().isInt(),
    check('order', 'Wrong order Type').optional().isIn(['ASC', 'DESC']),

    check('orderBy', 'Invalid orderby').optional().custom(value => {
        if (!value.match(/^\s*[a-zA-Z]([a-z_A-Z]*[a-zA-Z]\s*)?$/)) return false;

        return true;
    }),
    check('filter', 'Invalid search').optional().custom(value => {
        if (!value.match(/^\s*[a-z]([a-z_]*[a-z]\s*)?([,]\s*[a-z]([a-z_]*[a-z]\s*)?)*$/)) return false;

        return true;
    }),
    check('search', 'Invalid search').optional().custom(value => {
        if (!value.match(/^[^;,+=':<>]+$/)) return false;

        return true;
    })
], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    films.get(req, function (err, result) {
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*")
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
            
            res.status(rs.resCodes[req.method].code).json(rs.successRes(result));
        }
    });
});




module.exports = router;
