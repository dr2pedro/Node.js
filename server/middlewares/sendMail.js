const nodemailer = require('nodemailer')
const configs = require('../../configs/smtp.json')
const credentials = '"Pedro dos Santos: CTO-CodePlayData" <dr2p@codeplaydata.cto.com>'
const email = 'dr2p@hotmail.com'

senbymail = async (configs, mail) => {
    nodemailer
        .createTransport(configs)
        .sendMail(mail)
}

sendByMail
   