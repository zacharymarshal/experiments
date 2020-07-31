const packager = require('electron-packager')
packager({
  dir: __dirname + '/../',
  ignore: [new RegExp('scripts/')],
  out: 'build/',
  overwrite: true,
  platform: 'darwin',
  appCopyright: 'Copyright 2020 The Weekend Programmer, LLC',
  appBundleId: 'com.theweekendprogrammer.sqlboss',
  appCategoryType: 'public.app-category.productivity',
  helperBundleId: 'com.theweekendprogrammer.sqlboss.helper',
  asar: true
}).then(appPaths => {
  console.log(appPaths);
});
