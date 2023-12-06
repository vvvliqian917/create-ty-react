const chalk = require('chalk');
export function log(...args: any[]) {
    console.log(`${chalk.gray('>')}`, ...args);
  }
  
  export function getArgs(): Record<string, string | boolean>{
    const args = process.argv.slice(2);
    const argsMap = {};
    args.forEach((item, index) => {
      if (item.startsWith('--')) {
        const [key,value]=item.slice(2).split('=');
        argsMap[key] = value || true;
      }
    });
    return argsMap;
  }