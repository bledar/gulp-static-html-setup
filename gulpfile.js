var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();
var injectPartials = require('gulp-inject-partials');

var paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "src/scss/*.scss",
        src_file: "src/scss/app.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "public/css"
    }

    // Easily add additional paths
    // ,html: {
    //  src: '...',
    //  dest: '...'
    // }
};

// Define tasks after requiring dependencies
function style() {
    // Where should gulp look for the sass files?
    // My .sass files are stored in the styles folder
    // (If you want to use scss files, simply look for *.scss files instead)
    return gulp
        .src(paths.styles.src_file)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}
function reload() {
    browserSync.reload();
}

function inject(){
    return gulp.src('./src/*.html')
        // .pipe(injectPartials({ removeTags:true }))
        .pipe(injectPartials())
        .pipe(gulp.dest('./public'));
}

function watch() {
    // gulp.watch takes in the location of the files to watch for changes
    // and the name of the function we want to run on change
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./public"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    style();
    inject();
    gulp.watch(paths.styles.src, style);
    gulp.watch("src/**/*.html", inject);
    gulp.watch("src/**/**/*.html", reload);
    gulp.watch("public/*.html", reload);
    gulp.watch("public/**/*.js", reload);
}


// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;
exports.watch = watch;