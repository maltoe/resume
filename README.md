# Why?

 * I wanted to have my CV as a HTML page, accessible from the Internet. Not having a personal public website, I wanted to use GitHub pages, so only static content.
 * I didn't want to show it to everybody, so I needed to encrypt it. "Medium-strength" security (i.e., symmetric with reasonably strong passphrase) should suffice, as it's not super critical data.
 * I wanted to keep the effort for someone to view it (legitimately) as low as possible, no typing required.

# How?

Nothing too fancy here, but I might as well describe it to show that we (all of us) always document our software.

 * "Sensitive" data is stored in a human-editable YAML file which is transparently encrypted/decrypted using [git-crypt](https://github.com/AGWA/git-crypt) with a *local* private key during commit/checkout.
 * Ruby's Rake is used to orchestrate rendering of ERB templates of CSS/JS files into their finished versions using [sprockets-standalone](https://github.com/jgraichen/sprockets-standalone).
 *  In the course of which data is rendered to HTML content and re-encrypted with the help of [crypto-js](https://code.google.com/archive/p/crypto-js/) in a V8 engine ([therubyracer](https://github.com/cowboyd/therubyracer)).
 * Data is decoded using the page's fragment identifier on the client side and inserted into page body.

# Usage

Inside the `src/` directory:

```
bundle install

# To rebuild debug version in src/build/.
bundle exec rake

# To overwrite files in top-level directory with release version.
bundle exec rake release:clean release:compile
```
