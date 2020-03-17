const {compose, bind, tap, map} = require('ramda')

const view = require('../views/upload')
const error = require('../views/error')
const repo = require('../models/repo/labels')

const auth = require('@wdalmut/mini-auth')
const token = require('@wdalmut/token-auth')
const me = require('../microservices/auth')

const {file_parser} = require('../middleware/file-parser')
const {
    upload_file, send_message, get_message_from_queue,
    get_object, get_label_detection, drop_message,
    delete_object
} = require('../services/aws')

const upload_action = (req, res) => {
    upload_file(req.file.buffer, {file_name: req.file.key_s3, acl: "public-read"})
        .then((obj) => send_message(obj.key))
        .then(() => get_message_from_queue())
        .then((message) => get_object(message)
            .then(obj => {
                return {
                    message,
                    obj,
                }
            })
        )
        .then(({obj, message}) => get_label_detection(message).then(labels => {
                return {
                    message,
                    labels,
                }
            })
        )
        .then(({labels, message}) => {
            if (labels !== 0) {
                let tags = []
                for(let i = 0; i < labels.Labels.length; i++){
                    let tag = {
                        'tag': labels.Labels[i].Name,
                        'perc': labels.Labels[i].Confidence
                    }
                    tags.push(tag)
                }

                let body = {
                    name: JSON.parse(message.Messages[0].Body).name,
                    tags: JSON.stringify(tags)
            }
                return repo.create(body)
            } else {
                return drop_message(message)
                    .then(delete_object(message))
            }
        })
        .then(compose(bind(res.json, res), view.upload))
        .catch(error.generic(res))
}

let upload = require('express').Router()

upload.post('/',
    // auth(token(me)),
    file_parser,
    upload_action
)

module.exports = upload

