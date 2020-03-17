const multiparty = require('multiparty')
const fs = require('fs')

const file_parser = (req, res, next) => {
    const form = new multiparty.Form()
    form.parse(req, (error, fields, files) => {
        if (error) throw new Error(error)

        const path = files.file[0].path
        const buffer = fs.readFileSync(path)

        const timestamp = Date.now().toString()
        const key_s3 =`${timestamp}-lg`
        const file_name = req.name

        req.file = {
            path,
            buffer,
            key_s3,
            file_name
        }
        const name = 'gatto'
        const acl = 'public'

        req.fields = {
            acl,
            name
        }

        next()
    })
}

module.exports = {
    file_parser,
}
