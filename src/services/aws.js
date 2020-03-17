const config = require('config')
const AWS = require('aws-sdk')
const { tap } = require('ramda')

const s3 = new AWS.S3({region: config.s3.region})
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27', region: 'eu-west-1'})
const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'eu-west-1',
});

const upload_file = (buffer, options) => {
    let params = {
        ACL: options.acl,
        Body: buffer,
        Bucket: config.s3.bucket,
        Key: `${options.file_name}`,
    }

    return s3.upload(params).promise()
}

const send_message = (name) => {
    sqs.sendMessage({
        QueueUrl: config.sqs.queue_url,
        MessageBody: JSON.stringify({
            name: name,
        }),
    }).promise()
        .then((message) => {
            return Promise.resolve(message);
        })
}

const get_message_from_queue = () => {
    return sqs.receiveMessage({
        QueueUrl: config.sqs.queue_url,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 300,
        WaitTimeSeconds: 20,
    })
        .promise()
}

const get_object = (message) => {
    let params = {
        Bucket: config.s3.bucket,
        Key: JSON.parse(message.Messages[0].Body).name
    };
    return s3.getObject(params).promise()
        .then((response) => response.Body)
        .catch((err) => Promise.reject({status: 404, message: "Not found"}))
}

const delete_object = (message) => {
    let params = {
        Bucket: config.s3.bucket,
        Key: JSON.parse(message.Messages[0].Body).name
    };
    return s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    }).promise()
}

const get_label_detection = (message) => {
    let params = {
        Image: {
            S3Object: {
                Bucket: config.s3.bucket,
                Name: JSON.parse(message.Messages[0].Body).name
            }
        },
        MaxLabels: 5,
        MinConfidence: 50
    };
   return rekognition.detectLabels(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    }).promise()
}

const drop_message = (message) => {
    return sqs.deleteMessage({
        QueueUrl: config.sqs.queue_url,
        ReceiptHandle: message.Messages[0].ReceiptHandle,
    }).promise()
}

module.exports = {
    upload_file,
    send_message,
    get_message_from_queue,
    get_label_detection,
    drop_message,
    get_object,
    delete_object
}
