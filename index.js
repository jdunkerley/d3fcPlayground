/* global ace, $ */
(function() {
    'use strict';

    var scriptTarget,
        editor,
        editorHTML;

    function setIFrame(html) {
        var iframe = $('#preview')[0];
        iframe = iframe.contentDocument || iframe.contentWindow.document;
        iframe.open();
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
            url: '/examples/' + scriptTarget,
            success: function(jsCode) {
                editor.getSession().setValue(jsCode);
                editor.setReadOnly(false);
                runSetup();
            },
            dataType: 'html'});

        $.get('/examples/' + scriptName + '.html', function(html) {
            editorHTML.getSession().setValue(html);
            editorHTML.setReadOnly(false);
            runSetup();
        });
    }

    $(function() {
        ace.require('ace/ext/language_tools');

        editor = ace.edit('editor');
        editor.setTheme('ace/theme/cobalt');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setOption('enableBasicAutocompletion', true);
        editor.getSession().on('change', function(e) {
            if ($('#btnAuto').hasClass('active')) {
                runSetup();
            }
        });

        editorHTML = ace.edit('editorHTML');
        editorHTML.setTheme('ace/theme/cobalt');
        editorHTML.getSession().setMode('ace/mode/html');
        editorHTML.setOption('enableBasicAutocompletion', true);
        editorHTML.getSession().on('change', function(e) {
            if ($('#btnAuto').hasClass('active')) {
                runSetup();
            }
        });


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

        loadScript('barChart');
        $('#main').toggleClass('hidden', false);
    });
}());
