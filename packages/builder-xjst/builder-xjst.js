const BundleBuilder = require('gulp-bem-bundle-builder');
const BemBundle = require('@bem/sdk.bundle');
const miss = require('mississippi');
const nodeEval = require('node-eval');
const File = require('vinyl');
const gulp = require('gulp');
const merge = require('merge2');
const gconcat = require('gulp-concat');
const gdebug = require('gulp-debug');
const gulpOneOf = require('gulp-one-of');
const uglify = require('gulp-uglify');

const gbemxjst = require('gulp-bem-xjst');
const bemhtml = gbemxjst.bemhtml;
// const toHtml = gbemxjst.toHtml;
const bemxjst = require('bem-xjst');

const pathToYm = require.resolve('ym');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postcssEach = require('postcss-each');
const postcssFor = require('postcss-for');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssCalc = require('postcss-calc');
const postcssNested = require('postcss-nested');
const rebemCss = require('rebem-css');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');
const csso = require('gulp-csso');

const streamFromArray = (a) => miss.from.obj((_, cb) => {
    if (!a.length) return cb(null, null);
    cb(null, a.shift());
});

const bbdebug = () => miss.through.obj(function (bundle, _, cb) {
    console.log('bundle: ', bundle.name, bundle.bemjson);
    cb(null, bundle);
});

const filter = (fn) => miss.through.obj(function (chunk, _, cb) {
    fn(chunk) && this.push(chunk);
    cb();
});

module.exports = function xjstBuilder({ src, output, i18n }) {
    const builder = BundleBuilder({
        levels: src,
        config: {
            levels: src.reduce((levels, curr) => {
                levels[curr] = {};
                return levels;
            }, {})
        },
        techMap: {
            bemhtml: ['bemhtml.js'],
            js: ['vanilla.js', 'browser.js', 'js'],
            css: ['post.css', 'css']
        }
    });

    /* → (Stream<BemBundle>) → gulpBuilder(config) → (Stream<Vinyl>) */
    return miss.pipeline.obj(builder({
        css: bundle => miss.pipe(
            bundle.src('css'),
            gulpOneOf(),
            postcss([
                postcssImport(),
                postcssEach,
                postcssFor,
                postcssSimpleVars(),
                postcssCalc(),
                postcssNested,
                rebemCss,
                postcssUrl({ url: 'rebase' }),
                autoprefixer(),
                postcssReporter()
            ]),
            gconcat(`${bundle.name}.css`)
            // gulpif(isProd, csso()),
        )
        .on('error', console.error),
        js: bundle => miss.pipe(
            merge(
                gulp.src(pathToYm),
                miss.pipe(
                    bundle.src('js'),
                    filter(f => ~['vanilla.js', 'browser.js', 'js'].indexOf(f.tech)),
                    // gdebug({ title: 'in.js:' }),
                ),
                miss.pipe(
                    bundle.src('js'),
                    filter(file => file.tech === 'bemhtml.js'),
                    gconcat('browser.bemhtml.js'),
                    bemhtml({ elemJsInstances: true })
                )
            ),
            gconcat(`${bundle.name}.js`)
            // .pipe(gulpif(isProd, uglify())),
        ),
        html: (bundle) => miss.pipe(
            bundle.src('bemhtml'),
            // bemhtml({ elemJsInstances: true }),
            miss.through.obj(function (f, _, cb) {
                this.files || (this.files = []);
                this.files.push(String(f.contents));
                cb();
            }, function(cb) {
                const templates = bemxjst.bemhtml.compile(this.files ? this.files.join('\n') : '',
                    { elemJsInstances: true });

                let html;
                try {
                    html = templates.apply(bundle.bemjson);
                } catch(e) {
                    html = 'Wa6loneziruete potehonku? ' + bundle.name + ' ' + e.stack;
                }

                this.push(new File({
                    path: `${bundle.name}.html`,
                    contents: new Buffer(html)
                }));
                cb();
            })
        )
    }),
        gdebug({ title: 'xjst:' }),
        gulp.dest(output))
    .on('data', () => {});
}
