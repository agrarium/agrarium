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

const bemxjst = require('gulp-bem-xjst');
const bemhtml = bemxjst.bemhtml;
const toHtml = bemxjst.toHtml;

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

const filter = (fn) => miss.through.obj(function (chunk, _, cb) {
    fn(chunk) && this.push(chunk);
    cb();
});

/**
 * Stream<> → (Stream<BemBundle>)
 */
function bundlifyResult(opts) {
    return miss.through.obj((data, _, cb) => {
        try {
            cb(null, new BemBundle({
                name: data.chunk.key,
                bemjson: data.chunk.data.bemjson
            }));
        } catch (e) {
            console.error(e);
            // this.emit(e);
            cb();
        }
    });
}

module.exports = function xjstBuilder({ levels, output }) {
    const builder = BundleBuilder({
        levels: Object.keys(levels),
        config: { levels },
        techMap: {
            bemhtml: ['bemhtml.js'],
            js: ['vanilla.js', 'browser.js', 'js'],
            css: ['post.css', 'css']
        }
    });

    /* → (Stream<BemBundle>) → gulpBuilder(config) → (Stream<Vinyl>) */
    return miss.pipeline.obj(bundlifyResult(), builder({
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
        ),
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
        tmpls: bundle => miss.pipe(
            bundle.src('bemhtml'),
            gconcat('any.bemhtml.js'),
            bemhtml({ elemJsInstances: true }),
            gconcat(bundle.name + '.bemhtml.js')
        ),
        html: (bundle) => miss.pipe(
            bundle.target('tmpls'),
            miss.through.obj((f, _, cb) => {
                const module = nodeEval(String(f.contents));
                cb(null, new File({
                    path: `${bundle.name}.html`,
                    contents: new Buffer(module.bemhtml.apply(bundle.bemjson))
                }));
            })
        )
    }), gdebug({ title: 'xjst:' }), gulp.dest(output));
}
