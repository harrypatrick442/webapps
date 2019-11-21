var fs = require('fs');
console.log(fs.existsSync('/home'));
console.log(fs.existsSync('/home/user/Desktop'));
fs.mkdirSync('/home/user/Desktop/PornSite/tester', { recursive: true });
 