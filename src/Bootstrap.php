<?php

namespace srnden\alloyeditor;

use yii\base\BootstrapInterface;


class Bootstrap implements BootstrapInterface
{
    /**
     * {@inheritdoc}
     */
    public function bootstrap($app)
    {
        //Add url manager rules
        $app->getUrlManager()->addRules([
            'alloyeditor/images/upload' => 'alloyeditor/images/upload',
        ], false);

        /*
         * Register the module in the application
         */
        $app->setModule('alloyeditor', [
            'class' => '\srnden\alloyeditor\Module',
        ]);
    }
}