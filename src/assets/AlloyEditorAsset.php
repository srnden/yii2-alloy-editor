<?php

namespace srnden\alloyeditor\assets;

use yii\web\AssetBundle;

/**
  * The AlloyEditor assets.
 */
class AlloyEditorAsset extends AssetBundle
{
    /**
     * {@inheritdoc}
     */
    public $sourcePath = '@bower/alloyeditor/dist/alloy-editor';
    
    /**
     * {@inheritdoc}
     */
    public $css = ['assets/alloy-editor-ocean-min.css'];

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        $this->js[] = 'alloy-editor-all' . (YII_DEBUG ? '' : '-min') . '.js';
        parent::init();
    }
}
