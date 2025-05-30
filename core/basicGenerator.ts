import HbsGenerator from 'base-handlebars-generator';
import {globSync} from 'glob';
import { statSync, copyFileSync } from 'fs';
import { resolve, sep, dirname, join } from 'path';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
const debug = require('debug')('create-sa:BasicGenerator');
import * as until from 'scaffold-tool';

const { constants } = until.default;
const { DEFAULT_END_NAME, RAGEX_END_FILE } = constants;

function noop() {
  return true;
}

const { Generator }: { Generator:any } = HbsGenerator;

interface IContext {
  name: string;
  prompts: any;
  moduleName: string;
  packageName: string;
}

interface IBasicGenerator {
  baseDir: string;
  name: string;
  type: string;
  args: any;
  slient: boolean;
  path: string;
}

export class BasicGenerator extends Generator {
  opts: any;
  branch: string;
  
  constructor({ baseDir, name, type, args, slient, path }: IBasicGenerator) {
    super({baseDir, name, type, args, slient: true, templatePath: path});
    this.opts = {baseDir, name, type, args, slient};
    this.branch = this.opts?.args?.branch || 'master';

  }

  async writeFiles(params: { context: IContext; filterFiles?: (() => boolean) | undefined; }) {
    const { context, filterFiles = noop } = params;
    const { type } = this.opts;
    debug(`context: ${JSON.stringify(params.context)}`);
    const cwd = resolve(this.templatePath(), `${type}`).split(sep).join('/');
    const directoryPath = resolve(this.opts.baseDir,  context.moduleName);
    globSync('**/*', {
        cwd,
        dot: true,
      })
      .filter(filterFiles)
      .forEach((file: string) => {
        debug(`copy ${file}`);
        console.log(chalk.green('copy'), `:${file}`);
        const filePath = resolve(cwd, file);
        if (statSync(filePath).isFile() && file !== '.DS_Store') {
          const data = {
            ...context,
            packageName: context.packageName,
          }
          if (statSync(filePath).isDirectory()) {
            this.copyDirectory({
              context: data,
              path: filePath,
              target:directoryPath,
            });
          } else {
            if (filePath.endsWith(`${DEFAULT_END_NAME}`)) {
              this.copyTpl({                
                templatePath: filePath,
                target:join(directoryPath, file.replace(RAGEX_END_FILE, '')),
                context: data,
              });
            } else {
              const absTarget = resolve(directoryPath, file);
              fsExtra.mkdirpSync(dirname(absTarget));
              copyFileSync(filePath, absTarget);
            }
          }
        }
      });
  }
}
