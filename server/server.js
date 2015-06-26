var express = require('express')
var Routes = require('./routes')

var Server = function () {
  var self = this

  this.start = function () {
    // Import the Express server module and create an Express app
    var app = express()

    // Start the server
    var server = app.listen(
      process.env.PORT || 8081,
      function () {
        // Find out what address and port the server is running on
        var host = server
            .address()
            .address || self.hostUrl
        var port = server
          .address()
          .port

        Routes(app)

        // Tell the command line user the server is running
        console.log('Server listening at http://' + host + port)
      }
    )
  }
}

module.exports = Server
