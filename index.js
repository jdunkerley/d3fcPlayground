/* global ace, d3 */
(function() {
    'use strict';

    var useLocalD3FC = document.URL.match(/[?&]local([&=]|$)/i);
    var autoRun = false;

    var scriptTarget,
        editor,
        editorHTML;

    function setIFrame(html) {
        var iframe = document.getElementById('preview');
        iframe = iframe.contentDocument || iframe.contentWindow.document;
        iframe.open('text/html', 'replace');
        iframe.write(html);
        iframe.close();
    }

    function runSetup() {
        var currentHTML = editorHTML.getSession().getValue();
        var currentJS = editor.getSession().getValue();
        if (currentHTML === 'Loading ...' || currentJS === 'Loading ...') {
            return;
        }

        currentHTML = currentHTML.replace('<body>', '<body style="margin:0">')

        // Find reference to script
        var startIndex = currentHTML.indexOf('<script src="' + scriptTarget + '"');
        var endIndex = currentHTML.indexOf('</script>', startIndex);
        var merged = currentHTML.substr(0, startIndex);
        merged += '<script type="text/javascript">';
        merged += currentJS;
        merged += currentHTML.substr(endIndex);

        setIFrame(merged);
    }

    function autoRunToggle() {
        autoRun = !autoRun;

        var btn = document.getElementById('btnAuto');
        if (autoRun) {
            btn.className = btn.className.replace('btn-default', 'btn-primary');
            runSetup();
        } else {
            btn.className = btn.className.replace('btn-primary', 'btn-default');
        }
    }

    function loadScript(scriptName) {
        scriptTarget = scriptName + '.js';

        // Clear Out Everything
        editor.setReadOnly(true);
        editor.getSession().setValue('Loading ...');
        editorHTML.getSession().setValue('Loading ...');
        editorHTML.setReadOnly(true);
        setIFrame('<HTML><Body>Loading ...</Body></HTML>');

        d3.text('examples/' + scriptTarget,
            'text/plain',
            function(jsCode) {
                editor.getSession().setValue(jsCode);
                editor.setReadOnly(false);
                runSetup();
            });

        d3.text('examples/' + scriptName + '.html',
            'text/plain',
            function(html) {
                html = html.replace(/\$version/g, '2.1.1');

                // Switch to local d3fc if available
                if (useLocalD3FC) {
                    html = html.replace(/"https:([^"])*\/d3fc.min.css"/, '"http://localhost:8000/assets/d3fc.css"');
                    html = html.replace(/"https:([^"])*\/d3fc.min.js"/, '"http://localhost:8000/assets/d3fc.js"');
                }

                editorHTML.getSession().setValue(html);
                editorHTML.setReadOnly(false);
                runSetup();
            });
    }

    function setUpEditor(divId) {
        var editor = ace.edit(divId);
        editor.$blockScrolling = Infinity;
        editor.setTheme('ace/theme/crimson_editor');
        editor.setShowPrintMargin(false);
        editor.setOption('enableBasicAutocompletion', true);
        editor.getSession().on('change', function(e) {
            if (autoRun) {
                runSetup();
            }
        });
        return editor;
    }

    document.addEventListener('DOMContentLoaded', function() {
        ace.require('ace/ext/language_tools');

        editor = setUpEditor('editor');
        editor.getSession().setMode('ace/mode/javascript');

        editorHTML = setUpEditor('editorHTML');
        editorHTML.getSession().setMode('ace/mode/html');

        // Resize Preview Pane Based On Content
        document.getElementById('preview')
            .addEventListener('load', function() {
                this.style.height = this.contentWindow.document.body.offsetHeight + 'px';
            });

        // Connect Buttons
        document.getElementById('btnRun')
            .addEventListener('click', function(e) {
                e.preventDefault();
                runSetup();
            });
        document.getElementById('btnAuto')
            .addEventListener('click', function(e) {
                e.preventDefault();
                autoRunToggle();
            });

        // Wire Up Examples
        var examples = document.querySelectorAll('a.example');
        var exampleCallback = function(e) {
            e.preventDefault();
            loadScript(this.getAttribute('data-target'));
        };
        for (var i = 0; i<examples.length; i++) {
            examples[i].addEventListener('click', exampleCallback);
        }

        var target = document.URL.match(/[?&]example=([^&]*)/i) || ['', 'barChart'];
        loadScript(target[1]);
    });
}());
