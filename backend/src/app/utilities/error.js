function _error(err, options={}) {
    console.log(err);           
    return err; 
}

module.exports = {
    _error: _error
}