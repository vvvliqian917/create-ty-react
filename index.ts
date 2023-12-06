#!/usr/bin/env node

import inquirer from "inquirer";
const chalk = require('chalk');
import { templateConfigMap } from "./config";
import { getArgs } from "./util";
const fs = require('fs');
const path = require('path');
const { resolve } = path;
const cwd = process.cwd();
const packageJsonPath = resolve(cwd, './package.json');
const packageJson = require(packageJsonPath);
const child_process = require("child_process");


const { execSync } = child_process;

const argsMap = getArgs();

// 获取用户参数
function prompt(): Promise<Record<string, string>> {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称'
        },
        {
            type: 'list',
            name: 'template',
            message: '请选择模版类型',
            choices: ['react-mobile', 'react-qiankun'],
        }
    ]).then(anwsers => {
        return anwsers;
    })
}

function clone(gitArgs) {
    // 记录git clone 进度
    console.log('clone start');
    execSync(
        `git ${gitArgs.join(' ')}`,
        {
            stdio: 'inherit',
        }
    );
    console.log('🚚 clone success');

}

async function writing() {
    const anwsers = await prompt();
    const { projectName, template } = anwsers;
    const { gitUrl } = templateConfigMap[template] || {};
    const gitArgs = [`clone`, gitUrl, `--depth=1`, `--branch=dev`,projectName];
    const projectPath = path.resolve(projectName);
    const isForce = argsMap['force'];

    const dirExistedinCurrentPath = fs.readdirSync(cwd).includes(projectName) && fs.readdirSync(projectPath).length > 0;
    if (!dirExistedinCurrentPath) {
       
        clone(gitArgs);
        process.exit(0);
    } else if (!isForce) {
        console.log(`🙈 ${projectName} 文件下存在内容，请在空文件夹中使用，或者使用 ${chalk.red(`yarn ${packageJson.name} --force`)} 强制覆盖`);
        process.exit(1);
    }

    // 备份项目
    const tempDir = `.${projectName}_bak`
   
    execSync(`mv ${projectName} ${tempDir}`);
   try {
    clone(gitArgs);
    execSync(`rm -rf ${tempDir}`)
   } catch (error) {
    console.log( `🙈  ${chalk.red(`git error`)}`,error);
    execSync(`mv ${tempDir}/* ${projectName} && rm -rf ${tempDir}`);
   }

}

writing();



