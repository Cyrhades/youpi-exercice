//// Constants

// Plugins ressources
const { dest, parallel, series, src, task, watch } 	= require('gulp'),
  colors      = require('ansi-colors'),
  browserSync = require('browser-sync').create();
  fancyLog    = require('fancy-log'),
  minifycss 	= require('gulp-clean-css'),
  eslint      = require('gulp-eslint'),
  htmllint    = require('gulp-htmllint'),
  inject      = require('gulp-inject'),
  markdown    = require('gulp-markdown'),
  stylelint   = require('gulp-stylelint'),
  uglify 			= require('gulp-uglify'),
  jestcli     = require('jest-cli')
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

// Copy assets for md editor
task('copy-md-assets', function() {
	// return src(['src/**/*.css', 'src/assets/**/*.*']) // wrong assets dest ?
	return src(['src/**/*.*', 'src/**/*.md', 'src/**/*.js', 'src/**/*.html'])
		.pipe(dest('md_visualizer/dist/'));
});

// Copy all css vendor assets to dist
// Possibility to concat all in one, but it might be more obscure for students
task('copy-minify-css-vendors', function() {
	return src(['node_modules/normalize.css/normalize.css'])
    // .pipe(minifycss())
		.pipe(dest('dist/css/vendors/'));
});

// Copy all js vendor assets to dist
// Possibility to concat all in one, but it might be more obscure for students
task('copy-minify-js-vendors', function() {
	return src(['node_modules/jquery/dist/jquery.min.js'])
    // .pipe(uglify())
		.pipe(dest('dist/js/vendors/'));
});

task('copy-vendors', parallel('copy-minify-css-vendors', 'copy-minify-js-vendors'));

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

// Convert MD to HTML, & Direct injection, to enable HMR without temp files
task('md-in-html', function() {
  const converted = src(['md_visualizer/src/README.md']).pipe(markdown());

  return src('md_visualizer/src/index.html')
    .pipe(inject(converted, {
       starttag: '<!-- inject:mymd -->',
       transform: function(filepath, file) {
         return file.contents.toString();
       }
    }))
   .pipe(dest('md_visualizer/dist'))
   .pipe(browserSync.stream());
});

// Create MD watcher
task('start-md-watch', function () {
  browserSync.init({
      server: "./md_visualizer/dist"
  });

  // Watch every tech
	const watcherMD = watch('md_visualizer/src/README.md');

  // Update when necessary
  // watcherMD.on('change', series('convert-md', 'update-html'));
  watcherMD.on('change', parallel('md-in-html'));
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
task('default', parallel('copy-assets', 'copy-vendors'));

//  Watch : copy all files, and then update when necessary
task('watch', series('default', 'start-watch'));

//  Watch-md : convert MD file, inject it into HTML, and update when necessary
task('watch-md', series('copy-md-assets', 'md-in-html', 'start-md-watch'));

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
