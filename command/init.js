'use strict';
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const download = require('download-git-repo');
const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

const _exit = process.exit;
const exec = require('child_process').exec;
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

    streams.forEach(function (stream) {
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
    return function (callback) {
        fs.readdir(path, function (err, files) {
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
    mkdirp(path, MODE_0755, function (err) {
        if (err) throw err;
        console.log('   \x1b[36mcreate\x1b[0m : ' + path);
        fn && fn();
    });
}

/**
 * Create application at the given directory `path`.
 * @param {String} dir
 */
function createApplication(name, dir) {
    console.log(chalk.cyan('\n Start generating...'));
    var wait = 8;

    function complete() {
        if (--wait) return;
        var prompt = launchedFromCmd() ? '>' : '$';
        console.log('');
        console.log(chalk.gray(' install npm packages:'));
        console.log(chalk.green('  if installed automatically fails, you can also perform the following commands installed manually \n  ' + prompt + ' cd ' + dir + ' && npm install'));
        console.log('');
        console.log(chalk.cyan('\n Start install npm packages...'));
        console.log(chalk.yellow('\n Please wait patiently because you have more packages...'));
        exec(`cd ${dir} && npm install`, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
            }
            console.log(chalk.green(' ' + stdout));
            console.log(chalk.yellow(' ' + stderr));
            console.log(chalk.green(` now you can go to the directory '/${dir}'  to see if the folder 'node_modules' is present to verify\n that the installation is successful; if it does not exist or error, please install it manually.`));
            exit();
        });
    }

    mkdir(dir, function () {
        'dev static'.replace(/\w+/g, (name) => {
            mkdir(dir + '/' + name, function () {
                mkdir(dir + '/dev/js', () => complete());
                mkdir(dir + '/dev/css', () => complete());
                mkdir(dir + '/dev/images', () => complete());
            });
        });
        // package.json
        let pkg = require('../project/package.json');

        // write files
        write(dir + '/package.json', JSON.stringify(pkg, null, 2) + '\n');
        // '\.babelrc'.replace(/\w+\.?\w+/g, (name) => {
        //     copyTemplate(name, path + '/' + name);
        // });
        complete();

        download('fangjs/f.js', path.resolve(__dirname,'../project'), function (err) {
            if (err) throw err;
            complete();
        });
    });
}

module.exports = () => {
    co(function* () {
        if (!exit.exited) {
            // Path
            let destinationPath = yield prompt('Project name (default:): ');
            destinationPath = destinationPath || '.';
            // App name
            let appName = createAppName(path.resolve(process.cwd(), destinationPath)) || 'fangfis-build';
            // Generate application
            let isEmpty = yield emptyDirectory(destinationPath);
            if (isEmpty) {
                createApplication(appName, destinationPath);
            } else {
                let isContinue = /^y|yes|ok|true$/i.test(yield prompt('destination is not empty, continue? [Y/N]'));
                if (isContinue) {
                    createApplication(appName, destinationPath);
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