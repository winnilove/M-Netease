// const gulp = require("gulp")
const {src, dest,series,parallel,watch} = require("gulp")
const gulpWebserver = require('gulp-webserver')
//打包的
const webpackStream = require('webpack-stream')
//babal解析语法糖的
//nodejs的一个方法
const path = require("path")
const gulpSass = require('gulp-sass')
const proxy = require('http-proxy-middleware')
const del = require('del')

// gulp.task('copyhtml',(cb)=>{
//     gulp.src('./index.html')
//     .pipe(gulp.dest('./dev/'))
//     cb()
// })

function copyhtml(){
    return src('./*.html')
    .pipe(dest('./dev/'))
}

function copylibs(){
    return src('./src/libs/**/*')
    .pipe(dest('./dev/libs'))
}
function copyimages(){
    return src('./src/images/**/*')
    .pipe(dest('./dev/images'))
}
function copyicons(){
    return src('./src/icons/**/*')
    .pipe(dest('./dev/icons'))
}
/*
// gulp.task('webserver',()=>{
//     return gulp.src('./dev/')
//     .pipe(webserver({
//         port : 8000,
//         livereload : true
//     }))
// })
*/
function packCSS(){
    return src('./src/styles/app.scss')
    .pipe(gulpSass().on('error',gulpSass.logError))
    .pipe(dest('./dev/styles'))
}
function clear(target) {
    return function() {
      return del(target)
    }
  }

function webserver(){
    return src("./dev")
    .pipe(gulpWebserver({
        port:8989,
        livereload:true,
        middleware : [
            // proxy('/api',{
            //     target:'http://m.you.163.com/',
            //     changeOrigin : true,
            //     pathRewrite : {
            //         '^/api' : ''
            //     }
            // })
            proxy('/api',{
                target:'http://localhost:3000',
                changeOrigin : true,
            })
        ]
    }))
}

function packjs(){
    return src('./src/**/*')
    .pipe(webpackStream({
        mode : 'development',
        entry : {
            app:'./src/app.js'
        },
        output : {
            filename : '[name].js',
            path:path.resolve(__dirname,'./dev')
        },
        module : {
            rules : [
                {
                    test : /\.js$/,
                    exclude : /node_modules/,
                    use:{
                        loader : 'babel-loader',
                        options:{
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                },
                {
                    test:/\.html$/,
                    loader : 'string-loader'
                }
            ]
        }
    }))
    .pipe(dest('./dev/scripts'))
}
//__dirname 是当前打开的文件的目录

function watcher() {
    watch('./src/libs/**/*', series(clear('./dev/libs'), copylibs))
    watch('./src/images/**/*', series(clear('./dev/images'), copyimages))
    watch('./src/icons/**/*', series(clear('./dev/icons'), copyicons))
    watch('./*.html', series(clear('./dev/*.html'), copyhtml))
    watch('./src/styles/**/*', series(packCSS))
    watch(['./src/**/*', '!src/libs/**/*', '!src/icons/**/*', '!src/images/**/*', '!src/styles/**/*'], series(packjs))
  }
  
// gulp.task('default',gulp.series('copyhtml'))
//commonjs规范
  exports.default = series(parallel(packCSS, packjs, copylibs, copyimages, copyicons), copyhtml, webserver, watcher)