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
      let { signature_request: { signatures } } = await hellosign.signatureRequest.createEmbedded(opts)
      const signURLs = []
      if (signatures) {
        for (const { signature_id } of signatures) {
          const { embedded: { sign_url } } = await hellosign.embedded.getSignUrl(signature_id)
          signURLs.push(sign_url)
        }
      }
      res.json({ signURLs, clientId: process.env.HELLOSIGN_CLIENT_ID })
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
  handleCatchAll: async function(req, res) {
    console.log(`${req.method} to ${req.url}`)
    console.log(req.body)
    res.end()
  }
}