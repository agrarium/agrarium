const countryman = require('.');
const miss = require('mississippi');
const BundleBuilder = require('gulp-bem-bundle-builder');
const BemBundle = require('@bem/sdk.bundle');

/* Для сборки */
const filter = (fn) => miss.through.obj(function (chunk, _, cb) {
    fn(chunk) && this.push(chunk);
    cb();
});

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
/* /Для сборки */

const ComponentsCollector = require('./plugins/countryman-components-collector');
const JSDoc = require('./plugins/countryman-jsdoc');
const Bemjson = require('./plugins/countryman-bemjson');

const builder = BundleBuilder({
    levels: [
        'node_modules/bem-core/common.blocks',
        'node_modules/bem-core/desktop.blocks',
        'node_modules/bem-components/common.blocks',
        'node_modules/bem-components/desktop.blocks',
        'node_modules/bem-components/design/common.blocks',
        'node_modules/bem-components/design/desktop.blocks',
    ],
    config: {
        levels: {
            'node_modules/bem-core/common.blocks': {},
            'node_modules/bem-core/desktop.blocks': {},
            'node_modules/bem-components/common.blocks': {},
            'node_modules/bem-components/desktop.blocks': {},
            'node_modules/bem-components/design/common.blocks': {},
            'node_modules/bem-components/design/desktop.blocks': {},
        }
    },
    techMap: {
        bemhtml: ['bemhtml.js'],
        js: ['vanilla.js', 'browser.js', 'js'],
        css: ['post.css', 'css']
    }
});

function transformToWebsite() {
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
    }));
}

countryman({
    src: {
        'node_modules/bem-components/common.blocks': {},
        'node_modules/bem-components/touch.blocks': {},
        'node_modules/bem-components/desktop.blocks': {},
        'node_modules/bem-components/design/common.blocks': {},
        'node_modules/bem-components/design/desktop.blocks': {},
    },
    plugins: [
        new ComponentsCollector(/* settings */),
        new JSDoc(/* settings */),
        new Bemjson(/* settings */)
    ]
})
    .on('error', console.error)
    // .pipe(miss.through.obj(function (data, _, cb) {
    //     if (process.env.FILTER) {
    //         process.env.FILTER === data.chunk.key && this.push(data);
    //         cb();
    //         return;
    //     };
    //     cb(null, data);
    // }))
    // .on('data', ({ chunk, context, result }) => console.log(chunk.key, chunk.data, Object.assign({}, context, {components: undefined})))
    // .pipe(bundlifyResult())
    // .on('data', console.log)
    /* → (Stream<BemBundle>) → gulpBuilder(config) → (Stream<Vinyl>) */
    .pipe(transformToWebsite())
    .pipe(gdebug({ title: 'out:' }))
    .pipe(gulp.dest('./out'))
    .on('error', console.error);

/**
 * Stream<> → (Stream<BemBundle>)
 */
function bundlifyResult(opts) {
    return miss.through.obj((data, _, cb) => {
        console.log('???????', data.chunk.data);
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
