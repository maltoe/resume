var CryptoJS = require("crypto-js");

// https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
var randomString = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = function(source) {
  secrets = JSON.parse(source);

  let content_key       = randomString(64);
  let content_json      = JSON.stringify(secrets.content);
  let content_encrypted = CryptoJS.AES.encrypt(content_json, content_key).toString();

  let envelopes = secrets.keys.map(function(client_key) {
    let content_key_encrypted = CryptoJS.AES.encrypt(content_key, client_key).toString();
    let hmac = CryptoJS.HmacSHA256(content_key_encrypted, CryptoJS.SHA256(client_key)).toString();

    return {
      "key": content_key_encrypted,
      "hmac": hmac
    };
  });

  var message = source;
  var passphrase = "Secret Passphrase";
  var encrypted = CryptoJS.AES.encrypt(message, passphrase).toString();
  var hmac = CryptoJS.HmacSHA256(encrypted, CryptoJS.SHA256(passphrase)).toString();
  //var transitmessage = "module.exports = function() { return \"" + hmac + encrypted + "\"; }";
//  return "module.exports = function() { return \"" + hmac + encrypted + "\"; }";

  return {
    "content": content_encrypted,
    "envelopes": envelopes
  };
}
