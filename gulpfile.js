const { exec } = require('child_process');
const pkg = require('./package.json');
const fs = require('fs');
const gulp = require('gulp');
const file = require('gulp-file');
const zip = require('gulp-zip');

// Verify config.json exists
gulp.task('verify-config', () => {
  return new Promise((resolve, reject) => {
    fs.access('./config.json', (err) => {
      if (err) reject(err);
      resolve();
    });
  });
});

// Verify config.json exists
gulp.task('verify-client-secret', () => {
  return new Promise((resolve, reject) => {
    fs.access('./client_secret.json', (err) => {
      if (err) reject(err);
      resolve();
    });
  });
});

// Set up links to config.json and client_secret.json
gulp.task('link', () => {
  return Promise.all([
    gulp.series(['verify-config']),
    exec('ln config.json src/slash-command/config.json'),
    exec('ln src/messages.json src/slash-command/messages.json')
  ]);
});

// Start functions emulator
gulp.task('emulator-start', () => {
  return exec(`echo ${process.env.PROJECT_ID} | functions start`);
});

// Deploy functions on emulator
gulp.task('emulator-deploy', () => {
  return Promise.all([
    exec(`functions deploy slashCommand --source src/slash-command --trigger-http --timeout 3s`)
  ]);
});

// Build docker
gulp.task('emulator', gulp.series([
  'link',
  'emulator-start',
  'emulator-deploy'
]));

// Run `npm install`
gulp.task('npm-install', () => {
  return exec('npm install');
});

// Build artifacts
gulp.task('build', () => {
  return gulp.src([
      'src/.gitignore',
      'src/README',
      'src/config.tpl',
      'src/terraform.tf'
    ])
    .pipe(file('VERSION', pkg.version))
    .pipe(file('terraform.tfvars', ''))
    .pipe(gulp.dest('build/slack-sms'));
});

// Dist artifact
gulp.task('dist', () => {
  return gulp.src(['build/**'], {dot: true})
    .pipe(zip(`slack-sms-${pkg.version}.zip`))
    .pipe(gulp.dest('dist'));
});

// Travis deploy check
gulp.task('travis', () => {
  return new Promise((resolve, reject) => {
    if (process.env.TRAVIS_TAG !== pkg.version) {
      reject(new Error('$TRAVIS_TAG and package.json do not match'));
    }
    resolve();
  });
});

// Default
gulp.task('default', gulp.series(['npm-install', 'build', 'dist']));
