const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');

const scss_filename = path.resolve(__dirname, '../homolo-datamodel.scss');
const targetPath = path.resolve('./dist/homolo-datamodel');

sass.render({
  file: scss_filename,
}, function(error, result) {
  if (!error) {
    fs.writeFileSync(path.join(targetPath, 'homolo-datamodel.css'), result.css);
  }
});
