<?php

namespace srnden\alloyeditor\controllers;

use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\web\Response;


class ImagesController extends Controller
{
    /**
     * @return array [
     *  'success' => bool,
     *  'message' => string
     * ]
     * @throws NotFoundHttpException
     */
    public function actionUpload()
    {
        if (!Yii::$app->request->isAjax) {
            throw new NotFoundHttpException(Yii::t('yii', 'Page not found.'));
        }

        Yii::$app->response->format = Response::FORMAT_JSON;

        $uploadsDir = 'assets/alloy-editor-uploads';

        $dir = Yii::getAlias('@webroot/' . $uploadsDir);
        $url = Yii::getAlias('@web/' . $uploadsDir);

        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            return [
                'success' => false,
                'message' => Yii::t('srndenalloyeditor', 'Failed to create folder.')
            ];
        }

        if (Yii::$app->request->post('data')) {
            $data = str_replace(['data: ', ' '], ['data:', '+'], Yii::$app->request->post('data'));

            $extensions = [
                'image/png' => 'png',
                'image/jpg' => 'jpg',
                'image/jpeg' => 'jpeg',
            ];

            $ext = null;

            foreach ($extensions as $mime => $extension) {
                if (strpos($data, 'data:' . $mime) !== false) {
                    $ext = $extension;
                    $data = str_replace('data:' . $mime . ';base64,', '', $data);
                    break;
                }
            }

            if ($ext === null) {
                return [
                    'success' => false,
                    'message' => Yii::t('srndenalloyeditor', 'Unknown image format.')
                ];
            }

            $filename = md5($data) . '.' . $ext;
            $data = base64_decode($data);
            $file = $dir . '/' . $filename;

            if (file_put_contents($file, $data)) {
                return [
                    'success' => true,
                    'src' => $url . '/' . $filename,
                    'saved_src' => '/' . $uploadsDir . '/' . $filename
                ];
            }

            return [
                'success' => false,
                'message' => Yii::t('srndenalloyeditor', 'Failed to save image.')
            ];
        }

        return [
            'success' => false,
            'message' => Yii::t('srndenalloyeditor', 'Empty POST.')
        ];
    }
}
