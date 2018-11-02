<?php

namespace srnden\alloyeditor\assets;

use yii\web\AssetBundle;

/**
 * The AlloyEditorActionsAsset assets.
 */
class AlloyEditorActionsAsset extends AssetBundle
{
    /**
     * {@inheritdoc}
     */
    public $sourcePath = '@vendor/srnden/yii2-alloy-editor/assets';

    /**
     * {@inheritdoc}
     */
    public $css = ['css/style.css'];

    /**
     * {@inheritdoc}
     */
    public $js = ['js/script.js'];

    /**
     * {@inheritdoc}
     */
    public $depends = [
        'yii\web\JqueryAsset',
    ];

    public $publishOptions = [
        'appendTimestamp' => true,
        'linkAssets' => true
    ];

    /**
     * @param string $lang
     * @return $this
     */
    public function addLanguage($lang = '')
    {
        if (empty($lang) || substr($lang, 0, 2) == 'en') {
            return $this;
        }

        $lang = str_replace('-', '_', $lang);
        $ext = 'js';
        $dir = 'js/i18n';

        if (file_exists("{$this->sourcePath}/{$dir}/{$lang}.{$ext}")) {
            $this->js[] = "{$dir}/{$lang}.{$ext}";
        }

        return $this;
    }
}
