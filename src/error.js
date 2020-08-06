'use strict'

function handleServerError(res) {
    res.status(500).send({
        error_code: "SERVER_ERROR",
        message: "Internal Server Error"
    })
}

function handleNotFound(res, msg) {
    res.status(404).send({
        error_code: "ENTITY_NOT_FOUND",
        message: msg || "Entity with the above matching criterion not exist"
    })
}

function handleBadRequest(res, msg) {
    res.status(400).send({
        error_code: "BAD_REQUEST",
        message: msg || "Request is malformed"
    })
}
module.exports = {
    handleServerError,
    handleNotFound,
    handleBadRequest
  }