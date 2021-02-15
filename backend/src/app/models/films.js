const db = require('../utilities/sqlMapper');


////// get api of films
function get(req, callback) {
    try {
        let columns = `t.name as track, t.composer, t.milliseconds, t.bytes, t.unit_price, a.title as album, g.name as genre, m.name as media_type
        `;
        
        let orderBy = {
            by: " id",
            order: "ASC"
        };
        if (req.query.orderBy && req.query.orderBy != "") {
            if (req.query.order && req.query.order != "") {
                orderBy = {
                    by: req.query.orderBy,
                    order: req.query.order
                };
            } else {
                orderBy = {
                    by: 'f.' + req.query.orderBy,
                    order: "DESC"
                };
            }
        }
        req.query.searchOptions = {
            tAlias: 't'
        }
        let joins = [{
            type : 'inner',
            table: 'albums a',
            on: 'a.id = t.album_id'
        },{
            type : 'inner',
            table: 'genres g',
            on: 'g.id = t.genre_id'
        },{
            type : 'inner',
            table: 'media_types m',
            on: 'm.id = t.media_type_id'
        }]
        let options = {
            req:req,
            columns: columns,
            from: 'tracks t',
            // conditions: conditions,
            // orderBy: orderBy,
            joins: joins,
            limit: { start: ((req.query.page - 1) * req.query.limit) || 0, limit: req.query.limit || 10 }
        }
        db.select(options, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                try {
                    console.log(result[2].rows);
                    callback(null, result);
                } catch (error) {
                    return callback(error);
                }
            }
        });
    } catch (error) {
        console.log(error);
        return callback(error);
    }
}


module.exports = {
    get
}