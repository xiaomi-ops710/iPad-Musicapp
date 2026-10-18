# Music (iPad PWA)

iPadOS風ミュージックアプリ。ビルド不要の静的サイトです。

## GitHub Pagesで公開
1. このフォルダの中身をリポジトリのルートに push
2. Settings → Pages → Branch: `main` / `/ (root)`
3. 公開URLをiPadのSafariで開き、共有 → 「ホーム画面に追加」

## 音源
- iTunes Search API: 30秒プレビュー（検索・アルバム・ステーション）
- Audius API: フル尺の再生（検索・トレンド・ステーション）
- Internet Archive: フル尺mp3（アルバム単位で開いて再生、キー不要）
- Wikimedia Commons: パブリックドメイン/CC音源のフル再生（キー不要。oggはiPadで再生できない場合あり）
- Jamendo: CC音源のフル再生（無料のclient_idを検索画面で設定）
- 端末アップロード: mp3/m4a/flac/wav/ogg（ID3のタイトル・アーティスト・ジャケットをIndexedDBに保存）
- URL追加: 直接再生できる音声ファイルのURL
