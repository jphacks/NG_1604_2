## Oasis Server
[![npm](https://img.shields.io/badge/npm-3.10.3-brightgreen.svg)](https://www.npmjs.com/)
[![Node.js](https://img.shields.io/badge/node-4.4.3-brightgreen.svg)](https://nodejs.org/ja/)
[![ES6](https://img.shields.io/badge/es-6-yellow.svg)](http://es6-features.org/)
[![Firebase](https://img.shields.io/badge/firebase-3-blue.svg)](https://firebase.google.com/?hl=ja)
[![Mongo](https://img.shields.io/badge/mongo-3.2.9-brightgreen.svg)](https://docs.mongodb.com/)
[![Bluebird](https://img.shields.io/badge/bluebird-3.4.6-blue.svg)](http://bluebirdjs.com/docs/getting-started.html)
[![Koa](https://img.shields.io/badge/koa-1.2.4-blue.svg)](http://koajs.com/)

### 概要
[NG_1604](https://github.com/jphacks/NG_1604)のサーバーサイドです。

## ディレクトリ構成

|名前|用途|
|---|---|
|``app``|サーバーサイド|
|┣ ``controllers``|コントローラー定義|
|┣ ``models``|モデル定義|
|┗ ``route.js``|ルート定義|
|``config``|環境変数|
|``lib``|ライブラリ|
|``watch``|監視|

## 開発技術

### 実行環境

|名前|Version|
|---|--------|
|``node.js``|v4.4.3|
|``npm``|3.10.3|
|``koa``|1.2.4|
|``es6``||

### Heroku Addon

|名前|用途|
|---|---|
|MongoLab|Mongo DB|
|Heroku Scheduler|定期実行|

### API

#### 外部API
- [gooラボ 形態素解析API](https://labs.goo.ne.jp/api/jp/morphological-analysis/)
- [word2vec API](https://apitore.com/store/apis/details?id=8)

#### 独自API
#### User

|Method|URI|Description|
|---|---|---|
|GET|``/users``|一覧|
|POST|``/users/``|作成|
|GET|``/users/:id``|詳細|
|POST|``/users/:id``|更新|
|DELETE|``/users/:id``|削除|
|PUT|``/users/:id/like``|like処理|

#### その他
|Method|URI|Description|
|---|---|---|
|GET|``/``|ヘルスチェック|

### 定期実行タスク

|コマンド|説明|定期実行|
|npm run batch|ユーザにレコメンドユーザを算出|1日おき|
|analyze|ユーザのProfileを走査|ユーザ更新時|

### 独自技術

#### Promise
`bluebird`や`axios`, `q`を用いて基本的な処理は全てPromise形式で、返して状態や遷移を保証しました。

#### レコメンド技術
ユーザーのレコメンドには、各nユーザーのプロフィールを形態素解析して、それぞれの単語間の類似度を`word2vec`で算出した結果とランダム誤差を含めた結果から、1日に一度バッチ処理をして、実装しています。ランダム誤差を含めたのは、類似度だけでレコメンドするためではなく、新たな異文化の出会いを創出するためです。
