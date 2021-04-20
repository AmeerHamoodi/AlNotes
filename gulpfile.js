const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass");
const exec = require("child_process").exec;

sass.compiler = require("node-sass");

const run = [0, 0, 0, 0];

const js = () => {
    run[0] == 0 && gulp.watch("", js);

    run[0] = 1;

    return gulp.src("./core/src/js/main.tsx")
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest("./dist/public/js"))
};

const html = () => {
    run[1] == 0 && gulp.watch("./core/src/*.html", html);
    run[1] = 1;

    return gulp.src("./core/src/*.html")
        .pipe(gulp.dest("./dist/public/"))
};

const css = () => {
    run[2] == 0 && gulp.watch("./core/src/css/**", css);

    run[2] = 1;

    return gulp.src("./core/src/css/**")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dist/public/css/"))
};

const image = () => {
    return gulp.src("./core/src/imgs/**")
        .pipe(gulp.dest("./dist/public/imgs"))
}

const vendor = () => {
    return gulp.src("./core/src/vendor/**")
        .pipe(gulp.dest("./dist/public/vendor"))
}

const electron = () => {
    exec("npm start", (error, output) => {
        if (error) throw error;

        console.log(output);
    })
}


module.exports.default = gulp.parallel(vendor, js, html, css, image, electron);