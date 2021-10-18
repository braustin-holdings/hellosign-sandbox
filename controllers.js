const fs = require('fs')
const pdf = require('html-pdf')
const hellosign = require('hellosign-sdk')({ key: process.env.HELLOSIGN_API_KEY })

const htmlFilePath = './template.html'
const outPath = './template.pdf'

const generatePDF = html => {
  return new Promise((resolve, reject) => {
    pdf.create(html)
       .toFile(outPath, (err, res) => err ? reject(err) : resolve(res))
  })
}

module.exports = {
  async embeddedSigning(req, res) {  
    const html = fs.readFileSync(htmlFilePath, 'utf-8')
    const { filename } = await generatePDF(html)
    const opts = {
      test_mode: 1,
      clientId: process.env.HELLOSIGN_CLIENT_ID,
      subject: 'NDA with Acme Co.',
      message: 'Please sign this NDA and then we can discuss more.?',
      signers: [
        {
          email_address: 'zylo.codes@gmail.com',
          name: 'Josh'
        }
      ],
      files: [filename]
    }
    try {
      let response = await hellosign.signatureRequest.createEmbedded(opts)
      // res = await hellosign.embedded.getSignUrl(signature_request_id)
      res.json(response)
    } catch(err) {
      res.status(500).json(err)
    }
  },
  async sendWithTextTags(req, res) {  
    const html = fs.readFileSync(htmlFilePath, 'utf-8')
    const { filename } = await generatePDF(html)
    const opts = {
      test_mode: 1,
      title: 'NDA with Acme Co.',
      subject: 'The NDA we talked about',
      message: 'Please sign this NDA and then we can discuss more. Let me know if you have any questions.',
      signers: [
        {
          email_address: 'zylo.codes@gmail.com',
          name: 'Josh'
        },
      ],
      files: [ filename ],
      use_text_tags: 1,
      hide_text_tags: 1
    };
    try {
      const response = await hellosign.signatureRequest.send(opts)
      res.json(response)
    } catch(err) {
      res.status(500).json(err)
    }
  },
}