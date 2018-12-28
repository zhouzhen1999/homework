let gulp = require("gulp");
let sass = require("gulp-sass");
let server = require("gulp-webserver");
let datas = require("./src/mock/data.json");
let url = require("url");
let fs = require("fs");
let path = require("path");
let bCss = require("gulp-clean-css");
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //压缩js
//var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin'); //压缩html插件

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
})


gulp.task('bCss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(bCss())
        .pipe(gulp.dest('./build/css'))
})


//压缩js
// gulp.task('bUglify', function() {
//     return gulp.src(['./src/js/*.js', '!./src/libs/*.js'])
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         .pipe(uglify())
//         .pipe(gulp.dest('./build/js'))
// })


//压缩html

gulp.task('bHtmlmin', function() {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build'))
})

//线上环境
gulp.task('build', gulp.series('bUglify', 'bHtmlmin', 'bCss'))