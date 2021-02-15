var crypto = require('crypto');

function rTrim(x, str = ',') {
  x = x.replace(/^\s+|\s+$/gm, '');
  x = x.replace(/^\s+|\s+$/gm, str);
  return x.replace(/^\s+|\s+$/gm, '');
}

function getBoolean(str) {
  if (str == 'true') {
    return true;
  } else {
    return false;
  }
}


function stringifyRes(arr = [], result) {
  let uArr = Object.keys(result);
  uArr.forEach(u => {
    if (arr.includes(u)) {
      if (typeof result[u] != 'string') {
        result[u] = JSON.stringify(result[u]);
      }
    }
  });
  return result;
}

function jsonParseRes(arr = [], result) {
  // console.log('step6----',result); 
  let uArr = Object.keys(result);
  // console.log('step7----',uArr); 
  uArr.forEach(u => {

    if (arr.includes(u)) {
      // console.log('step8----',result[0][u]); 
      if (typeof result[u] != 'object') {
        // console.log('step9----'); 
        result[u] = JSON.parse(result[u]);
        // console.log('step10----',result[0][u]);
      }
    }
  });
  // console.log('step11----',result);
  return result;
}



function passwordGenerator() {
  return randomStr();
}

function randomStr(chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", howMany = 8) {
  var rnd = crypto.randomBytes(howMany)
    , value = new Array(howMany)
    , len = len = Math.min(256, chars.length)
    , d = 256 / len

  for (var i = 0; i < howMany; i++) {
    value[i] = chars[Math.floor(rnd[i] / d)]
  };
  console.log(value.join(''));
  return value.join('');
  // var str = Array(strLen).fill(strChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
  // return str;
}

function deepCopy(str) {
  return JSON.parse(JSON.stringify(str));
}

function escapeObjects(req) {
  for (keys in req.query) {
    console.log("Keys----------" + escape(req.query[keys]));
  }
}

function precise(x) {
  return x.toFixed(1)
}

function convertDatePickerTimeToMySQLTime(str) {
  var month, day, year, hours, minutes, seconds;
  var date = new Date(str),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  hours = ("0" + date.getHours()).slice(-2);
  minutes = ("0" + date.getMinutes()).slice(-2);
  seconds = ("0" + date.getSeconds()).slice(-2);

  var mySQLDate = [date.getFullYear(), month, day].join("-");
  var mySQLTime = [hours, minutes, seconds].join(":");
  return [mySQLDate, mySQLTime].join(" ");
}

module.exports = {
  rTrim: rTrim,
  getBoolean: getBoolean,
  stringifyRes: stringifyRes,
  passwordGenerator: passwordGenerator,
  jsonParseRes: jsonParseRes,
  deepCopy: deepCopy,
  randomStr: randomStr,
  escapeObjects: escapeObjects,
  precise,
  convertDatePickerTimeToMySQLTime
}