;(async function(HelloSign) { 
  const r = await fetch('/embedded-signing', { method: 'POST' })
  const { signURLs, clientId } = await r.json()
  let client
  if (clientId && signURLs && signURLs.length > 0) {
    client = new HelloSign();
    console.log(`opening ${signURLs[0]}...`)
    client.open(signURLs[0], { clientId });
    client.on('sign', (data) => {
      alert('The signature request was signed!');
    });
  }
})(HelloSign)