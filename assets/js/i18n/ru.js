/* Russian (UTF-8) initialisation. */
(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["../alloyEditorWidget"], factory);
    } else {

        // Browser globals
        factory(jQuery.alloyEditorWidget);
    }
}(function (alloyEditorWidget) {

    alloyEditorWidget.i18n.ru = {
        errorAlloyEditirInit: '"AlloyEditor" должен быть инициализирован.',
        errorTargetId: 'Элемент должен иметь атрибут "id".',
        saveButtonLabel: 'Сохранить',
        ready: 'Готово',
        saveImageProgress: 'Сохраняем новое изображение {n}...',
        saveContentProgress: 'Сохраняем содержимое...'
    };

    alloyEditorWidget.setI18n(alloyEditorWidget.i18n);

    return alloyEditorWidget.i18n.ru;
}));