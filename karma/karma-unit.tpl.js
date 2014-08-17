module.exports = {

  /**
   * This is the list of file patterns to load into the browser during testing.
   */
  files: [<% scripts.forEach(function(file) { %>
    '<%= file %>', <% }); %>
    'src/app/**/*.js',
  ],
  exclude: [
    'src/assets/**/*.js'
  ],
  frameworks: ['mocha'],
  plugins: ['karma-mocha', 'karma-chai'],

  /**
   * How to report, by default.
   */
  reporters: 'dots',

  /**
   * On which port should the browser connect, on which port is the test runner
   * operating, and what is the URL path for the browser to use.
   */
  port: 9018,
  runnerPort: 9100,
  urlRoot: '/',

  /**
   * List of browsers to auto capture. Starts a browser every time you run `gulp test`
   * so, its pretty annoying.
   */
  browsers: []
};
