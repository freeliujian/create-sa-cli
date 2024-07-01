
import { BasicGenerator } from '../../basicGenerator';
import { default as until } from 'scaffold-tool';
import { getNameByRepository } from '../getRepoName';
import { resolve } from 'path';


module.exports = class Generator extends BasicGenerator {
  props: {
    packageName: string;
    prompts: any,
    name: any,
    resolved: any,
    args: any,
    moduleName: string,
  };

  constructor(props: any) {
    const opt = {
      ...props,
      args: {
        branch: 'master',
        type: props.args.type,
      },
    }
    super(opt);
    this.props = props;
    const questions: any[] = [
      {
        type: 'text',
        name: 'repository',
        message: '请输入你的git仓库地址(eg:xxxx)'    
      },
      {
        type: 'number',
        name: 'envPort',
        default: '8000',
        message: '请输入的你端口号:（默认:8000)'
      },
      {
        type: 'multiselect',
        name: 'features', 
        message: '请选择你你要安装的模块',
        default: ["tailwind", "antd", "ahooks"],
        choices: [
          { name: 'tailwind', value: 'tailwind' },
          { name: "antd", value: "antd" }, 
          { name: 'ahooks', value: 'ahooks' },
        ]
      },
    ];
    this.props.prompts = questions;
  }

  prompting() {
    return this.props.prompts;
  }

  beforeWriting() {
    const { repository } = this.prompts;
    const { moduleName, packageName, name } = getNameByRepository(repository);
    this.props.name = name;
    this.props.moduleName = moduleName;
    this.props.packageName = packageName;
  }
  
  async writing() {
    const context = {
      ...this.props
    };
    await this.writeFiles({ context })
  }

  async afterWriting() {
    console.log('git init...');
    // await $`git init`;
    // await $`git add .`;
    // await $`git commit -m "Initial commit"`;
    // await $`git remote add origin ${this.prompts.repository}`;
    // await $`git push -u origin master`;
    const { $, cd } = until;
    try {
      const folderPath = resolve(this.baseDir, this.props.moduleName);
      cd(folderPath);
      await $`npm install`.then(res => {
        console.log(res.stderr,res.stdout);
      })
    } catch (err) {
      console.log(err);
    }
  }

  async end() {
  }
}


