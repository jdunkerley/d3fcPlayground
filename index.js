/* global ace, $ */
(function() {
    'use strict';

    var useLocalD3FC = document.URL.match(/[?&]local([&=]|$)/i);

    var scriptTarget,
        editor,
        editorHTML;

    function setIFrame(html) {
        var iframe = $('#preview')[0];
        iframe = iframe.contentDocument || iframe.contentWindow.document;
        iframe.open('text/html', 'replace');
        iframe.write(html);
        iframe.close();
    }

    function runSetup() {
        var currentHTML = editorHTML.getSession().getValue();
        var currentJS = editor.getSession().getValue();
        if (currentHTML === 'Loading ...' || currentJS === 'Loading ...') { return; }

        // Find reference to script
        var startIndex = currentHTML.indexOf('<script src="' + scriptTarget + '"');
        var endIndex = currentHTML.indexOf('</script>', startIndex);
        var merged = currentHTML.substr(0, startIndex);
        merged += '<script type="text/javascript">';
        merged += currentJS;
        merged += currentHTML.substr(endIndex);

        setIFrame(merged);
    }

    function loadScript(scriptName) {
        scriptTarget = scriptName + '.js';

        // Clear Out Everything
        editor.setReadOnly(true);
        editor.getSession().setValue('Loading ...');
        editorHTML.getSession().setValue('Loading ...');
        editorHTML.setReadOnly(true);
        setIFrame('<HTML><Body>Loading ...</Body></HTML>');

        $.ajax({
            url: '  examples/' + scriptTarget,
            success: function(jsCode) {
                editor.getSession().setValue(jsCode);
                editor.setReadOnly(false);
                runSetup();
            },
            dataType: 'html'});

        $.get('examples/' + scriptName + '.html', function(html) {
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

    $(function() {
        ace.require('ace/ext/language_tools');

        editor = ace.edit('editor');
        editor.setTheme('ace/theme/crimson_editor');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setOption('enableBasicAutocompletion', true);
        editor.getSession().on('change', function(e) {
            if ($('#btnAuto').hasClass('active')) {
                runSetup();
            }
        });

        editorHTML = ace.edit('editorHTML');
        editorHTML.setTheme('ace/theme/crimson_editor');
        editorHTML.getSession().setMode('ace/mode/html');
        editorHTML.setOption('enableBasicAutocompletion', true);
        editorHTML.getSession().on('change', function(e) {
            if ($('#btnAuto').hasClass('active')) {
                runSetup();
            }
        });


        // Crimson Editor (light)
        // Cobalt (blue)
        // Teminal (dark)

        // Connect Buttons
        $('#btnRun').on('click', function(e) {
            e.preventDefault();
            runSetup();
        });
        $('#btnAuto').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('active');
            runSetup();
        });
        $('a.example').on('click', function(e) {
            e.preventDefault();
            loadScript($(this).data('target'));
        });
        $('a.theme').on('click', function(e) {
            e.preventDefault();
            editor.setTheme('ace/theme/' + $(this).data('target'));
            editorHTML.setTheme('ace/theme/' + $(this).data('target'));
        });

        var target =  document.URL.match(/[?&]example=([^&]*)/i) || ['','barChart'];
        loadScript(target[1]);
        $('#main').toggleClass('hidden', false);
    });
}());
