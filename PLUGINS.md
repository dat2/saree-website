### Optional Plugins for easier development

#### EditorConfig
[EditorConfig](http://editorconfig.org/) is a way to unify editor settings across a wide variety of editors, so style can be preserved in the repository, eg. indentation. EditorConfig will scan your folders for .editorconfig files and apply settings to the current file open, silently, and will scan up until it finds a .editorconfig file with `root` set to `true` in the file

1. Get the `EditorConfig` plugin from package control

#### JSHint linting in Sublime Text

Linting will tell you there is an error as you type.

1. Run `npm install jshint`
2. Get the `SublimeLinter` plugin from package control
3. Get the `SublimeLinter-jshint` plugin from package control

#### JavaScript Beautify

JavaScript beautify will automatically format your JavaScript for you when you press <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>f</kbd>. However, we must keep the settings manually in sync with the editor config. [How to set the settings](https://github.com/enginespot/js-beautify-sublime#settings). I recommend you set `format_on_save` to `false`

1. Get `Javascript Beautify` from package control
2. Set the 
