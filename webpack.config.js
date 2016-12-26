const path = require('path'); // node builtin module
const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed by me
const PATHS = {app: path.join(__dirname, 'app'), build: path.join(__dirname, 'build')};
module.exports = {
   entry:   {app: PATHS.app},
   output:  {path: PATHS.build, filename:'[name].js'},
   plugins: [new HtmlWebpackPlugin({title: 'Webpack demo'})]
   };
