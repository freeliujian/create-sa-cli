
import { BasicGenerator } from '../../basicGenerator';
// import { default as until } from 'scaffold-tool';
import { getNameByRepository } from '../getRepoName';
// import { resolve } from 'path';


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
        type: 'checkbox',
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

    this.helper({
      name: 'includes',
      fn: (context: any, item: any, options: any) => {
        console.log(context, 'context');
        if (context) {
          if (context.includes(item)) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        } else {
          return " ";
        }
      },
    });
  }

  prompting() {
    return this.props.prompts;
  }  

  beforeWriting() {
    const { repository } = this.prompts;
    const { moduleName, packageName, name } = getNameByRepository(repository);
    this.prompts.name = name;
    this.prompts.moduleName = moduleName;
    this.prompts.packageName = packageName;
  }
  
  async writing() {
    const context = {
      ...this.prompts
    };
    console.log(context);
    await this.writeFiles({ context })
  }

  async afterWriting() {
    console.log('git init...');
    // const { $ } = until;
    // await $`git init`;
    // await $`git add .`;
    // await $`git commit -m "Initial commit"`;
    // await $`git remote add origin ${this.prompts.repository}`;
    // await $`git push -u origin master`;
  
  }

  async end() {
    console.log('npm install...');
    // const { $, cd } = until;
    // try {
    //   const folderPath = resolve(this.baseDir, this.prompts.moduleName);
    //   cd(folderPath);
    //   await $`npm install`.then(res => {
    //     console.log(res.stderr,res.stdout);
    //   })
    // } catch (err) {
    //   console.log(err);
    // }
  }
}


