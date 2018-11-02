<?php
/**
 * @author Denis A
 */

namespace srnden\alloyeditor;

use Yii;
use yii\base\InvalidConfigException;
use yii\base\Widget;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\View;
use srnden\alloyeditor\assets\AlloyEditorAsset;
use srnden\alloyeditor\assets\AlloyEditorActionsAsset;


class AlloyEditor extends Widget
{
    const
        IMAGE_SAVE_TYPE_DEFAULT = 'default',
        IMAGE_SAVE_TYPE_UPLOAD = 'upload',
        IMAGE_SAVE_TYPE_FILE_MANAGER = 'file_manager';

    private $_wrapperID;

    /**
     * @var string container tag.
     */
    public $tag = 'div';

    /**
     * @var array tag options.
     */
    public $options = [];

    /**
     * @var string the locale ID (e.g. 'ru', 'en') for the language to be used by the AlloyEditor Widget. Default 'en'.
     */
    public $language = 'en';

    /**
     * @var string Content save action.
     *
     */
    public $saveAction;

    /**
     * @var string Image save type.
     * Default is self::IMAGE_SAVE_TYPE_DEFAULT.
     */
    public $imageSaveType;

    /**
     * @var string Images save action url.
     * Required when $imageSaveType = self::IMAGE_SAVE_TYPE_UPLOAD. Default is 'alloy-editor/images/upload'
     */
    public $imageSaveAction;


    /**
     * @inheritdoc
     */
    public static $autoIdPrefix = 'alloyEditor';

    /**
     * init AlloyEditor.
     */
    public function initEditor()
    {
        if (empty($this->saveAction)) {
            throw new InvalidConfigException(Yii::t('srndenalloyeditor', 'You must set content save action.'));
        }

        if (!in_array($this->imageSaveType, [self::IMAGE_SAVE_TYPE_UPLOAD, self::IMAGE_SAVE_TYPE_FILE_MANAGER])) {
            $this->imageSaveType = self::IMAGE_SAVE_TYPE_DEFAULT;
        }

        $jsOptions = [
            'language' => $this->language,
            'save_action' => $this->saveAction,
            'image_save_type' => $this->imageSaveType
        ];

        switch ($this->imageSaveType) {
            case self::IMAGE_SAVE_TYPE_UPLOAD :
                if (empty($this->imageSaveAction)) {
                    $this->imageSaveAction = Url::to(['alloyeditor/images/upload']);
                }

                $jsOptions['image_save_action'] = $this->imageSaveAction;

                break;

            case self::IMAGE_SAVE_TYPE_FILE_MANAGER :
                throw new InvalidConfigException('It\'s not work yet.');
        }

        AlloyEditorAsset::register($this->getView());
        AlloyEditorActionsAsset::register($this->getView())->addLanguage($this->language);

        $jsOptions = Json::encode($jsOptions);

        $js = <<<JS
$(function() {
    $('#{$this->_wrapperID}').alloyEditorWidget({$jsOptions});
});
JS;
        $this->getView()->registerJs($js, View::POS_READY);
    }

    /**
     * Start widget.
     */
    public function init()
    {
        parent::init();

        $this->registerTranslations();

        if (isset($this->options['id'])) {
            if (empty($this->options['id']) || !is_string($this->options['id'])) {
                throw new InvalidConfigException(Yii::t('srndenalloyeditor', 'Invalid id.'));
            }

            $this->_wrapperID = $this->options['id'];
        } else {
            $this->_wrapperID = $this->getId();
            $this->options['id'] = $this->_wrapperID;
        }

        echo Html::beginTag($this->tag, $this->options);
    }

    /**
     * Close widget.
     * @return string|void
     */
    public function run()
    {
        $this->initEditor();

        echo Html::endTag($this->tag);
    }

    /**
     * Register translations.
     */
    public function registerTranslations()
    {
        Yii::$app->i18n->translations['srndenalloyeditor'] = [
            'class' => 'yii\i18n\PhpMessageSource',
            'sourceLanguage' => 'en-US',
            'basePath' => '@vendor/srnden/yii2-alloy-editor/src/messages',
        ];
    }
}