module.exports = {
  out: 'docs',

  includes: 'src/lib/**/*',
  exclude: [
    'src/cli/**/*'
  ],

  mode: 'file',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  name: 'Library'
};
