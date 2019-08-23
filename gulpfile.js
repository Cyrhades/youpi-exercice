//// Constants

// Plugins ressources
const { dest, parallel, series, src, task, watch } 	= require('gulp'),
  colors      = require('ansi-colors'),
  browserSync = require('browser-sync').create();
  fancyLog    = require('fancy-log'),
  eslint      = require('gulp-eslint'),
  htmllint    = require('gulp-htmllint'),
  jestcli     = require('jest-cli'),
  stylelint   = require('gulp-stylelint')
;



//// Sub-tasks

// Copy all assets to dist
task('copy-assets', function() {
	return src(['src/**/*.*', '!node_modules/**'])
		.pipe(dest('dist/'));
});

// Copy css & notify browser sync
task('copy-css', function() {
	return src('src/**/*.css')
		.pipe(dest('dist/'))
		.pipe(browserSync.stream());
});

// Copy html & notify browser sync
task('copy-html', function() {
	return src( 'src/**/*.html')
		.pipe(dest('dist/'))
		.pipe(browserSync.stream());
});

// Copy js & notify browser sync
task('copy-js', function () {
  return src( [
    'src/**/*.js',
    '!src/js/vendor/**/*.js'
    ])
		.pipe(dest('dist/'))
		.pipe(browserSync.stream());
});

// Lint css & check for errors
task('lint-css', function lintCssTask() {
  return src(['src/**/*.css', '!node_modules/**'])
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true},
        {formatter: isCssOk}
      ]
    }));
});

// Lint html & check for errors
task('lint-html', function() {
  return src(['src/**/*.html', '!node_modules/**'])
    .pipe(htmllint({}, htmllintReporter));
});

// Lint html & check for errors
task('lint-js', function() {
  return src(['src/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', notifyJsIsOk );
});

// Create watcher
task('start-watch', function () {
  browserSync.init({
      server: "./dist"
  });

  // Watch every tech
	const watcherHTML = watch(['src/**/*.html']);
	const watcherCSS 	= watch(['src/**/*.css']);
	const watcherJS 	= watch([	'src/**/*.js',
															'!src/js/vendor/**/*.js'
														]);

  // Update when necessary
  watcherHTML	.on('change', parallel('copy-html'));
  watcherCSS	.on('change', parallel('copy-css'));
  watcherJS		.on('change', parallel('copy-js'));
});


// Unit test JS, via Jest CLI
task('ut-js', () =>
	jestcli.runCLI(
    {
			config: {} // cf. jest.config.js
		},
		'.'
	)
);



//// Tasks

// Default tesk, executed when using 'gulp'
//  	Capy all assets to dist
task('default', parallel('copy-assets'));

//  Watch : copy all files, and then update when necessary
task('watch', series('default', 'start-watch'));

// Run all linters & UT
task('lint',    parallel('lint-html', 'lint-css', 'lint-js'));
task('ut',      parallel('ut-js'));



//// Utility functions
// Handle htmllint errors display
function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        issues.forEach(function (issue) {
            fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
        });
        process.exitCode = 1;
    }
    else {
      fancyLog(colors.green('HTML is clean :)'))
    }
}

// Display a message if css is ok
function isCssOk(report) {
  // console.log(report);
  if(typeof report[0].errored === 'undefined'){
    fancyLog(colors.green('CSS is clean :)'));
  }
}

// Callback for js is ok
function notifyJsIsOk() {
  fancyLog(colors.green('JS is clean :)'))
}
