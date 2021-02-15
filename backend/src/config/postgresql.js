
const escape= require('pg-escape')
const { Pool, Client } = require('pg')
// if(global.user.customer == "lumax")



function helper(sql, callback) {
  try {
    // console.log("--------------------------in execute query")

    let varObject = {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'root',
      database: 'vue',
      port: 5432,
    }
    var cn = varObject;
    console.log('3',cn,sql);
    var connectionPool = new Pool(cn)

    connectionPool.query(sql, function (error, results) {
      if (error) {
        return callback(error);
      } else {
        // console.log('RESULT in postgres',results);
        connectionPool.end();
        return callback(null, results);
      }
    });
  } catch (error) {
    return callback(error);
  }

}




// connectionPool.connect().then(
    module.exports = {
            // connectionPool: connectionPool,
            escape: escape,
            helper:helper
        }
    // ).catch((err) => {throw new Error(err)});
