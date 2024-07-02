# 介绍

一个可复用的脚手架工具

# 使用

```
create-sa
```

## base-handlebars-generator

一个基于 handlebars 和 prompts 的模板生成库

### 使用 BaseGenerator

可以自定义一个 baseGenerator 继承 Generator，也可以直接使用封装好的 `BaseGenerator`.

示例：

```js
import HbsGenerator from "base-handlebars-generator";

const { BaseGenerator } = HbsGenerator;

const option = {
  path: "./example/templates",
  target: "./example/target/path",
  data: {},
  questions: [
    {
      type: "number",
      name: "name",
      message: "请为你的项目命名",
    },
  ],
};

const baseG = new BaseGenerator(option);

const fn = {
  name: "includes",
  fn: (context, item, options) => {
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
};

baseG.helper(fn);
baseG.run();
```

#### option 配置

| 方法      | 描述                                          | 类型    | 默认值 |
| --------- | --------------------------------------------- | ------- | ------- |
| path      | 模板路径,必选                                 | string  | /       |
| target    | 生成路径，必选                                | string  |
| data      | 模板的变量，必选                              | {}any   | {}      |
| questions | prompts 集 https://github.com/terkelg/prompts | []any   | []      |
| slient    | 生成信息                                      | boolean | false   |

### Generator

| 方法              | 描述                                                     | 类型                                                                             | 默认值          | 示例使用                                                                                                                                                                                   |
| ----------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `constructor`     | 构造函数，初始化 `Generator` 实例。                      | `({ baseDir, args, slient, templatePath }: IGeneratorOpts)`                      | 无              | `const generator = new CustomGenerator({ baseDir: process.cwd(), args: {}, slient: false, templatePath: 'path/to/templates' }); `                                                          |
| `run`             | 运行生成器的主要流程，包括提示用户输入、执行文件操作等。 | `(): Promise<void>`                                                              | 无              | `await generator.run(); `                                                                                                                                                                  |
| `prompting`       | 返回一个用于提示用户输入的问题数组。                     | `(): any[]`                                                                      | `[]`            | `prompting() { return [{ type: 'text', name: 'projectName', message: '你的项目名称是什么？' }]; } `                                                                                        |
| `sourceRoot`      | 获取模板文件的根目录。                                   | `(): string`                                                                     | `'templates'`   | `const root = generator.sourceRoot(); `                                                                                                                                                    |
| `templatePath`    | 获取模板文件的完整路径。                                 | `(...paths: any[]): string`                                                      | 无              | `const path = generator.templatePath('template.hbs'); `                                                                                                                                    |
| `destinationRoot` | 获取或设置生成文件的目标根目录。                         | `(rootPath?: string): string`                                                    | `process.cwd()` | `const destRoot = generator.destinationRoot('output/path'); `                                                                                                                              |
| `writing`         | 在文件写入阶段执行的操作。                               | `(): Promise<void>`                                                              | 无              | `async writing() { this.copyTpl({ templatePath: this.templatePath('template.hbs'), target: this.destinationRoot('output.txt'), context: { projectName: this.prompts.projectName }, }); } ` |
| `afterWriting`    | 在文件写入后执行的操作。                                 | `(): Promise<void>`                                                              | 无              | `async afterWriting() { console.log('文件已成功生成。'); } `                                                                                                                               |
| `beforeWriting`   | 在文件写入前执行的操作。                                 | `(): Promise<void>`                                                              | 无              | `async beforeWriting() { console.log('准备写入文件...'); } `                                                                                                                               |
| `end`             | 在生成器运行结束时执行的操作。                           | `(): Promise<void>`                                                              | 无              | `async end() { console.log('生成器运行结束。'); } `                                                                                                                                        |
| `helper`          | 注册 Handlebars 的帮助函数。                             | `({ name, fn }: { name: string, fn: Handlebars.HelperDelegate }): Promise<void>` | 无              | `await this.helper({ name: 'upperCase', fn: (str: string) => str.toUpperCase() }); `                                                                                                       |
| `copyTpl`         | 复制并转换模板文件。                                     | `({ templatePath, target, context }: IGeneratorCopyTplOpts): void`               | 无              | `this.copyTpl({ templatePath: this.templatePath('template.hbs'), target: this.destinationRoot('output.txt'), context: { projectName: this.prompts.projectName }, }); `                     |
| `copyDirectory`   | 复制目录及其内容。                                       | `({ path, target, context }: IGeneratorCopyDirectoryOpts): void`                 | 无              | `this.copyDirectory({ path: this.templatePath('directory'), target: this.destinationRoot('output-directory'), context: { projectName: this.prompts.projectName }, }); `                    |

