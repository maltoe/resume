import './css/base.css.scss'
import './css/emojis.css.scss'
import './css/decoding_overlay.css.scss'
import './css/print.css.scss'

import CryptoJS from 'crypto-js'
import secrets from './secrets.dat'
import contentTemplate from './content.hbs'

function decrypt(s, key) {
  try {
    var decrypted = CryptoJS.AES.decrypt(s, key).toString(CryptoJS.enc.Utf8);
    return (decrypted.length > 0) ? decrypted : null;
  } catch(err) {
    return null;
  }
}

function getContentKey(client_key) {
  let match = secrets.envelopes.find(function(elem) {
    let hmac = CryptoJS.HmacSHA256(elem.key, CryptoJS.SHA256(client_key)).toString();
    return (elem.hmac == hmac);
  });

  if(match) {
    let content_key = decrypt(match.key, client_key);
    return content_key;
  }

  return null;
}

function loadContent(content_key) {
  document.getElementById("decoding-info").innerHTML = "Decoding...";

  let decrypted = decrypt(secrets.content, content_key);
  if(!decrypted)
    return false;

  let content = JSON.parse(decrypted);
  let html = contentTemplate(content);

  document.title = content.title;
  document.getElementById("content").innerHTML = html;

  /*
  var html = HandlebarsTemplates['js/content'](json);
  $("#content").html(html);

  update_language_graph(json['skills']['languages']);
  */

  return true;
}

function hideInfo() {
  document.getElementById("decoding-overlay").classList.add("hidden");
}

function noAccess() {
  document.getElementById("decoding-info").innerHTML =
    "Decoding failure. Please provide password using fragment identifier.";
}

(function() {
  let client_key = window.location.hash.substr(1);
  if(!client_key)
    return noAccess();

  let content_key = getContentKey(client_key);
  if(!content_key)
    return noAccess();

  if(!loadContent(content_key))
    return noAccess();

  hideInfo();
})();
