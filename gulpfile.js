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
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == "/favicon.ico") {
                    res.end("");
                    return
                } else if (pathname == '/api/list') {
                    let { pagenum, limit, type, key } = url.parse(req.url, true).query;
                    var arr = [];
                    datas.forEach((i) => {
                        if (i.title.match(key) != null) {
                            arr.push(i)
                        }
                    })
                    var targetData = arr.slice(0);
                    if (type == "credit") {
                        targetData.sort(function(a, b) {
                            return a.credit - b.credit
                        })
                    } else if (type == "desc") {
                        targetData.sort(function(a, b) {
                            return b.money - a.money
                        })
                    } else if (type == "asc") {
                        targetData.sort(function(a, b) {
                            return a.money - b.money
                        })
                    }
                    var totle = Math.ceil(targetData.length / limit);
                    var start = (pagenum - 1) * limit,
                        end = pagenum * limit;
                    var target = targetData.slice(start, end);
                    console.log(target)
                    res.end(JSON.stringify({ code: 0, data: target, totle: totle }))

                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }));
});