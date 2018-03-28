const { join } = require('path');
const { execSync } = require('child_process');

const { readFileSync, removeSync } = require('fs-extra');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const { expect } = chai;

const fixturesCwd = join(process.cwd(), 'test', 'fixtures');
const fixturesCwdFlag = ['-d', fixturesCwd];
const parseOutput = (str) => {
    const parts = str.split('\n');
    parts.pop();
    return parts;
};
const run = (...args) => parseOutput(execSync(`bin/run ${args.join(' ')}`).toString());
const objectify = (jsonStr) => jsonStr.map(chunk => JSON.parse(chunk));

describe('Agrarium: CLI', () => {

    describe('command: harvest', () => {

        it('loads default config', () => {
            const stdOut = run(
                'harvest',
                ...fixturesCwdFlag,
            );

            expect(objectify(stdOut)[0]).to.containSubset({
                component: {
                    key: 'c1',
                    config: {},
                    data: {},
                    files: [],
                },
                context: {},
            });
        });

        it('loads config from custom path', () => {
            const stdOut = run(
                'harvest',
                '-c', join('agrarium', 'customConfigPath.js'),
                ...fixturesCwdFlag,
            );

            expect(objectify(stdOut)[0]).to.containSubset({
                component: {
                    key: 'c2',
                },
            });
        });

        it('loads a few configs', () => {
            const stdOut = run(
                'harvest',
                '-c', join('agrarium', 'customConfigPath.js'),
                '-c', '.agrarium.js',
                ...fixturesCwdFlag,
            );

            expect(objectify(stdOut)).to.containSubset([{
                component: { key: 'c1' },
            }, {
                component: { key: 'c2' },
            }]);
        });

        it('applies transform function on chunks', () => {
            const stdOut = run(
                'harvest',
                '-c', join('agrarium', 'applyTransform.js'),
                '-c', '.agrarium.js',
                ...fixturesCwdFlag,
            );

            expect(objectify(stdOut)).to.containSubset([{
                component: { key: 'c1' },
                myDinDinDon: undefined, // only for chunks with transform function in configs
            }, {
                component: { key: 'c2' },
                myDinDinDon: true,
            }]);
        });

        it('passes flatten and unique plugins', () => {
            const stdOut = run(
                'harvest',
                ...fixturesCwdFlag,
            );

            expect(objectify(stdOut)[0]).to.containSubset({
                component: {
                    key: 'c1',
                    data: {
                        instance1: undefined,
                        instance2: undefined,
                        instance3: true,
                    },
                },
            });
        });

        it('runs worker on chunks', () => {
            const stdOut = run(
                'harvest',
                '--concurently', 'worker.js',
                '--silent',
                ...fixturesCwdFlag,
            );

            expect(stdOut).to.eql(['c1']);
        });

        describe('Output to file:', () => {
            const outputFilePath = join(fixturesCwd, './output');

            afterEach(() => {
                removeSync(outputFilePath);
            });

            it('writes plain text', () => {
                run('harvest', '-o', './output', ...fixturesCwdFlag);

                const stdOut = parseOutput(readFileSync(outputFilePath, 'utf8'));

                expect(objectify(stdOut)[0]).to.containSubset({
                    component: {
                        key: 'c1',
                        data: {},
                    },
                });
            });

            it('writes JSON', () => {
                run(
                    'harvest',
                    '-o', './output',
                    '--json',
                    '-c', join('agrarium', 'customConfigPath.js'),
                    '-c', '.agrarium.js',
                    ...fixturesCwdFlag,
                );

                const stdOut = JSON.parse(readFileSync(outputFilePath, 'utf8'));

                expect(stdOut).to.containSubset([{
                    component: { key: 'c1' },
                }, {
                    component: { key: 'c2' },
                }]);
            });

            it('runs flush for result', () => {
                run(
                    'harvest',
                    '-o', './output',
                    '--json',
                    '--flush', 'flush.js',
                    ...fixturesCwdFlag,
                );

                const stdOut = JSON.parse(readFileSync(outputFilePath, 'utf8'));

                expect(stdOut).to.containSubset([{
                    component: { key: 'c1' },
                }, 'hihi']);
            });

        });

    });

});
