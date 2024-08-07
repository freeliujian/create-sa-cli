#!/usr/bin/env node

const program = require('commander');
const semver = require('semver');
const yParser = require('yargs-parser');
const run = require('../dist/cjs/run').default;

program.version(require('../package.json').version);

program.parse(process.argv);

if (!semver.satisfies(process.version, '>= 20.12.2')) {
    console.error(chalk.red("node 版本至少要大于20.12.2!"));
    process.exit(1);
}

const args = yParser(process.argv.slice(2));
const name = args._[0] || '';
const { type } = args;
delete args.type;

(async () => {
    await run({
        name,
        type,
        args,
        cwd:process.cwd()
    });
    process.exit(0);
})();

