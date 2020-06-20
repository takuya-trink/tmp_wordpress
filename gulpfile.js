// Gulpの設定ファイル



// プラグインの読み込み
// ------------------------------

// 画像を便利に取り扱いできる機能
const assets = require('postcss-assets');

// CSSのベンダープレフィックスを自動付与
const autoprefixer = require('autoprefixer');

// JavaScriptのコードを変換 (ES6 -> ES5)
const babel = require('gulp-babel');

// ブラウザ自動更新
const browserSync = require('browser-sync');

// CSSを最小化する
const clean = require('postcss-clean');

// CSSやJavaScriptで複数の分割ファイルを結合する
const concat = require('gulp-concat');

// ファイル削除
const del = require('del');

// JavaScriptの構文チェック
const eslint = require('gulp-eslint');

// FlexBoxのバグを防ぐ
const flexBugsFixes = require('postcss-flexbugs-fixes');

// Gulp(タスクランナー)
const gulp = require('gulp');

// HTMLの構文チェック
const htmlhint = require('gulp-htmlhint');

// Gulpで処理したファイルの先頭に文字列を挿入
// CSSの先頭にcharsetを記述したり、JavaScriptの先頭にライセンスを挿入
const header = require('gulp-header');

// 画像圧縮
const imagemin = require('gulp-imagemin');

// JPEGファイルの圧縮(高画質・高圧縮)
const mozjpeg = require('imagemin-mozjpeg');

// タスク実行中のエラー時に通知を出す
const notify = require('gulp-notify');

// 順序の制御
const order = require('gulp-order');

// タスク実行中のエラー時にGulpを終了させない
const plumber = require('gulp-plumber');

// PNGファイルの圧縮(高画質・高圧縮)
const pngquant = require('imagemin-pngquant');

// 多様なCSSプラグインの後処理（ポストプロセッサー）
const postcss = require('gulp-postcss');

// HTMLを整形する
const prettify = require('gulp-prettify');

// リネームの処理
const rename = require('gulp-rename');

// 置き換え
const replace = require('gulp-replace');

// Sass
const sass = require('gulp-sass');

// Sassの構文チェック
const scsslint = require('gulp-scss-lint');

// SCCのプロパティ順序をソートする
const sorting = require('postcss-sorting');

// JavaScriptを最小化する
const uglify = require('gulp-uglify');

// 今回は入れない
// const connect = require('gulp-connect-php')



// パスの設定
// ------------------------------

// WordPressのテーマ
const wpTheme = 'wpThemeName'

// ポート設定
const port = 8000


// HTML,PHP,CSS,Javascriptファイルのディレクトリ設定
const paths = {
    root: './tmp',
    html: {
        src: './tmp/html/**/*.html',
        dest: './public/wp-content/themes/' + wpTheme +'/',
    },
    php: {
        src: './tmp/php/**/*.php',
        dest: './public/wp-content/themes/' + wpTheme +'/',
    },
    styles: {
        src: './tmp/sass/**/*.scss',
        dest: './public/wp-content/themes/' + wpTheme +'/',
        map: './public/wp-content/themes/' + wpTheme +'/maps',
    },
    scripts: {
        src: './tmp/js/**/*.js',
        jsx: './tmp/js/**/*.jsx',
        dest: './public/wp-content/themes/' + wpTheme +'/js',
        map: './public/wp-content/themes/' + wpTheme +'/js/maps',
        core: 'tmp/js/core/**/*.js',
        app: 'tmp/js/app/**/*.js',
    },
    images: {
        src: './tmp/img/**/*.{jpg,jpeg,png,svg,gif}',
        dest: './public/wp-content/themes/' + wpTheme +'/images/',
    },
};


// CSS関連の設定
// ------------------------------

// autoprefixerでGridレイアウト時にもベンダープレフィックスを付与するための設定
const autoprefixerOption = {
    grid: true,
};
// CSSのプロパティ等のソート順設定ファイルを参照
const sortingOptions = require('./postcss-sorting.json');
const postcssOption = [
    assets({
        baseUrl: '/',
        basePath: 'tmp/',
        loadPaths: ['img/'],
        cachebuster: true,
    }),
    flexBugsFixes,
    autoprefixer(autoprefixerOption),
    sorting(sortingOptions),
];



// HTMLの整形・出力設定
// ------------------------------

function html() {
    return gulp
        .src(paths.html.src, { since: gulp.lastRun(html) })
        .pipe(
            prettify({
                indent_char: ' ',
                indent_size: 2,
                unformatted: ['a', 'span', 'br'],
            }),
        )
        .pipe(gulp.dest(paths.html.dest));
}



