# Résumé

This is the source code of my web-based CV.

If you're here because I sent you a link to the [rendered version of it](https://maltoe.github.io/resume/dist/index.html) (hello future employer?), let me **thank you** for your interest. In the following, I'll try to explain why this exists and how it was achieved.

If you're here because you were looking for an encrypted static CV page to make your own, please refer to [src/index.js](src/index.js) for a good entry point.

## What is this?

 * I wanted to have my CV as a HTML page, accessible from the Internet, to hand out to potential employers. Not having a personal public website at hand, GitHub pages seemed a perfect candidate for hosting. GitHub pages support static content only.
 * Concerned about my privacy, I wanted to make sure that not everybody would be able to read the CV. Thus, the data needed to be encrypted (both in the "source" and in the rendered static HTML page) and only accessible by providing a passphrase. "Medium-strength" security (i.e., symmetric cipher with reasonably strong passphrase) is sufficient, as it's not super critical data.
 * At the same time, the effort for someone to view it (legitimately) needed to be as low as possible, no typing required.

## How?

 * "Sensitive" data is stored in `.crypt` HTML files which are transparently encrypted/decrypted using [git-crypt](https://github.com/AGWA/git-crypt) with a *local* private key during commit/checkout. The `secrets.crypt.json` file contains the keys that grant access to the rendered page.
 * [webpack.js](https://webpack.js.org/) is used to orchestrate the rendering of JS and CSS files.
 * In the course of this process the data is rendered to HTML content and re-encrypted with the help of [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). Multiple keys are allowed for decryption, i.e. the content has one symmetric content key and multiple "envelopes" for this key. See [loaders/secrets-loader.js](loaders/secrets-loader.js).
 * On the client side, data is decoded using the page's *fragment identifier* and inserted into the page body. No manual password typing is required and one can easily share a link with the password included.

## Is this secure?

As much as possible, I relied on existing APIs and standards with regards to the symmetric encryption and the multi-key requirement. Therefore, I believe the data is stored reasonably securely. The effort to decode this without knowing the symmetric key is big enough for my concerns.

However, the repository and page are public and can be bruteforced. Furthermore, encrypted data remains in the version history of the repository. This means that removing a key from the list of known passphrases (to take away access from a particular recipient) does not prevent one from decrypting these older versions. Thus, if you consider your personal information highly critical data, this approach is not for you. Last but not least, transmitting secrets via URL parameters may not be the best idea.

## Usage

```
# NOTE: All files matching the /crypt/ pattern in this repository are encrypted with git-crypt.
#       Building the page will only work if you replace these with non-encrypted files.
$ npm install
$ npm run build
```
