let gulp = require("gulp");
let sass = require("gulp-sass");
let server = require("gulp-webserver");
let datas = require("./src/mock/data.json");
let url = require("url");
let fs = require("fs");
let path = require("path");

//监听sass
gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'));
});

//监听scss
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"))
})

//起服务
gulp.task('webserver', function() {
    gulp.src('src')
        .pipe(server({
            open: true,
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == "/favicon.ico") {
                    res.end("");
                    return
                } else if (pathname == '/api/list') {
                    let { pagenum, limit } = url.parse(req.url, true).query;
                    let totle = Math.ceil(datas.length / limit);
                    var start = (pagenum - 1) * limit;
                    var end = pagenum * limit;
                    var target = datas.slice(start, end);
                    res.end(JSON.stringify({ code: 0, data: target, totle }))

                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }));
});