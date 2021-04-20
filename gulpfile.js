const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass");
const exec = require("child_process").exec;

sass.compiler = require("node-sass");

const run = [0, 0, 0, 0];

const js = () => {
    run[0] == 0 && gulp.watch("./core/src/js/**", js);

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

    return gulp.src("./core/src/css/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dist/public/css/"))
};

const fonts = () => {
    return gulp.src("./core/src/css/*.ttf").pipe(gulp.dest("./dist/public/css"))
}

const image = () => {
    return gulp.src("./core/src/imgs/**")
        .pipe(gulp.dest("./dist/public/imgs"))
}

const vendor = () => {
    return gulp.src("./core/src/vendor/**")
        .pipe(gulp.dest("./dist/public/vendor"))
}

const electronPipe = () => {
    return gulp.src("./electron/src/**")
        .pipe(gulp.dest("./dist/"))
}

const electron = () => {
    exec("npm start", (error, output) => {
        if (error) throw error;

        console.log(output);
    })
}


module.exports.default = gulp.parallel(vendor, fonts, js, html, css, image, gulp.series(electronPipe, electron));