run 函数执行后， 中间的执行动作，按照 `runBefore ==> beforeWriting ==> writing ==> afterWriting ==> end` 顺序执行.

## scaffold-tool

函数的主要功能包括简单的管理用户的 Git 配置、处理模板目录、执行系统命令以及与 GitHub API 交互。

| 函数名               | 功能描述                    | 参数                                                         | 返回值                | 默认值                      | 类型                                                                            | 示例使用                                                                                                    |
| -------------------- | --------------------------- | ------------------------------------------------------------ | --------------------- | --------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `getSADir`           | 获取用户的.sad 目录路径     | 无                                                           | `string`              | 无                          | `(): string`                                                                    | `const saDir = getSADir();`                                                                                 |
| `setGitUser`         | 设置 Git 用户               | `user: string`                                               | `Promise<void>`       | 无                          | `(user: string) => Promise<void>`                                               | `await setGitUser("your-git-username");`                                                                    |
| `createSATemplates`  | 创建 SA 模板目录            | 无                                                           | `Promise<string>`     | 无                          | `(): Promise<string>`                                                           | `const templatesDir = await createSATemplates();`                                                           |
| `removeSATemplates`  | 删除 SA 模板目录            | `basicUserPath: string, silent?: boolean`                    | `Promise<void>`       | `silent = false`            | `(basicUserPath: string, silent?: boolean) => Promise<void>`                    | `await removeSATemplates("/path/to/dir", true);`                                                            |
| `gitEmail`           | 设置 Git 邮箱               | `email: string, isGlobal?: boolean`                          | `Promise<void>`       | `isGlobal = true`           | `(email: string, isGlobal?: boolean) => Promise<void>`                          | `await gitEmail("your-email@example.com");`                                                                 |
| `setGitName`         | 设置 Git 用户名             | `name: string, isGlobal?: boolean`                           | `Promise<void>`       | `isGlobal = true`           | `(name: string, isGlobal?: boolean) => Promise<void>`                           | `await setGitName("your-git-name");`                                                                        |
| `gitCloneTemplates`  | 克隆 Git 仓库模板           | `repoUrl: string, basicUserPath: string, targetDir?: string` | `Promise<void>`       | `targetDir = basicUserPath` | `(repoUrl: string, basicUserPath: string, targetDir?: string) => Promise<void>` | `await gitCloneTemplates("https://github.com/repo.git", "/path/to/dir");`                                   |
| `getRepoTemplates`   | 获取并克隆多个 Git 仓库模板 | `url: string \| string[], basicUserPath: string`             | `Promise<void>`       | 无                          | `(url: string \| string[], basicUserPath: string) => Promise<void>`             | `await getRepoTemplates(["https://github.com/repo1.git", "https://github.com/repo2.git"], "/path/to/dir");` |
| `rmGitFolders`       | 删除克隆模板中的.git 目录   | `basicUserPath: string`                                      | `Promise<void>`       | 无                          | `(basicUserPath: string) => Promise<void>`                                      | `await rmGitFolders("/path/to/dir");`                                                                       |
| `rmDirRecursiveSync` | 递归删除目录及其内容        | `dir: string`                                                | `void`                | 无                          | `(dir: string) => void`                                                         | `rmDirRecursiveSync("/path/to/dir");`                                                                       |
| `install`            | 安装依赖包                  | 无                                                           | `Promise<void>`       | 无                          | `(): Promise<void>`                                                             | `await install();`                                                                                          |
| `updateRepo`         | 更新仓库                    | `cliPath: string`                                            | `Promise<void>`       | 无                          | `(cliPath: string) => Promise<void>`                                            | `await updateRepo("/path/to/cli");`                                                                         |
| `getUserRepoList`    | 获取 Git 用户的仓库列表     | `user: string, filter?: (item: any) => boolean`              | `Promise<any[]>`      | `filter = () => true`       | `(user: string, filter?: (item: any) => boolean) => Promise<any[]>`             | `const repos = await getUserRepoList("your-git-username");`                                                 |
| `cd`                 | 切换目录                    | `dir: string`                                                | `void`                | 无                          | `(dir: string) => void`                                                         | `cd("/path/to/dir");`                                                                                       |
| `$`                  | 执行命令                    | `pieces: TemplateStringsArray, ...args: any[]`               | `Promise<ExecResult>` | 无                          | `(pieces: TemplateStringsArray, ...args: any[]) => Promise<ExecResult>`         | `const result = await $`ls -al`;`                                                                           |
