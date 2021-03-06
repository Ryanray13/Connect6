exports.config = {
  specs: ['e2e/end_to_end_tests.js'],
  allScriptsTimeout: 11000,
  directConnect: true, // only works with Chrome and Firefox
  capabilities: {
    'browserName': 'chrome'
  },
  baseUrl: 'http://localhost:9000/test/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 150000
  }
};