
let resCodes = {
    badRequest: { code: 400, message: "There are some un-acceptable params in your request" },
    unauthorized: { code: 401, message: "Unauthorized Access" },
    notFound: { code: 404, message: "Resources not found" },
    error: { code: 500, message: "Internal server error" },
    GET: { code: 200, message: "Success" },
    POST: { code: 201, message: "Successfully submitted" },
    PUT: { code: 204, message: "Successfully updated" },
    PATCH: { code: 204, message: "Successfully updated" },
    DELETE: { code: 202, message: "Successfully deleted" }
}

function errRes(err) {
    return { "message": err };
}

function successRes(res) {
    return {
        "message": (res && res[0] && res[2].rows.length > 0 ? "Success" : "Record not found."),
        "data": (res && res[2].rows ? res[2].rows : []),
        "filteredRecords": (res && res[0].rows && res[0].rows[0] ? res[0].rows[0]['fcnt'] : 0),
        "totalRecords": (res && res[1].rows && res[1].rows[0] ? res[1].rows[0]['cnt'] : 0)
    }
}

function successObjRes(res) {
    console.log("IN res obj structure", res);
    if (res && res.operation && res.operation == 'softDelete') {
        return {
            "message": resCodes['DELETE'].message
        }
    }
    // else if(res.code = 203){
    //     return{
    //         "message": resCodes['PUT'].message
    //     }

    // }
    else {
        return {
            "message": res[0] ? "Success" : (res['message'] ? res['message'] = res['message'] : "Record not found."),
            "data": res[0] ? res[0] : {}
        }
    }

}



module.exports = {
    resCodes: resCodes,
    successObjRes: successObjRes,
    successRes: successRes,
    errRes: errRes
}