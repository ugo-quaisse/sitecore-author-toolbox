# Sitecore Author Toolbox (Chrome/Edge extension)

A google Chrome/Edge extension that brings a set of handy tools for Sitecore's authors.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/mckfcmcdbgkgffdknpkaihjigmcnnbco)](https://chrome.google.com/webstore/detail/mckfcmcdbgkgffdknpkaihjigmcnnbco/)
![Rating](https://img.shields.io/chrome-web-store/rating/mckfcmcdbgkgffdknpkaihjigmcnnbco)
![Users](https://img.shields.io/chrome-web-store/users/mckfcmcdbgkgffdknpkaihjigmcnnbco)

![Js](https://img.shields.io/github/languages/top/ugo-quaisse/sitecore-author-toolbox)
![Count](https://img.shields.io/github/languages/count/ugo-quaisse/sitecore-author-toolbox)
![Size](https://img.shields.io/github/repo-size/ugo-quaisse/sitecore-author-toolbox)
![Issues](https://img.shields.io/github/issues-raw/ugo-quaisse/sitecore-author-toolbox)

[![Sitecore Author Toolbox Video](http://img.youtube.com/vi/f-IT1sLyl44/0.jpg)](http://www.youtube.com/watch?v=f-IT1sLyl44)

## Presentation

This extension will help you to save a lot of time by providing a set of handy tools into Sitecore Content Editor.

- Displays Live URLs of a page (CM or CD)
- Shows Live Status of a page (Published/Not published)
- Dynamic error messages
- Dark Mode (Manual or Automatic)
- Language flags + version highlight
- Workbox badge & notifications
- Support Media upload Drag and Drop
- Desktop notification on Publish
- Right-to-left support (Arabic, Hebrew, Persian, Urdu, Sindhi)
- Launchpad icon / Desktop menu
- Favourites Bar in Content Tree
- Resume from where you left off
- Character counter
- HTML editor color syntax
- Accordion sections to Tabs
- Auto Expand Tree
- Translate Mode Copy Button
- Experience Editor Quick Tabs
- Experience Profile Gravatar image
- Media Library revamped
- New preview mode (Mobile, Tablet, Desktop)

## How to install

- Clone or download the repo
- Open chrome://extensions/ or edge://extensions/
- Make sure "Developer mode" toggle is switched on (Top right corner)
- Clic "Load Unpacked"
- Select Repo folder

## Sitecore installation directory

If your Sitecore install is highly customised or not one of the tested versions, then certain features might not work.
Requires that Sitecore is installed to the default directory of /sitecore/.

## Supported Sitecore version

Tested on Sitecore versions:

- 10.1.0 (rev. 005207)
- 10.0.1 (rev. 004842)
- 9.3.0 (rev. 003498)
- 9.2.0 (rev. 002893)
- 8.2 (rev. 180406)

## Live version

The latest stable version can be installed from the [Chrome Web Store here](https://chrome.google.com/webstore/detail/mckfcmcdbgkgffdknpkaihjigmcnnbco/)

## Development / Contributing

Follow steps below if you want to start coding or fixing issues.

### Prerequisites

Install **nodejs**

```cmd
https://nodejs.org/en/download/
```

### Environment setup

Clone repository

```cmd
git clone https://github.com/ugo-quaisse/sitecore-author-toolbox.git
```

Install node modules

```cmd
npm install
```

Run npm

```cmd
npm run dev
```

## Where to start

Main program execution is located under https://github.com/ugo-quaisse/sitecore-author-toolbox/blob/master/src/toolbox.js

## Support

The official support Twitter account for the library is at <https://twitter.com/uquaisse>.

![Licence](https://img.shields.io/github/license/ugo-quaisse/sitecore-author-toolbox)

## Credits

- Experience Profile Gravatar Image inspired by https://github.com/coreyasmith/sitecore-experience-profile-gravatar
- Html Syntax highlight by Codemirror library https://github.com/codemirror/CodeMirror
- Auto Expand tree inspired by https://github.com/alan-null/sc_ext

## Other Sitecore extensions

If you are a Sitecore developer and are looking for more advanced features for dev, I recommend Alan Null's extension available at https://github.com/alan-null/sc_ext
