'use strict';
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
// const download = require('download-git-repo');
const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);
const _exit = process.exit;
const spawn = require('child_process').spawn;
const ora = require('ora');
let spinner;

/**
 * Graceful exit for async STDIO
 */
function exit(code) {
    var draining = 0;
    var streams = [process.stdout, process.stderr];
    // flush output for Node.js Windows pipe bug
    // https://github.com/joyent/node/issues/6247 is just one bug example
    // https://github.com/visionmedia/mocha/issues/333 has a good discussion
    function done() {
        if (!(draining--)) _exit(code);
    }
    exit.exited = true;

    streams.forEach(function(stream) {
        // submit empty write request and wait for completion
        draining += 1;
        stream.write('', done);
    });

    done();
}

// Re-assign process.exit because of commander
// TODO: Switch to a different command framework
process.exit = exit;

/**
 * Check if the given directory `path` is empty.
 * @param {String} path
 * @param {Function} fn
 */
function emptyDirectory(path) {
    return function(callback) {
        fs.readdir(path, function(err, files) {
            if (err && err.code !== 'ENOENT') {
                callback(err);
            } else {
                callback(null, !files || !files.length);
            }
        });
    };
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 * @param {String} pathName
 */

function createAppName(pathName) {
    return path.basename(pathName)
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
    return process.platform === 'win32' && process.env._ === undefined;
}

/**
 * echo str > path.
 * @param {String} path
 * @param {String} str
 */
function write(path, str, mode) {
    fs.writeFileSync(path, str, {
        mode: mode || MODE_0666
    });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Copy file from template directory.
 */

function copyTemplate(from, to) {
    from = path.join(__dirname, '..', 'project', from);
    write(to, fs.readFileSync(from, 'utf-8'));
}

/**
 * Mkdir -p.
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
    mkdirp(path, MODE_0755, function(err) {
        if (err) throw err;
        console.log('   \x1b[36mcreate\x1b[0m : ' + path);
        fn && fn();
    });
}

/**
 * Create application at the given directory `path`.
 * @param {String} dir
 * @param {String} inputFolder 输入文件夹
 * @param {String} outputFolder 输出文件夹
 */
function createApplication(name, dir, inputFolder, outputFolder) {
    console.log(chalk.cyan('\n Start generating...'));
    let wait = 4;
    let input = `${dir}/${inputFolder}`,
        output = `${dir}/${outputFolder}`;
    /**
     * 完成后回调函数
     * @returns
     */
    let complete = function() {
        if (--wait) return;
        let prompt = launchedFromCmd() ? '>' : '$';
        console.log(chalk.gray(' prompt:'), chalk.green('  if installed automatically fails, you can also perform the following commands installed manually \n  ' + prompt + ' cd ' + dir + ' && npm install'));
        spinner.start('Install npm packages...');
        const install = spawn('npm', ['install', '--registry=https://registry.npm.taobao.org'], {
            shell: true,
            cwd: dir
        });
        install.stdout.on('data', (data) => {
            console.log(chalk.green(data));
        });

        install.stderr.on('data', (data) => {
            console.log(chalk.yellow(data));
        });

        install.on('close', (code) => {
            spinner.succeed('Install successful');
            exit(code);
        });
        install.on('error', function() {
            spinner.fail('Install failed');
            exit();
        });
    };

    mkdir(dir, function() {
        // 输入目录
        mkdir(input, function() {
            mkdir(`${input}/js`, () => complete());
            mkdir(`${input}/css`, () => complete());
            mkdir(`${input}/images`, () => complete());
        });
        // 输出目录
        mkdir(output);
        // package.json
        let pkg = require('../project/package.json');
        // write files
        write(`${dir}/package.json`, JSON.stringify(pkg, null, 2) + '\n');
        // config files
        let fangfisConfig = require('../project/fangfis.config.json');
        let build = fangfisConfig.build,
            upload = fangfisConfig.upload;
        build.input = `./${inputFolder}`;
        build.output = `./${outputFolder}`;
        build.base = `./${inputFolder}/js`;
        upload.default.input = upload.online.input = `./${inputFolder}`;
        write(dir + '/fangfis.config.json', JSON.stringify(fangfisConfig, null, 2) + '\n');
        complete();
    });
}


/**
 * 获取格式化路径
 * @param {any} folder
 * @returns
 */
function getFormatFolder(folder) {
    let arr = folder.split('/'),
        reg = /^[\.a-zA-Z][a-zA-Z_\-0-9]*$/gi,
        foramt = '';
    for (let i = 0, len = arr.length; i < len; i++) {
        if (reg.test(arr[i])) {
            foramt = arr[i];
            break;
        }
    }
    return foramt;
}
module.exports = (ops) => {
    co(function*() {
        if (!exit.exited) {
            // Path
            let destinationPath;
            // 自定义输入路径
            let inputPath;
            // 自定义输出路径
            let outputPath;
            if (!ops.yes) {
                destinationPath = yield prompt('Project name (default:.): ');
                inputPath = yield prompt('Development environment folder name (default:dev): ');
                outputPath = yield prompt('Production environment folder name (default:static): ');
            }
            destinationPath = getFormatFolder(destinationPath || '.');
            inputPath = getFormatFolder(inputPath || 'dev');
            outputPath = getFormatFolder(outputPath || 'static');
            // App name
            let appName = createAppName(path.resolve(process.cwd(), destinationPath)) || 'fangfis-build';
            // Generate application
            let isEmpty = yield emptyDirectory(destinationPath);
            if (isEmpty) {
                createApplication(appName, destinationPath, inputPath, outputPath);
            } else {
                let isContinue;
                if (!ops.yes) {
                    let answer = yield prompt('destination is not empty, continue? [Y/N]');
                    isContinue = /^y|yes|ok|true|\s{0}$/i.test(answer);
                } else {
                    isContinue = true;
                }
                if (isContinue) {
                    createApplication(appName, destinationPath, inputPath, outputPath);
                } else {
                    console.log('');
                    console.log(chalk.yellow('terminate the build!'));
                    console.log('');
                    exit();
                }
            }
        }
    });
};