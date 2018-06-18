/*
 * This is a handlebars helper, auto-located by handlerbars-loader.
 */

import MD5 from 'crypto-js/md5'

export default function(email) {
  return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=160';
}
