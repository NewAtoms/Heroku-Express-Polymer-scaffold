var fileSystem = require('fs')
var marked = require('marked')
var markdownExtra = require('markdown-extra')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

var Pages = function (fileDirecory, callback) {
  var self = this
  self._allPages = []

  self._parseMarkdownFilesFromDirectory = function (fileDirecory, callback) {
    fileSystem.readdir(fileDirecory, function (fileSystemError, files) {
      if (fileSystemError) throw fileSystemError
      var fileIndex = 0
      files.forEach(function (filename) {
        fileIndex++
        fileSystem.readFile(fileDirecory + filename, 'utf-8', function (fileSystemError, markdown) {
          if (fileSystemError) throw fileSystemError

          var page = self._parseMarkdownToObject(markdown)
          page.name = filename.replace(/\.md/g, '')

          self[page.name] = page
          self._allPages.push(page)

          if (--fileIndex === 0) {
            if (callback) callback(self)
          }
        })
      })
    })
  }

  self._parseMarkdownToObject = function (markdown) {
    var page = {}

    page.title = markdownExtra.heading(markdown)

    page.metadata = markdownExtra.metadata(markdown, self._markdownMetadataToObject)

    var markdownWithoutMetadata = markdown.replace(/<!--[\s\S]*?-->\n\n/g, '')
    page.markdown = markdownWithoutMetadata
    page.html = marked(markdownWithoutMetadata)

    return page
  }

  self._markdownMetadataToObject = function (string) {
    var result = {}
    string = '{ "' + string
    string = string.replace(/\n/g, '", "')
    string = string.replace(/: /g, '": "')
    string = string + '" }'

    try {
      result = JSON.parse(string)
    } finally {return result }
  }

  self._parseMarkdownFilesFromDirectory(fileDirecory, callback)

  return self
}

module.exports = Pages
