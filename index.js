(function() {
    'use strict';

    ace.require("ace/ext/language_tools");

    var editor = ace.edit('editor');
    editor.setTheme('ace/theme/cobalt');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setOption('enableBasicAutocompletion', true);

    var editorHTML = ace.edit('editorHTML');
    editorHTML.setTheme('ace/theme/cobalt');
    editorHTML.getSession().getMode('ace/mode/html');
    editorHTML.setOption('enableBasicAutocompletion', true);

    var iFrame = d3.select('#preview').node();

    function loadScript(scriptName) {
        d3.text('/examples/' + scriptName + '.js', function(text) {
            editor.setValue(text);
        });

        d3.text('/examples/' + scriptName + '.html', function(html) {
            editorHTML.setValue(html);
        });
    }

    // Connect Examples
    var examples = d3.select('#examples');
    examples
        .on('change', function() {
            loadScript(examples.property('value'))
        });

    loadScript('barChart');
}());
