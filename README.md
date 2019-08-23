# boilerplate-exercice
Boilerplate pour la rédaction d'exercices

## Commandes

> gulp

Copy all assets to /dist

> gulp watch

Copy all assets to /dist, then auto update the browser when a change is made in /src


## Technologies utilisées
### Packages
gulp / gulp-cli // accès à gulp
yarn // Alternative à npm, plus rapide


#### HMR
Browser sync package
https://www.browsersync.io/docs/gulp

#### Html linter
Gulp package
https://www.npmjs.com/package/gulp-htmllint

Original lib
https://github.com/htmllint/htmllint/

Config options
https://github.com/htmllint/htmllint/wiki/Options

#### Css linter
Gulp package
https://www.npmjs.com/package/gulp-stylelint

Original lib
https://stylelint.io/

Config options
https://www.npmjs.com/package/gulp-stylelint / https://stylelint.io/user-guide/configuration
Possibilité d'autofix

Existing config
https://www.npmjs.com/package/stylelint-config-airbnb

Fix deprecated dependencies, add stylelint-scss & stylelint-order

#### JS linter
Gulp package
https://www.npmjs.com/package/gulp-eslint
Possibilité de fix auto

Original lib
https://eslint.org/

Existing config
https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb

Use without react
https://github.com/airbnb/javascript/issues/451#issuecomment-133566960

Copy file if all is ok
https://github.com/lukeapage/gulp-eslint-if-fixed

Jest compatibility
https://stackoverflow.com/questions/44479207/prevent-test-expect-etc-is-not-defined-errors-when-using-jest/44479250

#### JS UT / Jest
Gulp packages are cancer
// https://www.npmjs.com/package/gulp-jester
// https://www.npmjs.com/package/gulp-jester-cli

Original lib
https://jestjs.io/

CLI
https://jestjs.io/docs/en/cli

Config
https://jestjs.io/docs/en/configuration

Set up through package.json scripts, or directly call jest-cli.runCLI in gulpfile

// https://medium.com/@ryanblahnik/setting-up-testing-with-jest-and-node-js-b793f1b5621e


### Others
Editor Config
https://editorconfig.org/

Editor config setup (atom)
https://atom.io/packages/editorconfig



## Plugins IDE recommandés
Emmet / Raccourcis divers
File icons / Arborescence plus jolie
beautyfier / clean code