// PHPの出力設定
// ------------------------------

function php() {
    return gulp
        .src(paths.php.src, { since: gulp.lastRun(php) })
        .pipe(gulp.dest(paths.php.dest));
}



// Sassコンパイル(非圧縮)
// ------------------------------

function styles() {
    return gulp
        .src(paths.styles.src, { sourcemaps: true })
        .pipe(
            plumber({
                errorHandler: notify.onError('<%= error.message %>'),
            }),
        )
        .pipe(
            sass({
                outputStyle: 'expanded',
            }),
        )
        .pipe(replace(/@charset "UTF-8";/g, ''))
        .pipe(header('@charset "UTF-8";\n\n'))
        .pipe(postcss(postcssOption))
        .pipe(gulp.dest(paths.styles.dest, { sourcemaps: './maps' }));
}

// Sassコンパイル（圧縮）
// ------------------------------

function sassCompress() {
    return gulp
        .src(paths.styles.src)
        .pipe(
            plumber({
                errorHandler: notify.onError('<%= error.message %>'),
            }),
        )
        .pipe(
            sass({
                outputStyle: 'compressed',
            }),
        )
        .pipe(replace(/@charset "UTF-8";/g, ''))
        .pipe(header('@charset "UTF-8";\n\n'))
        .pipe(postcss(postcssOption, [clean()]))
        .pipe(gulp.dest(paths.styles.dest));
}



// JSコンパイル
// ------------------------------

function scripts() {
    return gulp
        .src(paths.scripts.src, { sourcemaps: true })
        .pipe(order([paths.scripts.core, paths.scripts.app], { base: './' }))
        .pipe(
            babel({
                presets: ['@babel/env'],
            }),
        )
        .pipe(plumber())
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min',
            }),
        )
        .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: './maps' }));
}



// 画像最適化
// ------------------------------

const imageminOption = [
    pngquant({
        quality: [0.7, 0.85],
    }),
    mozjpeg({
        quality: 85,
    }),
    imagemin.gifsicle(),
    imagemin.mozjpeg(),
    imagemin.optipng(),
    imagemin.svgo({
        removeViewBox: false,
    }),
];

function images() {
    return gulp
        .src(paths.images.src, {
            since: gulp.lastRun(images),
        })
        .pipe(imagemin(imageminOption))
        .pipe(gulp.dest(paths.images.dest));
}



// マップファイル除去
// ------------------------------

function cleanMapFiles() {
    return del([paths.styles.map, paths.scripts.map]);
}

// ===Lint Tasks===
// HTML Lint
function htmlLint() {
    return gulp
        .src(paths.html.src)
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
}
// SASS Lint
function sassLint() {
    return gulp.src(paths.styles.src).pipe(
        scsslint({
            config: 'scss-lint.yml',
        }),
    );
}
// ESLint
function esLint() {
    return gulp
        .src([paths.scripts.src, paths.scripts.jsx, '!./tmp/js/core/**/*.js'])
        .pipe(
            eslint({
                useEslintrc: true,
                fix: true,
            }),
        )
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}



// ブラウザ更新の処理
// ------------------------------

const browserSyncOption = {
    port: port,
    server: {
        baseDir: './public/',
        index: 'index.php',
    },
    reloadOnRestart: true,
};

function browsersync(done) {
    browserSync.init(browserSyncOption);
    done();
}

// ウォッチタスクの処理
// ------------------------------

function watchFiles(done) {
    const browserReload = () => {
        browserSync.reload();
        done();
    };
    gulp.watch(paths.styles.src).on('change', gulp.series(styles, browserReload));
    gulp.watch(paths.scripts.src).on('change', gulp.series(scripts, esLint, browserReload));
    gulp.watch(paths.html.src).on('change', gulp.series(html, browserReload));
    gulp.watch(paths.php.src).on('change', gulp.series(php, browserReload));
}

// タスクの設定
//
// ターミナル で下記のコマンドを入力して各タスクを実行
// npx gulp [task_name]
// ------------------------------

gulp.task('default', gulp.series(gulp.parallel(scripts, styles, html, php), gulp.series(browsersync, watchFiles)));

gulp.task('clean', cleanMapFiles);
gulp.task('imagemin', images);
gulp.task('sass-compress', sassCompress);
gulp.task('build', gulp.series(gulp.parallel(scripts, 'imagemin', 'sass-compress', html, php), 'clean'));
gulp.task('eslint', esLint);
gulp.task('html-lint', htmlLint);
gulp.task('sass-lint', sassLint);
gulp.task('test', gulp.series(sassLint, esLint, htmlLint));