# WordPressの環境構築テンプレート（Docker + wordmove + Gulp）

WordPressの環境構築テンプレート

- docker-compose で環境構築

- wordmove で簡単デプロイ

- Gulp でSass, ES6(Babel), 画像圧縮, シンプルなファイル管理を実現

まずはリポジトリをクローンしてテンプレートをダウンロード。

```
git clone https://github.com/takuya-trink/tmp_wordpress.git
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

***

## Gulp の設定

### 0. 事前準備

nvm, Node.js npm のインストール

[nvm + Node.js + npmのインストール](https://qiita.com/sansaisoba/items/242a8ba95bf70ba179d3)

#### nvm で プロジェクト単位で Nodo.js, npm のバージョンを管理する

/.envrc, /.nvmrc で本プロジェクトのみに任意のバージョンの Node.js を使用する様に処理。

本プロジェクトに使用する Node.js のバージョンを変更したい場合は /.nvmrc に変更したいバージョンを記述。

### 1. package.json を生成

```
npm init -y
```

### 2. 使用する Node.js のモジュールをインストール

```
npm install -D postcss-assets autoprefixer gulp-babel postcss-clean gulp-concat del postcss-flexbugs-fixes gulp gulp-header gulp-imagemin imagemin-mozjpeg gulp-notify gulp-order gulp-plumber imagemin-pngquant gulp-postcss gulp-prettify gulp-rename gulp-replace gulp-sass postcss-sorting gulp-uglify webpack webpack-cli babel-loader @babel/core @babel/preset-env
```

#### watchpack-chokidar2の警告

```
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN notsup Unsupported engine for watchpack-chokidar2@2.0.0: wanted: {"node":"<8.10.0"} (current: {"node":"12.16.3","npm":"6.14.4"})
npm WARN notsup Not compatible with your version of node/npm: watchpack-chokidar2@2.0.0
```

このエラーが出たとしても問題ないらしい？下記参照。

[Upgrade watchpack for node 14 compatibility #10924](https://github.com/webpack/webpack/issues/10924)

#### npm install でgypエラー

下記の参考にxcodeを入れ直したら解決。

[Macでyarn installしたらnode-gypのエラーが出た](https://qiita.com/hppRC/items/a01e33a5c890f7b2c125)

#### パッケージの依存関係の警告

`npm audit fix` や `ncu` で解決できない場合、下記を参考に package-lock.json を修正

[npm audit fixでエラーを修正できない人のための解決策](https://fantastech.net/npm-audit-fix-not-working)

### 3. gulpfile.js にテーマ名を記述

gulpfile.js の下記部分にテーマ名を記述（この配下にtempファイルで編集したファイルが出力されます）。

```
// WordPressのテーマ
const wpTheme = 'wpThemeName'
```

***

## 開発環境を起動（Docker + Gulp）

### 1. Docker の起動

```
docker-compose up -d
```

### 2. Gulp の起動

```
npx gulp
```

### 3. WordPressの初期設定

下記にアクセスしWordPressの初期設定を行う（ポートは自分の設定したポートを指定する）。

```
http://localhost:8080
```

***

## Dockerコンテナの運用

### 1. Dcokerコンテナの起動

WordPressのプロジェクトを編集するときはDockerコンテナはじめに起動します。

```
docker-compose up -d
```

### 2. Dockerコンテナの終了

```
docker-compose down
```

### 3. その他の docker-compose の使用について

[docker docker-compose コマンド](https://qiita.com/souichirou/items/6e701f6469822a641bdd)

***

## wordmoveでの本番デプロイ、バックアップ

## 1. wordmoveのコンテナに接続

wordmovemのコンテナが起動した状態で以下コマンドを実行。

```
docker exec -w /home/ -it [wordmoveのコンテナ名] /bin/bash
```

## 2. sshの設定

ssh-agentの起動。

```
ssh-agent bash
```

ssh-agentの登録。

```
ssh-add /home/.ssh/[秘密鍵のファイル名]
```

#### パーミッションの設定がまだの場合

[【秘密鍵/公開鍵】コピペで出来る！鍵認証の設定方法](https://qiita.com/nnahito/items/dbe6fbfe347cd66ae7e6)

#### mysqlのdumpで失敗する場合

wordmoveのコンテナ内で下記を実行

```
# wordmoveのmysql dumpで使うRubyのエンコーディングをUTF8に
export RUBYOPT=-EUTF-8
```

## 3. 本番デプロイ

### 全てのデータをデプロイ（./config/movefile.yml で除外したファイルは除く）

```
wordmove push --all
```

### DBのみデプロイ

```
wordmove push -d
```

### 本番のデータをローカルにバックアップ

```
wordmove pull --all
```

### デプロイ時の細かいオプションについては下記記事参照

[Wordmoveの基本操作](https://qiita.com/mrymmh/items/c644934cac386d95b7df)
