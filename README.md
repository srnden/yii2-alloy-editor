Yii2 Alloy Editor (beta)

=================

Yii2 Alloy Editor widget. https://alloyeditor.com/



Installation

------------



The preferred way to install this extension is through [composer](http://getcomposer.org/download/).



Either run



```

php composer.phar require --prefer-dist srnden/yii2-alloy-editor "dev-master"

```



or add



```

"srnden/yii2-alloy-editor": "dev-master"

```



to the require section of your `composer.json` file.





Usage

-----



Once the extension is installed, simply use it in your code by  :


```php
<?php
use yii\helpers\Url;
use srnden\alloyeditor\AlloyEditor;
?>

<?php AlloyEditor::begin([
    'language' => 'ru',
    'saveAction' => Url::to(['site/alloy-test'], true), // required
    'imageSaveType' => AlloyEditor::IMAGE_SAVE_TYPE_UPLOAD,
    //'imageSaveAction' => // You save image action. If not set, the module action is used.
]); ?>

    <h2>Heading</h2>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
        et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu
        fugiat nulla pariatur.</p>


<?php AlloyEditor::end(); ?>
```

