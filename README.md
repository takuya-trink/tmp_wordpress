# WordPressの環境構築テンプレート（Docker + wordmove + Gulp）

まずはリポジトリをクローン

```
あとでコマンドを書く
```

## Docker の設定

### 0. 事前準備

Macにdocker, docker-composeをインストール

参考記事

[Docker Compose - インストール](https://qiita.com/zembutsu/items/dd2209a663cae37dfa81)

### 1. docker-compose で使用する環境変数を設定

.env ファイルを編集

```
# -------------------------------------------
# wordpress・mysqlコンテナの設定
# -------------------------------------------
# プロダクトの名前 作成されるcontainer名の接頭語として使用
PRODUCTION_NAME= 
# local wordpressを紐付けるPort名（ex: 8080)
LOCAL_SERVER_PORT=
# localのmysqlを紐付けるPort名（ex: 3306)
LOCAL_DB_PORT=

# -------------------------------------------
# wordmoveコンテナの設定
# -------------------------------------------
# 全て本番環境の情報
# URL
PRODUCTION_URL=
# wordpressのディレクトリの絶対パス
PRODUCTION_DIR_PATH=
# DB名
PRODUCTION_DB_NAME=
# DBのユーザー名
PRODUCTION_DB_USER=
# DBのパスワード
PRODUCTION_DB_PASSWORD=
# DBのホスト名
PRODUCTION_DB_HOST=
# DBの接続ポート
PRODUCTION_DB_PORT=
# SSHホスト名
PRODUCTION_SSH_HOST=
# SSHユーザー名
PRODUCTION_SSH_USER=
# SSHポート名
PRODUCTION_SSH_PORT=
```

参考記事

[Docker-composeで最強（自分史上）のWordpress開発環境を作る](https://qiita.com/ryo2132/items/d75e1846aa181676406e)

## Gulp の設定

### 0. 事前準備

nvmインストール


### 1. package.json を生成

```
npm init -y
```

### 2. 必要な Node.js のパッケージをインストール

```
npm install -D postcss-assets autoprefixer gulp-babel postcss-clean gulp-concat del postcss-flexbugs-fixes gulp gulp-header gulp-imagemin imagemin-mozjpeg gulp-notify gulp-order gulp-plumber imagemin-pngquant gulp-postcss gulp-prettify gulp-rename gulp-replace gulp-sass postcss-sorting gulp-uglify webpack webpack-cli babel-loader @babel/core @babel/preset-env
```

