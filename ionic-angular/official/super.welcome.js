const chalk = require('chalk');

const msg = `
Welcome to the ${chalk.cyan.bold('IONIC SUPER STARTER')}!

The Super Starter comes packed with ready-to-use page designs for common mobile designs like master detail, login/signup, settings, tutorials, and more. Pick and choose which page types you want to use and remove the ones you don't!

For more details, please see the project README: ${chalk.bold('https://github.com/ionic-team/starters/blob/master/ionic-angular/official/super/README.md')}
`.trim()

console.log(msg);
// console.log(JSON.stringify(msg));
