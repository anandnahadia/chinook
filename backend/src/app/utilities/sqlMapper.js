var db = require('../../config/postgresql');
var {
    rTrim
} = require('../helper');
const {
    _error
} = require('../utilities/error');

// Open the DB connection, execute the sql query and close the db connection
function executeQuery(req, callback) {
    try {
        
        db.helper(req, function (error, results) {
            if (error) {
                console.log(error);
                return callback(_error(error));
            } else {
                callback(null, results);
            }
        });


    } catch (error) {
        return callback(_error(error));
    }
}

// Select query builder function
function select(options = {}, callback) {
    try {
        let sql = "";
        let columns = "";
        let from = "";
        let joins = "";
        let conditions = "";
        let groupBy = "";
        let orderBy = "";
        let limit = "";

        let select = "SELECT ";
        // console.log('INSIDE MAPPER',options.joins);


        if (options.columns) {
            columns = " " + options.columns;
        } else {
            columns = " *";
        }
        if (options.from) {
            from = " FROM " + options.from;
        }
        if (options.joins) {
            options.joins.forEach(join => {
                joins += " " + join.type + " JOIN " + join.table + " ON " + join.on;
            });
        }
        if (options.conditions) {
            conditions = " WHERE " + options.conditions;
        } else {
            conditions = " WHERE 1 = 1 ";
        }
        console.log('step-1');
        if (options.IN) {
            let arr = options.IN.list
            conditions += " AND " + options.IN.attribute + " IN ("
            for (i = 0; i < arr.length - 1; i++) {
                conditions += arr[i] + ","
            }
            conditions += arr[i] + ") "
        }
        if (options.req) {
            // console.log('step-2');
            let req = options.req;
            // console.log("Req.query.filter------", req.query.filter);

            if (req.query.search) {
                // console.log('step-3');
                // req.query.search = (req.query.search).toLowerCase();
                console.log("search options---> ", req.query.searchOptions);
                const tAlias = req.query.searchOptions.tAlias ? req.query.searchOptions.tAlias : "";
                const exactMatch = req.query.searchOptions.exactMatch ? req.query.searchOptions.exactMatch : false;

                if (req.query.filter) {
                    let arr = req.query.filter.split(',');
                    conditions += ` AND  (`;
                    let delim = "";
                    arr.forEach(ar => {
                        console.log("exactMatch ===> ", exactMatch);
                        if (exactMatch || exactMatch == 'true') {
                            conditions += delim + (tAlias ? tAlias + '.' : tAlias) + `${ar} = '${req.query.search}'`;
                        } else {
                            conditions += delim + (tAlias ? tAlias + '.' : tAlias) + `${ar} ILIKE '%${req.query.search}%'`;
                        }
                        delim = " OR ";
                    });
                    conditions += `)`;
                }
                // else{
                //     conditions += ` AND  (ev.title LIKE '%` + req.query.search + `%')`;
                // }
            }

            console.log("Body -----------> ", req.body);
            if (req.body && req.body.advanceSearch) {
                if ((req.body.advanceSearch && typeof (req.body.advanceSearch) == 'string')) {
                    rTrim(req.body.advanceSearch, "'");
                    rTrim(req.body.advanceSearch, '"');
                    console.log("advancesearch after trim----", req.body.advanceSearch[0]);
                }
                // advanceSearch format := [{key:"subscription_type",value:["paid","free"]},{key:"level",value:["easy","moderate","difficult"]}];
                if (req.body.advanceSearch[0]) {
                    req.body.advanceSearch.forEach(as => {
                        if (as.value && as.value.length > 0) {
                            if (as.operator == "bool") {
                                if (as.value == "s") {
                                    as.value = 1;
                                } else {
                                    as.value = 0;
                                }
                                conditions += " AND (" + as.key + " = " + as.value + ")";
                            } else if (as.operator == "range") {
                                if (as.value[0 > as.value[1]]) {
                                    console.log("Wrong Range in Advance Search");
                                } else {
                                    conditions += " AND (" + as.key + ">=" + as.value[0] + " AND " + as.key + "<=" + as.value[1] + ")";
                                }
                            } else {
                                conditions += " AND (" + as.key + " LIKE '%" + as.value.toString().replace(',', "%' || " + as.key + " LIKE '%") + "%')";
                            }
                        }
                    })
                }
            }
        }

        if (options.groupBy) {
            groupBy += " GROUP BY (" + options.groupBy.by + ") ";
        }
        if (options.orderBy) {
            orderBy += " ORDER BY";
            if (options.orderBy[0]) {
                let delim = " ";
                options.orderBy.forEach(o => {
                    orderBy += delim + o.by + " " + o.order;
                    delim = ", ";
                })
            } else {
                let o = options.orderBy;
                orderBy += " " + o.by + " " + o.order;
            }
        }
        if (options.limit) {
            if (options.limit.limit && options.limit.limit > 0) {
                // let start = 0;
                if (options.limit.start) {
                    start = options.limit.start;
                }

                limit = " LIMIT " + options.limit.limit + " " + "OFFSET" + " " + options.limit.start;
            }
        }
        console.log("above fcnt and cnt");
        if (!options.id && options.groupBy) {
            console.log("IN CNT FCNT CONITION");
            sql += select + " COUNT(*) as fcnt " + "from (" + select + rTrim(columns) + from + joins + conditions + groupBy + ") as sq ; ";
            sql += select + " COUNT(*) as cnt " + "from (" + select + rTrim(columns) + from + joins + groupBy + ") as sq ; ";
        } else if (!options.id) {
            console.log("IN CNT FCNT CONITION");
            sql += select + " COUNT(*) as fcnt " + from + joins + conditions + "; ";
            sql += select + " COUNT(*) as cnt " + from + joins + "; ";
        }
        sql += select + rTrim(columns) + from + joins + conditions + groupBy + orderBy + limit;

        console.log('-------------------------QUERY -------------------------------------------------------', sql);

        executeQuery(sql, function (err, data) {
            // console.log("in select of sql mapper", data);
            if (err) {
                return callback(_error(err));
            } else {
                // console.log("IN SELECT QUERY",data);
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}





// Insert query builder function
function insert(options = {}, callback) {
    try {
        let returning = ``
        if (!options.multipleValues) {
            options.values = "(" + options.values + ")"
        } else {
            options.values = options.multipleValues
        }
        if(options.returning) {
            returning += ` RETURNING `+ options.returning
        }
        let sql = "INSERT INTO " + options.table + " (" + options.columns + ") VALUES " + options.values + returning;
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback(_error(err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}



// Upsert query builder function
//Ex:-  INSERT INTO customers (name, email)
// VALUES('Microsoft','hotline@microsoft.com') 
// ON CONFLICT (name) 
// DO 
//    UPDATE SET email = EXCLUDED.email || ';' || customers.email;
function upsert(options = {}, callback) {
    try {
        let conflict = ``
        let delim =``
        if (!options.multipleValues) {
            options.values = "(" + options.values + ")"
        } else {
            options.values = options.multipleValues
        }
        let arr = options.columns.split(',')
        if(options.conflict){
            conflict = ` ON CONFLICT (`+ options.conflict + `) DO UPDATE SET `
        }
        else if(options.constraint){
            conflict = ` ON CONFLICT ON CONSTRAINT `+ options.constraint + ` DO UPDATE SET `
        }
        arr.forEach(column => {
            conflict += delim + column + `= EXCLUDED.` + column
            delim = ','
        })
        conflict += delim + `updated_at=current_timestamp`
        let sql = "INSERT INTO " + options.table + " (" + options.columns + ") VALUES " + options.values + conflict;
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback(_error(err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}

// Update query builder function
function update(options = {}, callback) {
    try {
        let conditions = ""
        let sql = "";
        if (options.conditions) {
            conditions = " WHERE " + options.conditions;
        } else {
            conditions = " WHERE 1 = 1 ";
        }
        if (options.IN) {
            let arr = options.IN.list
            conditions += "AND " + options.IN.attribute + " IN ("
            for (i = 0; i < arr.length - 1; i++) {
                conditions += arr[i] + ","
            }
            conditions += arr[i] + ") "
        }
        if (options.multipleValues) {
            sql = "UPDATE " + options.table + " SET " + options.setValues + ",updated_at=current_timestamp" + " from (values" + options.multipleValues + ") as " + options.values + conditions;
        } else {
            sql = "UPDATE " + options.table + " SET " + options.setValues + ",updated_at=current_timestamp" + conditions;
        }

        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback(_error(err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}


// UPDATE machine x
// SET    gateway_id = '78'
// FROM   machine y                -- using the FROM clause
// WHERE  x.machine_id = y.machine_id  -- must be UNIQUE NOT NULL
// AND    x.machine_id in (1,3,4,5)
// RETURNING y.machine_id AS machine_id, y.gateway_id AS old_gateway
//         , x.gateway_id as new_gateway 
// Update query builder function
function returnUpdate(options = {}, callback) {
    try {
        let conditions = ""
        let from = "";
        let sql = "";
        let returning = "";
        if (options.conditions) {
            conditions = " WHERE " + options.conditions;
        } else {
            conditions = " WHERE 1 = 1 ";
        }
        if (options.from) {
            from= " FROM " + options.from;
        }
        if (options.IN) {
            let arr = options.IN.list
            conditions += " AND " + options.IN.attribute + " IN ("
            for (i = 0; i < arr.length - 1; i++) {
                conditions += arr[i] + ","
            }
            conditions += arr[i] + ") "
        }
        if(options.returning){
            returning += " RETURNING " + options.returning
        }
        sql = "UPDATE " + options.table + " SET " + options.setValues  + ",updated_at=current_timestamp" + from + conditions + returning;
        
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback(_error(err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}


// Remove query builder function (here we are updating is_removed field with 1)
function remove(options = {}, callback) {
    try {
        let sql = "";
        if (options.conditions && options.conditions != "") {
            sql = "UPDATE " + options.table + " SET is_removed = true ,updated_at=current_timestamp WHERE " + options.conditions;
        }
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback(_error(err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}


// DELETE query builder function (here we are deleting the row)
function permanentremove(options = {}, callback) {

    try {
        let sql = "";
        if ((options.conditions && options.conditions != "" && !options.conditions.includes(null)) && (options.table && options.table != "")) {
            sql = "DELETE FROM " + options.table + " WHERE " + options.conditions;
            console.log("SQL-------" + sql);

            executeQuery(sql, function (err, data) {
                try {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, data);
                    }
                } catch (error) {
                    return callback(error);
                }
            });
        }
    } catch (error) {
        return callback(error);
    }
}

// With this function we can directly execute the whole sql query in model, controller or services
function query(sql, callback) {
    try {
        console.log('IN mapper query ', sql);

        executeQuery(sql,  function (err, result) {
            if (err) {
                return callback(_error(err));
            } else {

                return callback(null, result);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}




function createTable(options = {}, callback) {
    try {
        let pkey = ""
        let checks = ""
        let fkey = ""
        if (options.pkey) {
            pkey = ", PRIMARY KEY (" + options.pkey + ")"
        }
        if (options.checks) {
            let arr = options.checks
            for (i = 0; i < arr.length; i++) {
                checks += ", CHECK (" + arr[i].column + " IN (" + arr[i].IN + "))"
            }
        }
        if (options.fkey) {
            let arr = options.fkey
            for (i = 0; i < arr.length; i++) {
                fkey += ", FOREIGN KEY (" + arr[i].local_column + ") REFERENCES" + arr[i].references + "(" + arr[i].referencing + ")"
            }
        }

        let sql = "CREATE TABLE public." + options.table + " (" + options.columns + pkey + fkey + checks + ")";
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback(_error(err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback(_error(error));
    }
}

// Here we are exporting all the above function to use in another files like model, controller and services
module.exports = {
    query: query,
    select,
    insert,
    upsert,
    update,
    remove,
    permanentremove: permanentremove,
    escape: escape,
    createTable,
    returnUpdate
}