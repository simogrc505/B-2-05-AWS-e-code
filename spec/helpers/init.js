const config = require('config');
const knex = require('knex')(config.db)

const user_role_admin = {
    id: 1,
    username: 'admin@gmail.com',
    role: 'ROLE_ADMIN',
}
const user_role_user = {
    id: 2,
    username: 'user@gmail.com',
    role: 'ROLE_USER',
}
const mock = require('mock-require')

mock('../../src/microservices/auth', (token) => {
    if (token === 'admin') {
        return Promise.resolve(user_role_admin)
    }
    if (token === 'user') {
        return Promise.resolve(user_role_user)
    }
})

mock('../../src/services/aws', {
    upload_file: (options) => {
        return Promise.resolve({
            ETag: '9deb483194b240969ce3090febb8fc53',
            Location: 'https://simo-esercizio-test.s3.eu-west-1.amazonaws.com/gattino.jpeg',
            key: 'ciao',
            Key: 'ciao',
            Bucket: 'simo-esercizio-test'
        })
    },

    send_message: () => {
        return Promise.resolve({
            ResponseMetadata: { RequestId: '9738b432-9516-58e7-8b27-e2d85ca80bb3' },
            MD5OfMessageBody: '673cfa82eb9fc37a5d6a5f02fb54eb85',
            MessageId: '14dd4409-6d57-4ad9-ae58-03d4628ffb2e'
        })
    },
    get_message_from_queue: () => {
        return Promise.resolve({
            ResponseMetadata: { RequestId: '107d9199-b3c2-5672-8ea4-c77323357c09' },
            Messages: [
                {
                    MessageId: 'fd89151a-41a4-4312-b8cc-c27d393a2d5d',
                    ReceiptHandle: 'AQEBzBQUKJzkuNBNFw/0Akgi9lGIDh9EnY+TpmWJMAOvFrF5XYtpvap/P2lLCrsclDX7L2x3lOK8M2ztFY5BQhpiMq44Z23I6yVK+lFowXuH/ivtFZ0H0Gm5MVY5soMi8E+0eaXK9hQupsbUqDnpXYpGmgd1qgpw3/wxV7XFAZE3VDLGdb6TxS9jqSY0U/wlVSj4N4SLwZNJXuWvUqyd/2BaIanoPS4TPmTQZCtPksUD8z/ZvFbcBVDd9+yYc1dwq4pamS1fIN5n06pQm9UyQvOSL3Wa9icNYQwhRcyhFlbReY2aP+/LioAb90tOrSCsjSs1jLjWYgZv/jTstVLi1QbpZF9tCVFPwFCzevqzpC8yXwfCTkaeqfZIzO0lTW2pK4LXR6mcyij8+Hy5E7lIVaWkRg==',
                    MD5OfBody: '6d23e1a66d256591c46dc5531b4b4582',
                    Body: '{"name":"1584374752480-lg"}'
                }
            ]
        })
    },
    get_object: () => {
        return Promise.resolve({
            AcceptRanges: 'bytes',
            LastModified: '2020-03-17T12:03:38.000Z',
            ContentLength: 9375,
            ETag: '4d7ca5f2c6ce28fb1fcbfb34ecc5af71',
            ContentType: 'application/octet-stream',
            Metadata: {},
            Body: '<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 84 00 05 06 06 07 09 07 0a 0b 0b 0a 0d 0e 0d 0e 0d 13 12 10 10 12 13 1d 15 16 15 ... 9325 more bytes>'
    })
    },
    get_label_detection: () => {
        return Promise.resolve({
            Labels: [
                { Name: 'Nature', Confidence: 97.92724609375 },
                { Name: 'Outdoors', Confidence: 97.31690979003906 },
                { Name: 'Outer Space', Confidence: 87.50558471679688 },
                { Name: 'Astronomy', Confidence: 87.50558471679688 },
                { Name: 'Moon', Confidence: 84.14134216308594 }
            ]
        })
    },
    drop_message: () => {
        return Promise.resolve()
    },
    delete_object: () => {
        return Promise.resolve()
    },
})

global.db_init = (done) => {
    return knex.seed
        .run().then(() => {
            return done()
        }).catch((err) => {
            if (err) {
                throw err
            }

            done()
        })
}
