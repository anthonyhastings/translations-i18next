# Translations (i18next)

## Introduction

Demonstrates maintaining a pot template, then converting populated po catalogues
into json catalogues and using gettext functions within the application code.

## Installation

To install the application, run the following:

```
npm install;
```

To run the application, run the following:

```
make convert-po-files;
gulp build && gulp server;
```

## Usage

### Extracting strings into a `.pot` file

I have tried using `i18n-parser` which does a good job of identifying simple strings needing to be output into a `.json` object but it's drawbacks outweigh its benefits.

Firstly, it completely [ignores extracting plurals](https://github.com/i18next/i18next-parser/issues/19) because it has no way to identify them within the translations. While other libraries such as `Jed` have specific `ngettext` methods to deal with plurals, this one does not. Secondly, if we manually update the output `.json` file from the parser with our plural keys, then run the parser again, it will overwrite all of our manual updates. Thirdly, the parser is unable to output a `.pot` file which is the standard translators will be expecting to deal with.

For these reasons, it's advised to manually maintain the `.pot` file within `./locales` in order to ensure that plurals can be input correctly. For guidance on the structure of code within `.pot` files, see [this guide](http://pology.nedohodnik.net/doc/user/en_US/ch-poformat.html).

### Creating `.po` catalogues from the `.pot` file

Using an editor such as `POEdit`, create a new catalog from the `.pot` file and ensure you set the plural form to be the correct value for the language you're about to be translating. You can find a list of plural forms [here](http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms) which should be of help. After this is done, fill out and save your `.po` file as required, placing it into a subdirectory of `./locales` which matches the languages two letter code.

NOTE: If you are using POEdit and are creating a catalog for the first time you may find it best to add the plural form **after** the initial setup screen. Sometimes if the plural form is input during the first setup screen it doesn't work correctly.

### Converting `.po` catalogues into `.json` catalogues

The library is unable to directly read a `.po` file so it must be converted into i18next-compatible `.json` format. This is done via a module known as `i18next-conv` which can do two-way conversion on both of these file formats. Conversion to `.json` files can be run with the following command:

```make convert-po-files```

This command will trigger a sub-method I've written within the `Makefile`. It cycles through each of our locale folders, reads the `.po` files and converts them into `.json` files, placing them in the same folder with the same filename. The list of locales it parses is stated within the `Makefile` and will need to be kept up to date as more languages are added.

## Further information

- [i18next website](http://i18next.com/)
- [i18next-parser](https://github.com/i18next/i18next-parser)
- [i18next-conv](https://github.com/i18next/i18next-gettext-converter)
- [Using gettext style within i18next #1](http://blog.arkency.com/2015/03/use-your-gettext-translations-in-your-react-components/)
- [Using gettext style within i18next #2](http://stackoverflow.com/questions/19403787/gettext-style-keys-with-i18next-and-general-workflow)
