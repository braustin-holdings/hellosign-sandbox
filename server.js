require('dotenv').config()
const fs = require('fs')
const hellosign = require('hellosign-sdk')({ key: process.env.HELLOSIGN_API_KEY })

;(async () => {
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
 
})()
