require('dotenv').config()
const path = require('path')
const fs = require('fs')
const pdf = require('html-pdf')
const hellosign = require('hellosign-sdk')({ key: process.env.HELLOSIGN_API_KEY })

const htmlFilePath = path.join('./', 'template.html')
const outPath = path.join('./', 'template.pdf')

const generatePDF = html => {
  return new Promise((resolve, reject) => {
    pdf.create(html)
       .toFile(outPath, (err, res) => err ? reject(err) : resolve(res))
  })
}

const sendWithTextTags = async () => {  
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
        name: 'Alice'
      },
    ],
    files: [filename],
    use_text_tags: 1,
    hide_text_tags: 1
  };
  
  hellosign.signatureRequest.send(opts).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err)
  });
}

const sendWithTemplate = async () => {
  const list = await hellosign.template.list()
  const template_id = list.templates[0].template_id

  const options = {
    test_mode: 1,
    template_id,
    title: 'Testing sending with template from Node',
    subject: 'Testing with Node',
    message: 'This is a test test test',
    signers: [
      {
        email_address: 'zylo.codes@gmail.com',
        name: 'Josh Test',
        role: 'Renter 1'
      },
    ]
  };
  console.log(options)
  
  hellosign.signatureRequest.sendWithTemplate(options).then((res) => {
    console.log(res)
    // handle response
  }).catch((err) => {
    // handle error
    console.log(error)
  });
}

;(() => {
  // sendWithTemplate()
  sendWithTextTags()
})()
