#! /usr/bin/env node

const path = require('path');
const { runQunitPuppeteer, printFailedTests } = require('./node_modules/node-qunit-puppeteer/index.js');

const args = process.argv.slice(2);

if (args.length < 1 || args.length > 3) {
  console.log('Usage: node-qunit-puppeteer <URL> [<timeout>] [<puppeteerArgs>]');
  process.exit(1);
}

let targetUrl = args[0];

if (targetUrl.indexOf('http://') === 0 || targetUrl.indexOf('https://') === 0) {
  // Absolute URL, do nothing
} else if (!path.isAbsolute(targetUrl)) {
  // Relative file path -- append file://
  targetUrl = `file://${path.join(process.cwd(), targetUrl)}`;
} else if (targetUrl.indexOf('file://') !== 0) {
  // Absoolute path -- prepent file://
  targetUrl = `file://${targetUrl}`;
}

const qunitArgs = {
  targetUrl,
  timeout: parseInt(args[1] || 30000, 10),
  redirectconsole: false,
};

const puppeteerArgsStr = args[2];
if (typeof puppeteerArgsStr === 'string') {
  const puppeteerArgs = puppeteerArgsStr.split(/(\s+)/).filter(s => s.trim().length > 0);
  if (args.length > 0) {
    qunitArgs.puppeteerArgs = puppeteerArgs;
    console.log(`Puppeteer args are: ${puppeteerArgs.join(' ')}`);
  }
}

runQunitPuppeteer(qunitArgs)
  .then((result) => {
    var output = {passed:result.stats.passed,failed:result.stats.failed,total:result.stats.total,runtime:result.stats.runtime,failures:[]};

    console.log(JSON.stringify(output));
    if (result.stats.failed > 0) {
      // Handle the failed test run
      printFailedTests(result, console);
    } else {
      process.exit(0);
    }
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
