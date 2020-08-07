'use strict'

function handleNotFound(res, msg) {
    res.status(404).send({
        error_code: "ENTITY_NOT_FOUND",
        message: msg || "Entity with the above matching criterion not exist"
    })
}

function handleUnauthorized(res, msg) {
    res.status(401).send({
        error_code: "UNAUTHORIZED",
        message: msg || "Unauthorized"
    })
}
function handleBadRequest(res, msg) {
    res.status(400).send({
        error_code: "BAD_REQUEST",
        message: msg || "Request is malformed"
    })
}
module.exports = {
    handleNotFound,
    handleBadRequest,
    handleUnauthorized
  }