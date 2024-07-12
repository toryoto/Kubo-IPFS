# IPFS Project with Kubo

## 概要

分散型ファイルシステムであるIPFS（InterPlanetary File System）を使用して、データの保存と取得を行うアプリケーションのデモンストレーション。特に、IPFS実装の一つである「Kubo」（旧go-ipfs）を使用。

## IPFS とは

IPFSは、コンテンツアドレス可能な P2P 方式のファイル共有ネットワーク。従来の位置ベースのアドレス指定（HTTP等）ではなく、コンテンツ自体に基づいてデータを識別・取得する。

主な特徴：
- 分散型：中央サーバーに依存しない
- 耐障害性：データが複数ノードに分散して保存される
- 効率的：重複データの削除、効率的な転送
- バージョン管理：ファイルの変更履歴を追跡可能

## Kubo IPFS について

Kuboは、IPFSプロトコルのGo言語による実装です。以下の特徴がある：

- 高性能：Go言語で書かれており、効率的に動作
- 豊富な機能：コマンドラインツールとライブラリの両方を提供
- アクティブな開発：定期的なアップデートとコミュニティサポート

## セットアップ

1. Kubo のインストール:
   ```
   # Ubuntu
   wget https://dist.ipfs.tech/kubo/v0.18.1/kubo_v0.18.1_linux-amd64.tar.gz
   tar -xvzf kubo_v0.18.1_linux-amd64.tar.gz
   cd kubo
   sudo bash install.sh
   ```

2. IPFS ノードの初期化:
   ```
   ipfs init
   ```

3. IPFS デーモンの起動:
   ```
   ipfs daemon
   ```

## 基本的な使用方法

1. ファイルの追加:
   ```
   ipfs add <file_path>
   ```

2. ファイルの取得:
   ```
   ipfs cat <CID>
   ```

3. ファイルのピン留め（永続化）:
   ```
   ipfs pin add <CID>
   ```

## 注意点

- IPFSネットワークにアップロードされたデータは公開される。
