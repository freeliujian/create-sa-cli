import { BasicGenerator } from '../../basicGenerator';

module.exports = class Generator extends BasicGenerator {
  props: {
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
        perfix: 'sa',
        branch: 'master',
        name: props.args.name,
        type: props.args.type,
      },
    }
    super(opt);
    this.props = props;
    const questions: any[] = [
    ];
    this.props.prompts = questions;
    this.props.moduleName = 'asd';
  }

  prompting() {
    return this.props.prompts;
  }

}

