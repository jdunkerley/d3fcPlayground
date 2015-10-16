(function() {
    'use strict';

    var editor = ace.edit('editor');
    editor.setTheme('ace/theme/cobalt');
    editor.getSession().setMode('ace/mode/javascript');

    function loadScript(scriptName) {
        d3.text('/examples/' + scriptName + '.js', function(text) {

        });
    }

    var examples = d3.select('#examples');
    examples
        .on('change', function() {
            loadScript(examples.property('value'))
        });
}());
