// // Constants
// const mdVisualizerSrc = 'md_visualizer/src/README.md';
const mdVisualizerSrc = 'docs/README.md';

// Plugins ressources
const {
  dest, parallel, series, src, task, watch,
} = require('gulp');
const colors = require('ansi-colors');
const browserSync = require('browser-sync').create();
const fancyLog = require('fancy-log');
// const minifycss = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const htmllint = require('gulp-htmllint');
const inject = require('gulp-inject');
const markdown = require('gulp-markdown');
const stylelint = require('gulp-stylelint');
// const uglify = require('gulp-uglify');
const jestcli = require('jest-cli');


// // Utility functions
// Handle htmllint errors display
function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach((issue) => {
      fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(`${filepath} [${issue.line},${issue.column}]: `) + colors.red(`(${issue.code}) ${issue.msg}`));
    });
    process.exitCode = 1;
  } else {
    fancyLog(colors.green('HTML is clean :)'));
  }
}

// Display a message if css is ok
function isCssOk(report) {
  // console.log(report);
  if (typeof report[0].errored === 'undefined') {
    fancyLog(colors.green('CSS is clean :)'));
  }
}

// Callback for js is ok
function notifyJsIsOk() {
  fancyLog(colors.green('JS is clean :)'));
}


// // Sub-tasks

// Copy all assets to dist
task('copy-assets', () => src(['src/**/*.*', '!node_modules/**'])
  .pipe(dest('dist/')));

// Copy css & notify browser sync
task('copy-css', () => src('src/**/*.css')
  .pipe(dest('dist/'))
  .pipe(browserSync.stream()));

// Copy html & notify browser sync
task('copy-html', () => src('src/**/*.html')
  .pipe(dest('dist/'))
  .pipe(browserSync.stream()));

// Copy js & notify browser sync
task('copy-js', () => src([
  'src/**/*.js',
  '!src/js/vendor/**/*.js',
])
  .pipe(dest('dist/'))
  .pipe(browserSync.stream()));

// Copy assets for md editor
// return src(['src/**/*.css', 'src/assets/**/*.*']) // wrong assets dest ?
task('copy-md-assets', () => src(['src/**/*.*', 'src/**/*.md', 'src/**/*.js', 'src/**/*.html'])
  .pipe(dest('md_visualizer/dist/')));

// Copy all css vendor assets to dist
// Possibility to concat all in one, but it might be more obscure for students
task('copy-minify-css-vendors', () => src(['node_modules/normalize.css/normalize.css'])
// .pipe(minifycss())
  .pipe(dest('dist/css/vendors/')));

// Copy all js vendor assets to dist
// Possibility to concat all in one, but it might be more obscure for students
task('copy-minify-js-vendors', () => src(['node_modules/jquery/dist/jquery.min.js'])
// .pipe(uglify())
  .pipe(dest('dist/js/vendors/')));

task('copy-vendors', parallel('copy-minify-css-vendors', 'copy-minify-js-vendors'));

// Lint css & check for errors
task('lint-css', () => src(['src/**/*.css', '!node_modules/**'])
  .pipe(stylelint({
    reporters: [
      { formatter: 'string', console: true },
      { formatter: isCssOk },
    ],
  })));

// Lint html & check for errors
task('lint-html', () => src(['src/**/*.html', '!node_modules/**'])
  .pipe(htmllint({}, htmllintReporter)));

// Lint html & check for errors
task('lint-js', () => src(['src/**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on('end', notifyJsIsOk));

// Convert MD to HTML, & Direct injection, to enable HMR without temp files
task('md-in-html', () => {
  const converted = src([mdVisualizerSrc]).pipe(markdown());

  return src('md_visualizer/src/index.html')
    .pipe(inject(converted, {
      starttag: '<!-- inject:mymd -->',
      transform(filepath, file) {
        return file.contents.toString();
      },
    }))
    .pipe(dest('md_visualizer/dist'))
    .pipe(browserSync.stream());
});

// Create MD watcher
task('start-md-watch', () => {
  browserSync.init({
    server: './md_visualizer/dist',
  });

  // Watch every tech
  const watcherMD = watch(mdVisualizerSrc);

  // Update when necessary
  // watcherMD.on('change', series('convert-md', 'update-html'));
  watcherMD.on('change', parallel('md-in-html'));
});

// Create watcher
task('start-watch', () => {
  browserSync.init({
    server: './dist',
  });

  // Watch every tech
  const watcherHTML = watch(['src/**/*.html']);
  const watcherCSS = watch(['src/**/*.css']);
  const watcherJS = watch(['src/**/*.js',
    '!src/js/vendor/**/*.js',
  ]);

  // Update when necessary
  watcherHTML.on('change', parallel('copy-html'));
  watcherCSS.on('change', parallel('copy-css'));
  watcherJS.on('change', parallel('copy-js'));
});


// Unit test JS, via Jest CLI
task('ut-js', () => jestcli.runCLI({
  config: {}, // cf. jest.config.js
},
'.'));


// // Tasks

// Default tesk, executed when using 'gulp'
//    Capy all assets to dist
task('default', parallel('copy-assets', 'copy-vendors'));

//  Watch : copy all files, and then update when necessary
task('watch', series('default', 'start-watch'));

//  Watch-md : convert MD file, inject it into HTML, and update when necessary
task('watch-md', series('copy-md-assets', 'md-in-html', 'start-md-watch'));

// Run all linters & UT
task('lint', parallel('lint-html', 'lint-css', 'lint-js'));
task('ut', parallel('ut-js'));
