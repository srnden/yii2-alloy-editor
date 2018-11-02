(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            "jquery"
        ], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var AlloyEditorWidget = function () {
        this.editor = null;
        this.settings = {
            panelClass: 'alloy-editor-widget-panel-item',
            afterSave: false
        };
        this.i18n = {
            en: {
                errorAlloyEditirInit: '"AlloyEditor" must be initialized.',
                errorTargetId: 'Target must have "id" attribute.',
                saveButtonLabel: 'Save',
                ready: 'Ready',
                saveImageProgress: 'Save new image {n}...',
                saveContentProgress: 'Save content...'
            }
        }
    };

    $.extend(AlloyEditorWidget.prototype, {
        init: function (target, settings) {
            var _t = this;
            this.language = typeof settings['language'] !== "undefined" ? settings['language'] : 'en';

            try {
                if (typeof(AlloyEditor) !== 'object') {
                    throw _t.i18n.errorAlloyEditirInit;
                }

                if (!target.id) {
                    throw _t.i18n.errorTargetId;
                }

                _t.target = target;
                _t.settings = $.extend(_t.settings, settings || {});

                // create save button
                var React = AlloyEditor.React;
                var ButtonSave = React.createClass({
                    displayName: 'ButtonSave',

                    mixins: [AlloyEditor.ButtonStyle, AlloyEditor.ButtonStateClasses, AlloyEditor.ButtonActionStyle],

                    propTypes: {
                        editor: React.PropTypes.object.isRequired
                    },

                    getDefaultProps: function () {
                        return {
                            style: {
                                element: 'save'
                            }
                        };
                    },

                    statics: {
                        key: 'save'
                    },

                    render: function () {
                        var _constructor = this;
                        var cssClass = 'ae-button ' + _constructor.getStateClasses();

                        return React.createElement(
                            'button',
                            {
                                className: cssClass,
                                'data-type': 'button-save',
                                onClick: _constructor.applyStyle,
                                tabIndex: _constructor.props.tabIndex,
                                title: _t.translate('saveButtonLabel')
                            },
                            React.createElement('span', {className: 'icon-floppy'})
                        );
                    }
                });

                AlloyEditor.Buttons[ButtonSave.key] = AlloyEditor.ButtonSave = ButtonSave;

                var toolbars = {
                    styles: {
                        selections: [{
                            name: 'text',
                            buttons: ['styles', 'bold', 'italic', 'underline', 'link', 'twitter'],
                            test: AlloyEditor.SelectionTest.text
                        }],
                        tabIndex: 1
                    }
                };

                // init AlloyEditor
                _t.editor = AlloyEditor.editable(target.id, {
                    language: 'ru',
                    toolbars: {
                        add: {
                            // Specifying the buttons by explicitly enumerating the desired ones
                            buttons: ['save', 'image', 'embed', 'hline', 'table'],
                            // Or specifying the buttons by  adding the default value
                            // buttons: AlloyEditor.Core.ATTRS.toolbars.value['add'].buttons,

                            // ToolbarAdd should be rendered on right
                            position: AlloyEditor.ToolbarAdd.left,
                            tabIndex: 2
                        },
                        styles: {
                            selections: [{
                                name: 'text',
                                buttons: ['styles', 'bold', 'italic', 'underline', 'link', 'twitter', 'save'],
                                test: AlloyEditor.SelectionTest.text
                            }],
                            tabIndex: 1
                        }
                    }
                });

                // save event
                // todo мб по другому
                _t.editor._editor.on('actionPerformed', function (e) {
                    var item = AlloyEditor.ReactDOM.findDOMNode(e.data);

                    if ($(item).data('type') == 'button-save') {
                        _t.saveRun();
                    }
                });
            } catch (err) {
                console.error('AlloyEditorWidget Error: ' + err)
            }
        },

        translate: function (key) {
            var i18n = typeof this.i18n[this.language] !== 'undefined' ? this.i18n[this.language] : this.i18n.en;

            return typeof i18n[key] !== 'undefined' ? i18n[key] : '';
        },

        setI18n: function (i18n) {
            this.i18n = $.extend(this.i18n, i18n || {});
        },

        processLine: function (msg) {
            var _t = this;
            var tpl = '<div class="alloy-editor-widget-panel ' + _t.settings.panelClass + '" data-target="' + _t.target.id + '" onclick="this.style.display=\'none\'">' +
                '<div class="alloy-editor-widget-progress"></div>' +
                '</div>';


            if (!$('body').find('.' + _t.settings.panelClass + '[data-target="' + _t.target.id + '"]').length) {
                $('body').append(tpl);
            }

            var progress_box = $('body').find('.' + _t.settings.panelClass + '[data-target="' + _t.target.id + '"]');

            if (progress_box.css('display') === 'none') {
                var pos = _t.editor._editor.container.getDocumentPosition();

                progress_box.css({
                    display: 'block',
                    left: pos.x /*+ _t.editor._editor.container.getSize('width')*/,
                    top: pos.y
                });

                progress_box.show();
            }

            progress_box.append('<div>' + msg + '</div>');
        },

        processClear: function () {
            var _t = this;
            var progress_box = $('.' + _t.settings.panelClass + '[data-target="' + _t.target.id + '"]');

            progress_box.hide().html('');
        },

        saveRun: function () {
            var _t = this;
            var images = $(_t.editor._editor.container.$).find('img[src^="data:"]');

            _t.processClear();

            if (typeof _t.settings.image_save_action === "string" && _t.settings.image_save_action !== '' && images.length) {
                var promise = $.when();

                // save images, replace src
                $.each(images, function (index, item) {
                    promise = promise.then(function () {
                        _t.processLine(_t.translate('saveImageProgress').replace('{n}', index + 1));

                        return _t.imageSave(item.currentSrc, function (data) {
                            $(_t.editor._editor.container.$).find('img[src="' + item.currentSrc + '"]').each(function () {
                                $(this).attr('src', data.src);
                                $(this).attr('data-cke-saved-src', data.saved_src);
                            });
                        });
                    });
                });

                promise.then(function () {
                    _t.processLine(_t.translate('saveContentProgress'));
                    _t.contentSave();
                });
            } else {
                _t.processLine(_t.translate('saveContentProgress'));
                _t.contentSave();
            }
        },

        imageSave: function (image_data, callback) {
            var _t = this;

            return $.ajax({
                url: _t.settings.image_save_action,
                data: {
                    data: image_data
                },
                type: 'POST',
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        callback(response);
                    } else {
                        _t.processLine(response.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.info(textStatus + ' ' + errorThrown);
                }
            });
        },

        contentSave: function () {
            var _t = this;

            return $.ajax({
                url: _t.settings.save_action,
                data: {
                    content: _t.editor.get('nativeEditor').getData()
                },
                type: 'POST',
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        _t.processClear();
                        _t.processLine(_t.translate('ready'));
                    } else {
                        _t.processLine(response.message);
                    }

                    if (typeof _t.settings.afterSave === "function") {
                        _t.settings.afterSave(response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.info(textStatus + ' ' + errorThrown);
                }
            });
        }
    });

    $.fn.alloyEditorWidget = function (options) {
        return this.each(function () {
            // $.alloyEditorWidget.init(this, options); // todo косяк с instance

            var opt = $.extend($.alloyEditorWidget.settings, options);

            var inst = new AlloyEditorWidget()
            inst.init(this, opt);
            inst.setI18n($.alloyEditorWidget.i18n);
        });
    };

    $.alloyEditorWidget = new AlloyEditorWidget();

    return $.alloyEditorWidget;
}));