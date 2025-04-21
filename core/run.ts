import fs from 'fs';
import chalk from 'chalk';
import {sync as mkdirpSync} from 'mkdirp';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import os from 'node:os';
import { resolve, join } from 'path';
import scaffold from 'scaffold-tool';


const { CreateScaffold, rmDirRecursiveSync, constants } = scaffold;
const { DEFAULT_END_NAME } = constants;


const cliPath = resolve(__dirname, '../../');
const userRootDir = os.homedir();
const SADir = resolve(userRootDir, `${DEFAULT_END_NAME}/.templates`);

interface GeneratorMeta {
  meta: {
    description: string;
    baseUrl?: string;
  }
}


interface GeneratorChoice {
  name: string;
  value: string;
  short: string;
}

interface RunGeneratorOptions {
  name?: string;
  cwd?: string;
  args?: Record<string, any>;
  type: any;
}

const getGeneratorArray = () => fs
.readdirSync(`${SADir}`)
.filter((f) => !f.startsWith('.'))
.map((f) => {
  const generatorMetaPath = resolve(cliPath, `./dist/cjs/appMap/${f}/meta.js`);
  const meta: GeneratorMeta = require(generatorMetaPath);
  return {
    name: `${f.padEnd(15)} - ${chalk.gray(meta.meta.description)}`,
    value: f,
    short: f,
  };
});

const runGenerator = async (generatorPath: string, { name = '', cwd = process.cwd(), args = {}, type= '' }: RunGeneratorOptions) => {
  if (name) {
    mkdirpSync(name);
    cwd = join(cwd, name);
  }
  const Generator = require(`${generatorPath}`);
  const generator = new Generator({
    type,
    args: {
      ...args,
      type,
    },
    baseDir: resolve(cwd),
    path: SADir
  }); 

  await generator.run();
  if (name) {
    if (process.platform !== 'linux' || process.env.DISPLAY) {
      clipboardy.writeSync(`cd ${name}`);
      console.log('📋 Copied to clipboard, just use Ctrl+V');
    }

  }
  console.log('✨ File Generate Done'); 
};


const run = async (config: any): Promise<void> => {
  let generatorPath = '';
  if (process.send) {
    process.send({ type: 'prompt' });
  }
  (process as any).emit('message', { type: 'prompt' });

  const opt = {
    gitUser: config.name || 'freeliujian',
  };
  
  if (fs.existsSync(SADir)) {
    rmDirRecursiveSync(SADir);
  } else {
    console.log("not have templates folder");
  }
  const BI = new CreateScaffold(opt);
  const meta = await BI.getUserRepoList();
  const metaUrl = meta.map((item:any) => {
    return item.url
  })
  await BI.getRepoTemplates(metaUrl);

  let generators: GeneratorChoice[] = [];
  generators = getGeneratorArray();

  if (process.cwd() !== config.cwd) {
    process.chdir(config.cwd);
  }

  if (!config?.type) {
    const answers = await inquirer.prompt([
      {
        name: 'type',
        message: '选择你要使用的模块',
        type: 'list',
        choices: generators,
      },
    ]);
    config.type = answers.type;
    generatorPath = resolve(cliPath, `./dist/cjs/appMap/${config.type}`);
  }

  try {
    await runGenerator(generatorPath, config);
  } catch (e) {
    console.error(chalk.red('> 模板创建失败'), e);
    process.exit(1);
  }
};

export default run;