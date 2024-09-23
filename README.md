# Simple Proxy chrome extension

 - [Extensions - Chrome for Developers](https://developer.chrome.com/docs/extensions/)
 - [`manifest.json` file](https://developer.chrome.com/docs/extensions/mv3/manifest/)
 - [Publish extension](https://support.google.com/chrome/a/answer/2714278?hl=en)
 - [How to read logs of extension](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/#debug-bg)
 - [`chrome.proxy`](https://developer.chrome.com/docs/extensions/reference/api/proxy)

## Build

```
$ npm run clean
$ npm run build
$ npm run package
```

## Develop

```
$ npm install
$ npm run build
$ npm run launch
```

In [order to debug](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/#debug-bg), you'll have to enable the "Developer mode" under [extension's configuration](chrome://extensions).

Note: changes into the extension aren't watched, you'll have to re run the build command and reload the extension (hit the "Update" button in extension's configuration after enabling developer mode).

Remember to format files before commiting:

```
$ npm run format
```
