'use strict';
/* ============ ユーティリティ ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ja = (navigator.language || '').toLowerCase().startsWith('ja');
const T = {
  search: ['検索', 'Search'], home: ['ホーム', 'Home'], new: ['新着', 'New'], radio: ['ラジオ', 'Radio'],
  library: ['ライブラリ', 'Library'], pins: ['ピン', 'Pins'], recentAdded: ['最近追加した項目', 'Recently Added'], topPlayed: ['よく再生した項目', 'Most Played'], heavy: ['ヘビーローテーション', 'Heavy Rotation'], hist: ['最近の検索', 'Recent Searches'], clear: ['消去', 'Clear'],
  artists: ['アーティスト', 'Artists'], albums: ['アルバム', 'Albums'], songs: ['曲', 'Songs'],
  uploaded: ['アップロード済み', 'Uploaded'], playlists: ['プレイリスト', 'Playlists'], allPl: ['すべてのプレイリスト', 'All Playlists'],
  fav: ['お気に入りの曲', 'Favorite Songs'], edit: ['編集', 'Edit'], done: ['完了', 'Done'],
  topPicks: ['あなたへのおすすめ', 'Top Picks for You'], recent: ['最近再生した項目', 'Recently Played'],
  browse: ['カテゴリを見る', 'Browse Categories'], searchPh: ['アーティスト、曲、アルバム', 'Artists, Songs, Albums'],
  newPl: ['新規プレイリスト', 'Create New Playlist'], newFolder: ['新規フォルダ', 'Create New Folder'],
  play: ['再生', 'Play'], shuffle: ['シャッフル', 'Shuffle'], upload: ['曲をアップロード', 'Upload Songs'],
  addUrl: ['URLから追加', 'Add from URL'], madeFor: ['あなたのために', 'Made for You'], station: ['のステーション', "'s Station"],
  moodFor: ['今の気分に', 'Mood for You'], relax: ['リラックス', 'Relax'], relaxD: ['心を落ち着かせるサウンド', 'Soothing sounds to help you unwind'],
  charts: ['ヒットチャート', 'Hit Albums'], trending: ['トレンド（Audius・フル再生）', 'Trending (Audius · full tracks)'],
  noRecent: ['再生した曲がここに表示されます', 'Songs you play will appear here'],
  noSongs: ['ライブラリに曲がありません。<br>「曲をアップロード」またはストアから追加してください。', 'Your library is empty.<br>Upload songs or add them from search.'],
  loading: ['読み込み中…', 'Loading…'], err: ['取得できませんでした。通信状況を確認してください。', 'Could not load. Check your connection.'],
  noRes: ['結果が見つかりません', 'No results'], name: ['あなた', 'You'], nothing: ['再生中の項目なし', 'Not Playing'],
  playNext: ['次に再生', 'Play Next'], playLast: ['最後に再生', 'Play Last'], addLib: ['ライブラリに追加', 'Add to Library'],
  rmLib: ['ライブラリから削除', 'Remove from Library'], addFav: ['お気に入りに追加', 'Favorite'], rmFav: ['お気に入りから削除', 'Unfavorite'],
  addPl: ['プレイリストに追加…', 'Add to Playlist…'], rmPl: ['プレイリストから削除', 'Remove from Playlist'],
  rename: ['名前を変更', 'Rename'], del: ['削除', 'Delete'], pin: ['サイドバーにピン留め', 'Pin to Sidebar'], unpin: ['ピンを外す', 'Unpin'],
  toFolder: ['フォルダへ移動…', 'Move to Folder…'], out: ['フォルダから出す', 'Remove from Folder'],
  cancel: ['キャンセル', 'Cancel'], plName: ['プレイリスト名', 'Playlist name'], fName: ['フォルダ名', 'Folder name'],
  urlPh: ['https://…/song.mp3', 'https://…/song.mp3'], titlePh: ['タイトル', 'Title'], yourName: ['表示名', 'Display name'],
  items: ['曲', 'items'], pls: ['プレイリスト', 'Playlists'], added: ['追加しました', 'Added'], lyrics: ['歌詞は利用できません', 'Lyrics not available'],
  queue: ['再生待ち', 'Up Next'], preview: ['30秒プレビュー', '30-sec preview'], full: ['フル再生', 'Full track'], local: ['端末内', 'On device'],
  unsupported: ['この曲は再生できませんでした', 'Could not play this track'], song: ['曲', 'Song'], album: ['アルバム', 'Album'],
  preparing: ['ステーションを準備中…', 'Preparing station…'], notFav: ['お気に入りの曲はまだありません', 'No favorites yet'], empPl: ['プレイリストは空です', 'This playlist is empty'],
  noPl: ['プレイリストがありません', 'No playlists'], songsN: ['曲', 'songs'], playlist: ['プレイリスト', 'Playlist'], folder: ['フォルダ', 'Folder'],
};
const t = k => (T[k] || [k, k])[ja ? 0 : 1];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, c = '') => `<svg class="ic ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const fmt = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const uid = p => p + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
const LS = { get: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ============ 状態 ============ */
const S = { mode: LS.get('mode', 'sidebar'), tab: 'home', route: 'home', stack: [], lists: {}, src: 'audius', q: '', sb: innerWidth > 1000, col: LS.get('col', {}), edit: false, tok: 0, lk: 0 };
let playlists = LS.get('pl', []);
let favs = new Set(LS.get('fav', []));
let recent = LS.get('recent', []);
let cnt = LS.get('cnt', {}); let shist = LS.get('shist', []);
const topTracks = n => Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([id]) => { const m = recent.find(r => r.id === id); return m ? unslim(m) : lib.get(id); }).filter(Boolean).slice(0, n);
let pins = LS.get('pins', []);
let uname = LS.get('name', '');
const lib = new Map();
const saveAll = () => { LS.set('pl', playlists); LS.set('fav', [...favs]); LS.set('recent', recent); LS.set('pins', pins); LS.set('col', S.col); };

/* ============ IndexedDB ============ */
const idb = {
  db: null,
  init() { return new Promise(res => { try { const r = indexedDB.open('music-pwa', 1); r.onupgradeneeded = () => r.result.createObjectStore('songs', { keyPath: 'id' }); r.onsuccess = () => { this.db = r.result; res(); }; r.onerror = () => res(); } catch { res(); } }); },
  all() { return new Promise(res => { if (!this.db) return res([]); const q = this.db.transaction('songs').objectStore('songs').getAll(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); }); },
  put(v) { return new Promise(res => { if (!this.db) return res(); try { const q = this.db.transaction('songs', 'readwrite').objectStore('songs').put(v); q.onsuccess = q.onerror = () => res(); } catch { res(); } }); },
  del(id) { return new Promise(res => { if (!this.db) return res(); const q = this.db.transaction('songs', 'readwrite').objectStore('songs').delete(id); q.onsuccess = q.onerror = () => res(); }); },
};

/* ============ トラック補助 ============ */
const urlCache = new Map();
const blobUrl = (id, k, b) => { const key = id + k; if (!urlCache.has(key)) urlCache.set(key, URL.createObjectURL(b)); return urlCache.get(key); };
const artUrl = tr => !tr || !tr.art ? null : (tr.art instanceof Blob ? blobUrl(tr.id, 'a', tr.art) : tr.art);
const audioUrl = tr => tr.blob ? blobUrl(tr.id, 's', tr.blob) : tr.url;
const hue = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const cov = (tr, cls = '') => {
  const u = artUrl(tr);
  return u ? `<div class="cov ${cls}" style="background-image:url('${esc(u)}')"></div>`
    : `<div class="cov ${cls} gen" style="--h:${hue((tr && (tr.album || tr.title)) || 'x')}">${ic('note')}</div>`;
};
const slim = tr => tr.blob ? { id: tr.id, local: 1 } : { id: tr.id, title: tr.title, artist: tr.artist, album: tr.album, art: typeof tr.art === 'string' ? tr.art : null, url: tr.url, src: tr.src, dur: tr.dur, cid: tr.cid, yt: tr.yt };
const unslim = m => m.local ? lib.get(m.id) : m;
const fromIt = r => ({ id: 'it' + r.trackId, title: r.trackName, artist: r.artistName, album: r.collectionName || '', dur: 0, url: r.previewUrl, art: (r.artworkUrl100 || '').replace('100x100', '600x600') || null, src: 'itunes', cid: r.collectionId });
/* --- YouTube (公開のPiped / Invidiousインスタンス経由で検索・音声ストリーム取得。インスタンスは落ちることがあるため複数を並行して試す) --- */
const PIPED = ['https://pipedapi.kavin.rocks', 'https://pipedapi.adminforge.de', 'https://api.piped.private.coffee', 'https://pipedapi.leptons.xyz', 'https://pipedapi.nosebs.ru'];
const INV = ['https://yewtu.be', 'https://inv.nadeko.net', 'https://invidious.nerdvpn.de', 'https://invidious.privacyredirect.com'];
const anyOf = (urls, parse) => Promise.any(urls.map(async u => { const r = await fetch(u, { signal: AbortSignal.timeout(8000) }); if (!r.ok) throw new Error(r.status); return parse(await r.json(), u); }));
const ytTrack = (id, title, artist, dur, art) => ({ id: 'yt' + id, yt: id, title, artist: (artist || 'YouTube').replace(/ - Topic$/, ''), album: 'YouTube', dur: dur || 0, url: null, art: art || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, src: 'youtube' });
async function ytSearch(q) {
  const enc = encodeURIComponent(q);
  const run = async f => anyOf(PIPED.map(b => `${b}/search?q=${enc}&filter=${f}`), j => { const l = (j.items || []).filter(i => i.url && /watch\?v=/.test(i.url)); if (!l.length) throw 0; return l.map(i => ytTrack(i.url.split('v=')[1].split('&')[0], i.title, i.uploaderName, i.duration, i.thumbnail)); });
  try { return await run('music_songs'); } catch {}
  try { return await run('videos'); } catch {}
  return anyOf(INV.map(b => `${b}/api/v1/search?q=${enc}&type=video`), j => { if (!j.length) throw 0; return j.map(v => ytTrack(v.videoId, v.title, v.author, v.lengthSeconds, v.videoThumbnails && v.videoThumbnails[0] && v.videoThumbnails[0].url)); });
}
const ytCache = {};
async function ytStream(id) {
  if (ytCache[id]) return ytCache[id];
  let u;
  try { u = await anyOf(PIPED.map(b => `${b}/streams/${id}`), j => { const a = (j.audioStreams || []).filter(s => /mp4|aac|m4a/i.test(s.mimeType || '')).sort((x, y) => y.bitrate - x.bitrate)[0] || (j.audioStreams || [])[0]; if (!a) throw 0; return a.url; }); }
  catch { u = await anyOf(INV.map(b => `${b}/api/v1/videos/${id}?local=true`), (j, base) => { const a = (j.adaptiveFormats || []).filter(f => /audio\/mp4/.test(f.type || '')).sort((x, y) => (+y.bitrate) - (+x.bitrate))[0]; if (!a) throw 0; return a.url.startsWith('http') ? a.url : base + a.url; }); }
  return ytCache[id] = u;
}
const AUD = 'https://api.audius.co/v1';
const APP = 'ipad_music_pwa';
const fromAu = r => ({ id: 'au' + r.id, title: r.title, artist: r.user && r.user.name || '', album: r.genre || '', dur: r.duration || 0, url: `${AUD}/tracks/${r.id}/stream?app_name=${APP}`, art: r.artwork && (r.artwork['480x480'] || r.artwork['1000x1000'] || r.artwork['150x150']) || null, src: 'audius' });
const resolve = tr => lib.get(tr.id) || tr;

async function addToLib(tr, quiet) {
  if (lib.has(tr.id)) return;
  tr.added = Date.now(); lib.set(tr.id, tr);
  await idb.put(tr);
  if (!quiet) toast(t('added'));
}
async function removeFromLib(id) {
  lib.delete(id); await idb.del(id); favs.delete(id);
  playlists.forEach(p => p.songs && (p.songs = p.songs.filter(x => x !== id)));
  recent = recent.filter(m => m.id !== id); saveAll();
}

/* ============ 外部サービス ============ */
function jsonp(url) {
  return new Promise((res, rej) => {
    const cb = 'cb' + Math.random().toString(36).slice(2), s = document.createElement('script');
    window[cb] = d => { res(d); s.remove(); delete window[cb]; };
    s.onerror = () => { s.remove(); rej(new Error('jsonp')); };
    s.src = url + '&callback=' + cb; document.body.append(s);
    setTimeout(() => rej(new Error('timeout')), 12000);
  });
}
async function itunes(path) {
  const url = 'https://itunes.apple.com/' + path + (path.includes('?') ? '&' : '?') + 'country=' + (ja ? 'jp' : 'us') + (ja ? '&lang=ja_jp' : '');
  try { const r = await fetch(url); if (!r.ok) throw 0; return await r.json(); } catch { return jsonp(url); }
}
const itSongs = async (term, n = 25) => (await itunes(`search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=${n}`)).results.filter(r => r.previewUrl).map(fromIt);
const itAlbums = async (term, n = 12) => (await itunes(`search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=${n}`)).results;
async function auFetch(path) {
  const r = await fetch(`${AUD}${path}${path.includes('?') ? '&' : '?'}app_name=${APP}`); if (!r.ok) throw 0; return (await r.json()).data || [];
}
async function getJSON(url) { try { const r = await fetch(url); if (!r.ok) throw 0; return await r.json(); } catch { return jsonp(url); } }
const strip = h => String(h || '').replace(/<[^>]*>/g, '').trim();
const parseLen = s => { if (!s) return 0; s = String(s); return s.includes(':') ? s.split(':').map(Number).reduce((a, x) => a * 60 + x, 0) : (+s || 0); };
/* Internet Archive: 全曲フル(mp3)、キー不要 */
const iaSearch = async q => (await getJSON(`https://archive.org/advancedsearch.php?q=${encodeURIComponent('(' + q + ') AND mediatype:audio')}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&sort%5B%5D=downloads+desc&rows=30&output=json`)).response.docs;
async function iaItem(id) {
  const m = await getJSON(`https://archive.org/metadata/${encodeURIComponent(id)}`), md = m.metadata || {};
  const seen = new Set(), out = [];
  for (const f of (m.files || [])) {
    if (!/\.(mp3|m4a)$/i.test(f.name) || /_sample|_spectrogram/i.test(f.name)) continue;
    const title = f.title || f.name.replace(/^.*\//, '').replace(/\.[^.]+$/, ''), key = title.toLowerCase();
    if (seen.has(key)) continue; seen.add(key);
    out.push({ id: 'ia' + id + '/' + f.name, title, artist: f.creator || [].concat(md.creator || '').join(', ') || 'Internet Archive', album: md.title || id, dur: parseLen(f.length), url: `https://archive.org/download/${encodeURIComponent(id)}/${f.name.split('/').map(encodeURIComponent).join('/')}`, art: `https://archive.org/services/img/${encodeURIComponent(id)}`, src: 'archive', _n: f.name });
  }
  out.sort((a, b) => a._n.localeCompare(b._n, undefined, { numeric: true }));
  return { md, tracks: out };
}
/* Wikimedia Commons: パブリックドメイン/CC音源(フル)、キー不要 */
async function wcSearch(q) {
  const d = await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:audio ' + q)}&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiextmetadatafilter=Artist%7CObjectName&format=json&origin=*`);
  const pages = Object.values((d.query && d.query.pages) || {}).sort((a, b) => a.index - b.index);
  const list = pages.map(p => {
    const ii = p.imageinfo && p.imageinfo[0]; if (!ii || !/audio|ogg/.test(ii.mime || '')) return null;
    const em = ii.extmetadata || {};
    return { id: 'wc' + p.pageid, title: strip(em.ObjectName && em.ObjectName.value) || p.title.replace(/^File:/, '').replace(/\.[^.]+$/, ''), artist: strip(em.Artist && em.Artist.value) || 'Wikimedia Commons', album: 'Wikimedia Commons', dur: 0, url: ii.url, art: null, src: 'commons', _ok: /mpeg|mp4|mp3|wav/.test(ii.mime) };
  }).filter(Boolean);
  return list.filter(x => x._ok).concat(list.filter(x => !x._ok)); // iPadで再生しやすい形式を先頭に
}
/* Jamendo: CC音源フル再生(無料のclient_idが必要) */
const jamKey = () => LS.get('jamendo', '');
async function jamSearch(q) {
  const d = await getJSON(`https://api.jamendo.com/v3.0/tracks/?client_id=${encodeURIComponent(jamKey())}&format=json&limit=30&audioformat=mp32&imagesize=400&search=${encodeURIComponent(q)}`);
  if (d.headers && d.headers.status === 'failed') throw 0;
  return (d.results || []).map(r => ({ id: 'jm' + r.id, title: r.name, artist: r.artist_name, album: r.album_name || '', dur: r.duration || 0, url: r.audio, art: r.image || null, src: 'jamendo' }));
}
const auSearch = async (q, n = 25) => (await auFetch(`/tracks/search?query=${encodeURIComponent(q)}&limit=${n}`)).map(fromAu);
const auTrending = async n => (await auFetch(`/tracks/trending?limit=${n}`)).map(fromAu);

/* ============ ID3 (アップロード曲のタグ読み取り) ============ */
function decText(b) {
  if (!b.length) return '';
  const enc = b[0], body = b.subarray(1);
  let label = enc === 0 ? 'windows-1252' : enc === 1 ? 'utf-16le' : enc === 2 ? 'utf-16be' : 'utf-8';
  if (enc === 1 && body[0] === 0xFE && body[1] === 0xFF) label = 'utf-16be';
  try { return new TextDecoder(label).decode(body).replace(/\0+/g, '').replace(/^\uFEFF/, '').trim(); } catch { return ''; }
}
async function readTags(file) {
  const out = {};
  try {
    const buf = await file.slice(0, Math.min(file.size, 4e6)).arrayBuffer();
    const u8 = new Uint8Array(buf), d = new DataView(buf);
    if (String.fromCharCode(u8[0], u8[1], u8[2]) !== 'ID3') return out;
    const ver = u8[3], size = ((u8[6] & 127) << 21) | ((u8[7] & 127) << 14) | ((u8[8] & 127) << 7) | (u8[9] & 127);
    let p = 10; const end = Math.min(10 + size, buf.byteLength);
    while (p + 10 < end) {
      const id = String.fromCharCode(u8[p], u8[p + 1], u8[p + 2], u8[p + 3]);
      if (!/^[A-Z0-9]{4}$/.test(id)) break;
      const fs = ver === 4 ? ((u8[p + 4] & 127) << 21) | ((u8[p + 5] & 127) << 14) | ((u8[p + 6] & 127) << 7) | (u8[p + 7] & 127) : d.getUint32(p + 4);
      if (fs <= 0 || p + 10 + fs > buf.byteLength) break;
      const body = u8.subarray(p + 10, p + 10 + fs);
      if (id === 'TIT2') out.title = decText(body);
      else if (id === 'TPE1') out.artist = decText(body);
      else if (id === 'TALB') out.album = decText(body);
      else if (id === 'APIC') {
        const enc = body[0]; let i = 1, mime = '';
        while (i < body.length && body[i] !== 0) mime += String.fromCharCode(body[i++]);
        i += 2; // null + picture type
        if (enc === 1 || enc === 2) { while (i + 1 < body.length && !(body[i] === 0 && body[i + 1] === 0)) i += 2; i += 2; }
        else { while (i < body.length && body[i] !== 0) i++; i++; }
        if (i < body.length) out.art = new Blob([body.slice(i)], { type: /^image\//.test(mime) ? mime : 'image/jpeg' });
      }
      p += 10 + fs;
    }
  } catch {}
  return out;
}
function probeDuration(blob) {
  return new Promise(res => {
    const a = new Audio(), u = URL.createObjectURL(blob);
    const fin = v => { URL.revokeObjectURL(u); res(v); };
    a.preload = 'metadata'; a.onloadedmetadata = () => fin(isFinite(a.duration) ? a.duration : 0); a.onerror = () => fin(0);
    setTimeout(() => fin(0), 6000); a.src = u;
  });
}
async function importFiles(files) {
  const list = [...files].filter(f => f.type.startsWith('audio/') || /\.(mp3|m4a|aac|flac|wav|ogg|opus)$/i.test(f.name));
  if (!list.length) return;
  let n = 0;
  for (const f of list) {
    toast(`${t('upload')} ${++n}/${list.length}`, 60000);
    const tags = await readTags(f);
    const tr = { id: uid('up'), title: tags.title || f.name.replace(/\.[^.]+$/, ''), artist: tags.artist || (ja ? '不明なアーティスト' : 'Unknown Artist'), album: tags.album || (ja ? '不明なアルバム' : 'Unknown Album'), dur: await probeDuration(f), blob: f, art: tags.art || null, src: 'upload' };
    await addToLib(tr, true);
  }
  toast(`${list.length} ${t('items')} ${t('added')}`); render();
}

/* ============ プレイヤー ============ */
const au = $('#au');
const P = { q: [], i: -1, shuffle: false, repeat: 0, hist: [] };
const cur = () => P.q[P.i];
function play(list, i) { P.q = list.slice(); P.i = i; P.hist = []; load(); }
function load() {
  const tr = cur(); if (!tr) return;
  if (tr.src === 'youtube' && !tr.blob) {
    au.pause(); au.removeAttribute('src'); const id = tr.id; toast(ja ? 'YouTubeから読み込み中…' : 'Loading from YouTube…', 6000);
    ytStream(tr.yt).then(u => { if (cur() && cur().id === id) { au.src = u; au.play().catch(() => {}); } }).catch(() => { if (cur() && cur().id === id) toast(ja ? 'YouTubeの音声を取得できませんでした(公開サーバーが混雑している可能性があります)' : 'Could not get YouTube audio (public servers may be busy)', 4000); });
  } else { au.src = audioUrl(tr); au.play().catch(() => {}); }
  recent = [slim(tr), ...recent.filter(m => m.id !== tr.id)].slice(0, 60); LS.set('recent', recent);
  cnt[tr.id] = (cnt[tr.id] || 0) + 1; LS.set('cnt', cnt);
  sess(tr); ui();
}
function toggle() { if (!cur()) return; au.paused ? au.play().catch(() => {}) : au.pause(); }
function next(auto) {
  if (!P.q.length) return;
  if (auto && P.repeat === 2) { au.currentTime = 0; au.play(); return; }
  if (P.shuffle && P.q.length > 1) { P.hist.push(P.i); let j; do j = Math.random() * P.q.length | 0; while (j === P.i); P.i = j; }
  else if (P.i + 1 < P.q.length) { P.hist.push(P.i); P.i++; }
  else if (P.repeat === 1) { P.hist.push(P.i); P.i = 0; }
  else if (auto && P.auto && !P.fetching) { P.fetching = 1; const c = cur(); auSearch(c.artist, 12).then(l => { const have = new Set(P.q.map(x => x.id)); l = l.filter(x => !have.has(x.id)); if (l.length) { P.q.push(...l); P.hist.push(P.i); P.i++; load(); } else { au.pause(); ui(); } }).catch(() => { au.pause(); ui(); }).finally(() => P.fetching = 0); return; }
  else { au.pause(); au.currentTime = 0; ui(); return; }
  load();
}
function prev() {
  if (au.currentTime > 3 || (!P.hist.length && P.i <= 0)) { au.currentTime = 0; return; }
  P.i = P.hist.length ? P.hist.pop() : P.i - 1; load();
}
au.addEventListener('play', () => { document.body.classList.add('playing'); ui(); });
au.addEventListener('pause', () => { document.body.classList.remove('playing'); ui(); });
au.addEventListener('ended', () => { if (S.sleepEnd) { S.sleepEnd = false; au.pause(); ui(); return; } next(true); });
au.addEventListener('timeupdate', tick);
au.addEventListener('loadedmetadata', () => { const tr = cur(); if (tr && isFinite(au.duration) && !tr.dur) tr.dur = au.duration; tick(); });
au.addEventListener('error', () => { if (cur()) { toast(t('unsupported')); setTimeout(() => P.i + 1 < P.q.length && next(), 800); } });
function sess(tr) {
  if (!('mediaSession' in navigator)) return;
  try {
    const u = artUrl(tr);
    navigator.mediaSession.metadata = new MediaMetadata({ title: tr.title, artist: tr.artist, album: tr.album || '', artwork: u ? [{ src: u, sizes: '512x512' }] : [] });
    const h = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch {} };
    h('play', toggle); h('pause', toggle); h('previoustrack', prev); h('nexttrack', () => next());
    h('seekto', e => { au.currentTime = e.seekTime; });
  } catch {}
}

/* ============ ミニプレイヤー / Now Playing ============ */
const mini = $('#mini'), np = $('#np');
mini.innerHTML = `
  <button class="ib hide-s" data-m="shuffle" aria-label="shuffle">${ic('shuffle')}</button>
  <button class="ib" data-m="prev">${ic('back')}</button>
  <button class="ib big" data-m="toggle"></button>
  <button class="ib" data-m="next">${ic('fwd')}</button>
  <button class="ib hide-s" data-m="repeat"></button>
  <div class="mi" data-m="open"></div>
  <button class="ib hide-s" data-m="more">${ic('ellipsis')}</button>
  <button class="ib hide-s" data-m="lyrics">${ic('quote')}</button>
  <button class="ib" data-m="queue">${ic('list')}</button>
  <div class="prog"><i></i></div>`;
np.innerHTML = `
  <div class="npbg"></div><div class="npgrab" data-n="close"></div>
  <div class="npbody"><div class="npstage"><div class="npart"></div><div class="nppanel"></div></div>
  <div class="npctl">
    <div class="nptitle"><div><b id="npt"></b><small id="npa" data-n="artist" style="cursor:pointer"></small></div>
      <button class="ib glass fav" data-n="fav">${ic('star')}</button><button class="ib glass" data-n="more">${ic('ellipsis')}</button></div>
    <input type="range" id="seek" min="0" max="1000" value="0" style="margin-top:14px">
    <div class="times"><span id="tc">0:00</span><span id="npfmt"></span><span id="tr">-0:00</span></div>
    <div class="npbtns"><button class="ib sm" data-n="shuffle">${ic('shuffle')}</button><button class="ib" data-n="prev">${ic('back')}</button>
      <button class="ib big" data-n="toggle"></button><button class="ib" data-n="next">${ic('fwd')}</button><button class="ib sm" data-n="repeat"></button></div>
    <div class="vol">${ic('spk')}<input type="range" id="vol" min="0" max="1" step="0.01" value="1">${ic('spkw')}</div>
    <div class="npfoot"><button data-n="lyrics">${ic('quote')}</button><button data-n="route">${ic('headphones')}<small>${ja ? 'このデバイス' : 'This Device'}</small></button><button data-n="queue">${ic('list')}</button></div>
  </div></div>`;
let seeking = false;
const seek = $('#seek'), vol = $('#vol');
const setP = (el, v) => el.style.setProperty('--p', v + '%');
seek.addEventListener('input', () => { seeking = true; setP(seek, seek.value / 10); $('#tc').textContent = fmt(seek.value / 1000 * au.duration); });
seek.addEventListener('change', () => { if (isFinite(au.duration)) au.currentTime = seek.value / 1000 * au.duration; seeking = false; });
vol.addEventListener('input', () => { au.volume = +vol.value; setP(vol, vol.value * 100); });
setP(vol, 100);

function tick() {
  lyricSync();
  preNext(); saveResume();
  const d = au.duration, c = au.currentTime;
  const p = isFinite(d) && d > 0 ? c / d : 0;
  mini.querySelector('.prog i').style.setProperty('--p', p * 100 + '%');
  if (!seeking) { seek.value = p * 1000; setP(seek, p * 100); $('#tc').textContent = fmt(c); $('#tr').textContent = '-' + fmt((isFinite(d) ? d : 0) - c); }
}
let preFor = null, preA = null, lastSave = 0;
function preNext() {
  const d = au.duration; if (!isFinite(d) || d - au.currentTime > 20 || P.shuffle) return;
  const n = P.q[P.i + 1]; if (!n || n.blob || n.src === 'youtube' || preFor === n.id) return;
  preFor = n.id; try { preA = new Audio(); preA.preload = 'auto'; preA.src = audioUrl(n); } catch {}
}
function saveResume() {
  const now = Date.now(); if (now - lastSave < 4000 || !cur()) return; lastSave = now;
  try { LS.set('resume', { q: P.q.slice(0, 80).map(slim), i: Math.min(P.i, 79), t: au.currentTime }); } catch {}
}
function restoreResume() {
  const r = LS.get('resume', null); if (!r || !r.q) return;
  const q = r.q.map(unslim).filter(Boolean); if (!q.length || !q[r.i]) return;
  P.q = q; P.i = r.i; const tr = cur();
  if (tr.src === 'youtube') { sess(tr); ui(); return; }
  au.src = audioUrl(tr); au.addEventListener('loadedmetadata', () => { try { au.currentTime = r.t || 0; } catch {} }, { once: true });
  sess(tr); ui();
}
document.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  else if (e.shiftKey && e.key === 'ArrowRight') next();
  else if (e.shiftKey && e.key === 'ArrowLeft') prev();
});
if ('webkitCurrentPlaybackTargetIsWireless' in au) au.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', () => { const s = $('[data-n=route] small', np); if (s) s.textContent = au.webkitCurrentPlaybackTargetIsWireless ? 'AirPlay' : (ja ? 'このデバイス' : 'This Device'); });
function ui() {
  const tr = cur(), playing = !au.paused && !!tr;
  const pi = ic(playing ? 'pause' : 'play');
  $('[data-m=toggle]', mini).innerHTML = pi; $('[data-n=toggle]', np).innerHTML = pi;
  const rp = ic(P.repeat === 2 ? 'repeat1' : 'repeat');
  $('[data-m=repeat]', mini).innerHTML = rp; $('[data-n=repeat]', np).innerHTML = rp;
  [['shuffle', P.shuffle], ['repeat', P.repeat > 0]].forEach(([k, on]) => { $(`[data-m=${k}]`, mini).classList.toggle('on', on); $(`[data-n=${k}]`, np).classList.toggle('on', on); $(`[data-m=${k}]`, mini).classList.toggle('dim', !on); });
  $('.mi', mini).innerHTML = tr ? `${cov(tr)}<div class="mt"><b>${esc(tr.title)}</b><small>${esc(tr.artist)}</small></div>` : `<div class="mt"><b style="color:var(--fg2)">${t('nothing')}</b></div>`;
  if (tr) {
    $('#npt').textContent = tr.title; $('#npa').textContent = tr.artist;
    $('.npart', np).innerHTML = cov(tr, 'xl');
    const u = artUrl(tr), bg = $('.npbg', np);
    bg.classList.toggle('gen', !u); bg.style.setProperty('--h', hue(tr.album || tr.title)); bg.style.backgroundImage = u ? `url('${u}')` : '';
    $('#npfmt').textContent = tr.src === 'itunes' ? t('preview') : tr.src === 'upload' ? t('local') : t('full');
    const f = $('[data-n=fav]', np); f.innerHTML = ic(favs.has(tr.id) ? 'starfill' : 'star'); f.classList.toggle('on', favs.has(tr.id));
    f.style.color = favs.has(tr.id) ? '#ffd60a' : '';
  }
  $$('.tr[data-tid]').forEach(r => r.classList.toggle('now', !!tr && r.dataset.tid === tr.id));
  if (np.classList.contains('mode-queue')) npPanel('queue');
  if (np.classList.contains('mode-lyrics') && S.lyFor !== (tr && tr.id)) npPanel('lyrics');
}
function npPanel(mode) {
  const el = $('.nppanel', np), tr = cur();
  if (mode === 'lyrics') {
    S.lyFor = tr && tr.id; lyLines = null; lyIdx = -1;
    if (!tr) { el.innerHTML = `<div class="ly">${t('lyrics')}</div>`; return; }
    el.innerHTML = `<div class="ly">${ja ? '歌詞を検索中…' : 'Searching lyrics…'}</div>`;
    fetchLyrics(tr).then(L => {
      if (!cur() || cur().id !== tr.id || !np.classList.contains('mode-lyrics')) return;
      if (L && L.synced && tr.src !== 'itunes') { lyLines = L.synced; el.innerHTML = `<div class="lyw">${L.synced.map(l => `<div class="lyl" data-t="${l.t}">${esc(l.x) || '♪'}</div>`).join('')}</div>`; }
      else if (L && (L.plain || L.synced)) { const txt = L.plain || L.synced.map(l => l.x).join('\n'); el.innerHTML = `<div class="lyw lyp">${esc(txt).replace(/\n/g, '<br>')}</div>`; }
      else el.innerHTML = `<div class="ly">${t('lyrics')}</div>`;
      lyricSync(true);
    });
  } else {
    const k = reg(P.q);
    el.innerHTML = `<h3><span>${t('queue')}</span><button class="pbtn glass" data-act="qclear">${ja ? '次の曲を消去' : 'Clear Next'}</button></h3><div class="tl">` + P.q.map((x, i) => rowHTML(x, i, k, { cur: i === P.i, noMore: 1, qrm: i !== P.i })).join('') + '</div>';
  }
}
function npMode(m) {
  const on = !np.classList.contains('mode-' + m);
  np.classList.remove('mode-lyrics', 'mode-queue');
  $$('.npfoot button', np).forEach(b => b.classList.remove('on'));
  if (on) { np.classList.add('mode-' + m); npPanel(m); $(`[data-n=${m}]`, np).classList.add('on'); }
}
function openNP(m) {
  if (!cur()) return;
  np.classList.add('open'); document.body.classList.add('np-open');
  if (m) { np.classList.remove('mode-lyrics', 'mode-queue'); npMode(m); }
}
function closeNP() { np.classList.remove('open'); document.body.classList.remove('np-open'); }
// 下スワイプで閉じる
let sy = null;
np.addEventListener('touchstart', e => { if (!e.target.closest('input,.nppanel')) sy = e.touches[0].clientY; }, { passive: true });
np.addEventListener('touchmove', e => { if (sy == null) return; const dy = e.touches[0].clientY - sy; if (dy > 0) { np.style.transition = 'none'; np.style.transform = `translateY(${dy}px) scale(${1 - dy / 3000})`; } }, { passive: true });
np.addEventListener('touchend', e => { if (sy == null) return; const dy = e.changedTouches[0].clientY - sy; sy = null; np.style.transition = ''; np.style.transform = ''; if (dy > 120) closeNP(); });

function ctl(k) {
  if (k === 'toggle') toggle(); else if (k === 'next') next(); else if (k === 'prev') prev();
  else if (k === 'shuffle') { P.shuffle = !P.shuffle; ui(); }
  else if (k === 'repeat') { P.repeat = (P.repeat + 1) % 3; ui(); }
}
mini.addEventListener('click', e => {
  const b = e.target.closest('[data-m]'); if (!b) return; const k = b.dataset.m;
  if (k === 'open') openNP(); else if (k === 'lyrics' || k === 'queue') openNP(k);
  else if (k === 'more') { if (cur()) { const r = b.getBoundingClientRect(); trackMenu(cur(), r.left, r.top - 8, null, true); } }
  else ctl(k);
});
np.addEventListener('click', e => {
  const ll = e.target.closest('.lyl'); if (ll) { au.currentTime = +ll.dataset.t; au.play().catch(() => {}); return; }
  const b = e.target.closest('[data-n]'); if (!b) return; const k = b.dataset.n;
  if (k === 'close') closeNP(); else if (k === 'lyrics' || k === 'queue') npMode(k);
  else if (k === 'fav') { const tr = cur(); if (tr) toggleFav(tr); }
  else if (k === 'more') { if (cur()) { const r = b.getBoundingClientRect(); trackMenu(cur(), r.right - 240, r.bottom + 6, null, true); } }
  else if (k === 'route') { if (au.webkitShowPlaybackTargetPicker) au.webkitShowPlaybackTargetPicker(); else toast(ja ? 'AirPlayはSafariでのみ利用できます' : 'AirPlay is available in Safari only'); }
  else if (k === 'artist') { const tr = cur(); if (tr && tr.artist) { closeNP(); go('iartist:' + tr.artist); } }
  else ctl(k);
});
async function toggleFav(tr) {
  tr = resolve(tr);
  if (favs.has(tr.id)) favs.delete(tr.id); else { await addToLib(tr, true); favs.add(tr.id); }
  saveAll(); ui(); if (S.route === 'fav') render();
}

/* ============ トースト / メニュー / ダイアログ ============ */
let tt;
function toast(msg, ms = 2200) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), ms); }
const menuEl = $('#menu');
function menu(x, y, items) {
  menuEl.innerHTML = items.map((it, i) => it === '-' ? '<hr>' : `<button data-i="${i}" class="${it.danger ? 'dg' : ''}">${it.icon ? ic(it.icon) : '<span style="width:22px"></span>'}<span>${esc(it.label)}</span></button>`).join('');
  menuEl._items = items; menuEl._pos = [x, y];
  menuEl.classList.add('show');
  const w = Math.min(300, menuEl.offsetWidth || 260), h = menuEl.offsetHeight;
  const L = Math.max(10, Math.min(x, innerWidth - w - 10));
  let Tp = y; if (Tp + h > innerHeight - 10) Tp = Math.max(10, y - h - 40);
  menuEl.style.left = L + 'px'; menuEl.style.top = Tp + 'px';
  menuEl.style.setProperty('--ox', Math.max(0, x - L) + 'px'); menuEl.style.setProperty('--oy', '0px');
}
const closeMenu = () => menuEl.classList.remove('show');
menuEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const it = menuEl._items[+b.dataset.i];
  if (it.sub) { menu(menuEl._pos[0], menuEl._pos[1], [{ label: it.label, icon: 'chevl', act: () => 0, back: 1 }, '-', ...it.sub]); return; }
  closeMenu(); it.act && it.act();
});
document.addEventListener('pointerdown', e => { if (!e.target.closest('#menu')) closeMenu(); }, true);
function ask(title, ph = '', val = '', ph2) {
  return new Promise(res => {
    const m = $('#modal');
    m.innerHTML = `<div class="dlg glass"><h3>${esc(title)}</h3>${ph2 !== undefined ? `<input id="ask2" placeholder="${esc(ph2)}">` : ''}<input id="ask1" placeholder="${esc(ph)}" value="${esc(val)}"><div class="btns"><button data-v="0">${t('cancel')}</button><button data-v="1" class="pri">OK</button></div></div>`;
    m.classList.add('show'); setTimeout(() => $('#ask1').focus(), 80);
    const done = ok => { m.classList.remove('show'); const a = $('#ask1').value.trim(), b = $('#ask2') ? $('#ask2').value.trim() : ''; res(ok && a ? (ph2 !== undefined ? [a, b] : a) : null); };
    m.onclick = e => { const b = e.target.closest('button'); if (b) done(b.dataset.v === '1'); else if (e.target === m) done(false); };
    m.onkeydown = e => { if (e.key === 'Enter') done(true); };
  });
}

/* ============ 共通UI部品 ============ */
const reg = list => { const k = 'l' + (++S.lk); S.lists[k] = list; return k; };
function rowHTML(tr, i, k, o = {}) {
  return `<div class="tr${o.cur ? ' now' : ''}" data-act="play" data-l="${k}" data-i="${i}" data-tid="${esc(tr.id)}">${o.num ? `<span class="tn">${i + 1}</span>` : cov(tr, 'sm')}<div class="ti"><b>${esc(tr.title)}</b><small>${esc(tr.artist)}${tr.album && !o.noAlbum ? ' — ' + esc(tr.album) : ''}</small></div><span class="td">${tr.dur ? fmt(tr.dur) : ''}</span>${o.qrm ? `<button class="ib" data-act="qrm" data-i="${i}">${ic('xmark')}</button>` : o.noMore ? '' : `<button class="ib" data-act="more" data-l="${k}" data-i="${i}">${ic('ellipsis')}</button>`}</div>`;
}
function rows(list, o = {}) {
  const k = reg(list), c = cur();
  return `<div class="tl">${list.map((tr, i) => rowHTML(tr, i, k, { ...o, cur: c && c.id === tr.id })).join('')}</div>`;
}
const head = (title, right = '', back) => `<header class="ph"><div style="display:flex;align-items:center">${back ? `<button class="ib backb" data-act="back">${ic('chevl')}</button>` : ''}<h1>${esc(title)}</h1></div><div class="pha">${right}<button class="pav" data-act="account" aria-label="Account">${ic('person')}</button></div></header>`;
const spinner = `<div class="ctr"><svg class="ios-spin" viewBox="0 0 40 40" aria-label="Loading">${[...Array(8)].map((_, i) => `<rect x="18" y="2.500" width="4" height="10" rx="2" transform="rotate(${i * 45} 20 20)" opacity="${(.18 + i * .115).toFixed(2)}"/>`).join('')}</svg></div>`;
const tile = (img, title, sub, attrs, tr) => `<div class="tile" ${attrs}>${img ? `<div class="cov" style="background-image:url('${esc(img)}')"></div>` : cov(tr)}<b>${esc(title)}</b><small>${esc(sub || '')}</small></div>`;
const albumTile = r => tile((r.artworkUrl100 || '').replace('100x100', '400x400'), r.collectionName, r.artistName, `data-act="go" data-r="ialbum:${r.collectionId}"`);
const emptyHTML = (icon, msg) => `<div class="empty">${ic(icon)}${msg}</div>`;
function openTrackMenu(el, x, y) {
  const k = el.dataset.l, i = +el.dataset.i; const list = S.lists[k]; if (!list) return;
  trackMenu(list[i], x, y, list);
}
async function saveOffline(r) {
  toast(ja ? '保存中…' : 'Saving…', 20000);
  try {
    const res = await fetch(audioUrl(r)); if (!res.ok) throw 0;
    const blob = await res.blob(); if (!blob.size) throw 0;
    const o = { ...r, blob, dl: 1, added: r.added || Date.now() }; delete o.url;
    if (typeof r.art === 'string' && r.art.startsWith('http')) { try { const ar = await fetch(r.art); if (ar.ok) o.art = await ar.blob(); } catch {} }
    lib.set(o.id, o); await idb.put(o); toast(ja ? 'オフライン用に保存しました' : 'Saved for offline'); render();
  } catch { toast(ja ? 'この曲は保存できません(配信元が許可していません)' : 'This track cannot be saved (blocked by source)', 3500); }
}
function songInfo(r) {
  const m = $('#modal'), f = (l, v) => v ? `<div class="srw"><span>${l}</span><em>${esc(String(v))}</em></div>` : '';
  const SRC = { itunes: 'iTunes (30s)', youtube: 'YouTube', audius: 'Audius', upload: ja ? '端末' : 'This device', archive: 'Internet Archive', commons: 'Wikimedia Commons', jamendo: 'Jamendo', url: 'URL' };
  m.innerHTML = `<div class="dlg glass info"><div class="ihead">${cov(r, 'sm')}<div><b>${esc(r.title)}</b><small>${esc(r.artist)}</small></div></div><div class="sgp">${f(ja ? 'アルバム' : 'Album', r.album)}${f(ja ? '長さ' : 'Duration', r.dur ? fmt(r.dur) : '')}${f(ja ? '配信元' : 'Source', SRC[r.src] || r.src)}${f(ja ? '再生回数' : 'Plays', cnt[r.id] || 0)}${f(ja ? '保存' : 'Storage', r.blob ? (ja ? 'この端末(' + (r.blob.size / 1048576).toFixed(1) + ' MB)' : 'On device (' + (r.blob.size / 1048576).toFixed(1) + ' MB)') : (ja ? 'ストリーミング' : 'Streaming'))}${f(ja ? '形式' : 'Format', r.blob ? r.blob.type : '')}</div><div class="btns"><button data-v="1" class="pri">${t('done')}</button></div></div>`;
  m.classList.add('show'); m.onclick = e => { if (e.target === m || e.target.closest('button')) m.classList.remove('show'); };
}
function trackMenu(tr, x, y, list, fromPlayer) {
  const r = resolve(tr), inl = lib.has(r.id), isFav = favs.has(r.id);
  const items = [
    { label: t('playNext'), icon: 'next', act: () => { P.q.splice(P.i + 1, 0, r); if (P.i < 0) { P.i = 0; load(); } toast(t('added')); } },
    { label: t('playLast'), icon: 'list', act: () => { P.q.push(r); if (P.i < 0) { P.i = 0; load(); } toast(t('added')); } },
    '-',
    { label: isFav ? t('rmFav') : t('addFav'), icon: isFav ? 'starfill' : 'star', act: () => toggleFav(r) },
    { label: t('addPl'), icon: 'plnote', sub: playlists.filter(p => !p.folder).map(p => ({ label: p.name, icon: 'plnote', act: async () => { await addToLib(r, true); p.songs = p.songs || []; if (!p.songs.includes(r.id)) p.songs.push(r.id); saveAll(); toast(t('added')); } })).concat([{ label: t('newPl'), icon: 'plus', act: async () => { const n = await ask(t('newPl'), t('plName')); if (n) { await addToLib(r, true); playlists.push({ id: uid('pl'), name: n, songs: [r.id] }); saveAll(); renderSidebar(); toast(t('added')); } } }]) },
  ];
  items.push('-', { label: ja ? 'アーティストに移動' : 'Go to Artist', icon: 'person2', act: () => { if (fromPlayer) closeNP(); go('iartist:' + r.artist); } });
  if (r.cid) items.push({ label: ja ? 'アルバムに移動' : 'Go to Album', icon: 'stack', act: () => { if (fromPlayer) closeNP(); go('ialbum:' + r.cid); } });
  items.push({ label: ja ? '共有…' : 'Share…', icon: 'share', act: () => doShare(r.title, r.title + ' - ' + r.artist, shareUrl(r)) });
  items.push({ label: ja ? '情報を見る' : 'Get Info', icon: 'infoc', act: () => songInfo(r) });
  if (!r.blob) items.push({ label: ja ? 'オフライン用に保存' : 'Save for Offline', icon: 'download', act: () => saveOffline(r) });
  else if (r.dl) items.push({ label: ja ? 'オフライン保存済み' : 'Saved Offline', icon: 'check', act: () => {} });
  if (!inl) items.push({ label: t('addLib'), icon: 'plus', act: () => addToLib(r) });
  else items.push({ label: t('rmLib'), icon: 'trash', danger: true, act: async () => { await removeFromLib(r.id); render(); } });
  const m = /^pl:(.+)$/.exec(S.route);
  if (m && !fromPlayer) { const p = playlists.find(p => p.id === m[1]); if (p) items.push({ label: t('rmPl'), icon: 'xmark', act: () => { p.songs = p.songs.filter(id => id !== r.id); saveAll(); render(); } }); }
  if (fromPlayer) items.push('-', { label: ja ? '自動再生' + (P.auto ? '：オン' : '：オフ') : 'Autoplay' + (P.auto ? ': On' : ': Off'), icon: 'infinity', act: () => { P.auto = !P.auto; toast(P.auto ? (ja ? '自動再生をオンにしました' : 'Autoplay on') : (ja ? '自動再生をオフにしました' : 'Autoplay off')); } }, speedItem(), sleepItem(), glassItem(), settingsItem());
  menu(x, y, items);
}

/* ============ ナビゲーション ============ */
const main = $('#main');
function go(r) { S.stack = []; nav(r, false); }
function nav(r, push = true) {
  if (push) S.stack.push(S.route);
  S.route = r; if (innerWidth <= 1000) setSB(false);
  renderSidebar(); render(); main.scrollTo(0, 0);
}
function back() { const r = S.stack.pop(); if (r) { S.route = r; renderSidebar(); render(); } }
function setSB(v) { S.sb = v; document.body.classList.toggle('sb', v); rfKick(900); }

function render() {
  S.lists = {}; S.lk = 0; S.tok++;
  const el = document.createElement('div'); el.className = 'page'; main.replaceChildren(el);
  const [k, arg] = S.route.split(/:(.*)/s);
  const fn = { home: vHome, search: vSearch, new: vNew, radio: vRadio, iartist: vIArtist, library: vLibrary, recent: vRecentAdded, top: vTop, artists: vArtists, albums: vAlbums, songs: vSongs, uploads: vUploads, playlists: vPlaylists, fav: vFav, pl: vPl, folder: vFolder, ialbum: vIAlbum, iaitem: vIAItem, lalbum: vLAlbum, lartist: vLArtist }[k] || vHome;
  fn(el, arg, S.tok);
}

/* ============ サイドバー ============ */
const NAV = [['search', 'search', 'search'], ['home', 'house', 'home'], ['new', 'grid', 'new'], ['radio', 'radio', 'radio']];
const LIBN = [['recent', 'clock', 'recentAdded'], ['top', 'flame', 'topPlayed'], ['artists', 'mic', 'artists'], ['albums', 'stack', 'albums'], ['songs', 'note', 'songs'], ['uploads', 'download', 'uploaded']];
/* --- 小さなスプリング物理エンジン --- */
class Spr {
  constructor(x, k, c, ex = .05, ev = .5) { this.x = x; this.t = x; this.v = 0; this.k = k; this.c = c; this.ex = ex; this.ev = ev; }
  step(dt) { this.v += (this.k * (this.t - this.x) - this.c * this.v) * dt; this.x += this.v * dt; }
  get rest() { return Math.abs(this.v) < this.ev && Math.abs(this.t - this.x) < this.ex; }
}
const PT = [['home', 'pthome', 'home'], ['new', 'ptgrid', 'new'], ['radio', 'ptradio', 'radio'], ['library', 'ptlib', 'library']];
const isPhone = () => /iPhone|iPod/.test(navigator.userAgent) || innerWidth <= 700;
function vLibrary(el) {
  el.innerHTML = head(t('library')) + `<div class="tl libl">${LIBN.map(([r, i, l]) => `<div class="tr" data-act="go" data-r="${r}"><span class="lic">${ic(i)}</span><div class="ti"><b>${t(l)}</b></div>${ic('chevr')}</div>`).join('')}<div class="tr" data-act="go" data-r="playlists"><span class="lic">${ic('grid')}</span><div class="ti"><b>${t('allPl')}</b></div>${ic('chevr')}</div><div class="tr" data-act="go" data-r="fav"><span class="lic">${ic('star')}</span><div class="ti"><b>${t('fav')}</b></div>${ic('chevr')}</div></div>`;
}
function buildPhone() {
  const el = $('#ptab'); if (!el || el.firstChild) return;
  el.innerHTML = `<div class="pt glass"><i class="ptsel"></i><div class="ptrow">${PT.map(([r, i, l]) => `<button data-act="go" data-r="${r}">${ic(i)}<span>${t(l)}</span></button>`).join('')}</div><div class="tblens"><div class="lensv"></div><div class="lspec"></div></div></div><button class="ps glass" data-act="go" data-r="search" aria-label="Search">${ic('search')}</button>`;
  const pt = $('.pt', el);
  pt.addEventListener('pointerdown', e => {
    const b = e.target.closest('.ptrow button'); if (!b || (e.pointerType === 'mouse' && e.button)) return;
    if (document.body.classList.contains('min')) return;
    qDown = { x: e.clientX, y: e.clientY }; clearTimeout(qT);
    const pid = e.pointerId, x0 = e.clientX; qT = setTimeout(() => { if (qDown) qOpen(pid, x0, b); }, 320);
  });
  pt.addEventListener('pointermove', e => {
    if (!qDown) return;
    if (qOn) qMove(e.clientX); else if (Math.hypot(e.clientX - qDown.x, e.clientY - qDown.y) > 12) { clearTimeout(qT); qDown = null; }
  });
  const end = () => { clearTimeout(qT); if (qOn) qClose(); qDown = null; };
  pt.addEventListener('pointerup', end); pt.addEventListener('pointercancel', end);
  el.addEventListener('click', e => { if (qGuard) { e.stopPropagation(); e.preventDefault(); return; } if (document.body.classList.contains('min') && e.target.closest('.pt')) { e.stopPropagation(); e.preventDefault(); document.body.classList.remove('min'); } }, true);
}
const qX = new Spr(0, 520, 34), qS = new Spr(.8, 380, 15, .002, .02), qO = new Spr(0, 520, 50, .01, .05), qSPR = [qX, qS, qO];
let qOn = false, qLW = 100, qHov = null, qClone = null, qT = 0, qRaf = 0, qLast = 0, qDown = null, qGuard = false, qFid = null;
function qKick() { if (!qRaf) { qLast = performance.now(); qRaf = requestAnimationFrame(qLoop); } }
function qLoop(ts) {
  const dt = Math.min(.033, (ts - qLast) / 1000 || .016); qLast = ts;
  for (let i = 0; i < 4; i++) qSPR.forEach(s => s.step(dt / 4));
  qDraw(); qRaf = (qOn || !qSPR.every(s => s.rest)) ? requestAnimationFrame(qLoop) : 0;
}
function qDraw() {
  const pt = $('#ptab .pt'); if (!pt) return; const lens = $('.tblens', pt), row = $('.ptrow', pt);
  if (qClone && qO.x > .01) {
    const ls = Math.min(.4, Math.abs(qX.v) / 1500), sx = qS.x * (1 + ls), sy = qS.x * (1 - ls * .5), left = qX.x - qLW / 2;
    lens.style.opacity = Math.min(1, qO.x);
    lens.style.transform = `translateX(${left.toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    lens.style.setProperty('--st', ls.toFixed(3));
    qClone.style.left = (-left).toFixed(2) + 'px';
    const off = (.5 + ls * 7).toFixed(2);
    qClone.style.filter = `drop-shadow(${-off}px 0 0 rgba(255,60,120,.45)) drop-shadow(${off}px 0 0 rgba(60,170,255,.45))`;
    const hw = qLW * sx * Math.min(1, qO.x * 1.4), a = qX.x - hw / 2, b = qX.x + hw / 2;
    row.style.webkitMaskImage = row.style.maskImage = `linear-gradient(90deg,#000 ${a - 4}px,transparent ${a + 1}px,transparent ${b - 1}px,#000 ${b + 4}px)`;
  } else if (qClone && qO.t === 0) {
    lens.style.opacity = 0; row.style.webkitMaskImage = row.style.maskImage = ''; qClone.remove(); qClone = null; pt.classList.remove('lensing'); renderPhone();
  }
}
function qSel(b) { const sel = $('#ptab .ptsel'); if (sel && b) { sel.style.opacity = 1; sel.style.width = b.offsetWidth + 'px'; sel.style.transform = `translateX(${b.offsetLeft}px)`; } }
function qOpen(pid, x, pressed) {
  const pt = $('#ptab .pt'), row = $('.ptrow', pt), lens = $('.tblens', pt), act = $('.ptrow button.on', pt) || pressed;
  qOn = true; qHov = act.dataset.r; qLW = act.offsetWidth + 22; lens.style.width = qLW + 'px'; pt.classList.add('lensing');
  if (qClone) qClone.remove();
  qClone = row.cloneNode(true); qClone.removeAttribute('style'); qClone.className = 'ptc'; qClone.style.width = row.offsetWidth + 'px';
  $('.lensv', lens).prepend(qClone);
  if (glassOn() && $('#rfdefs')) { const lh = lens.offsetHeight; try { const nid = rfFilter({ id: 'rfq', w: Math.round(qLW), h: lh, B: Math.min(lh * .3, 17), k: .9 * ST.refr }); $('.lensv', lens).style.filter = 'url(#' + nid + ')'; const o = document.getElementById(qFid); if (o) o.remove(); qFid = nid; } catch {} } else $('.lensv', lens).style.filter = '';
  qX.x = qX.t = act.offsetLeft + act.offsetWidth / 2; qX.v = 0; qS.x = .8; qS.v = 0; qS.t = 1.3; qO.x = .02; qO.t = 1;
  try { pt.setPointerCapture(pid); } catch {}
  if (navigator.vibrate) navigator.vibrate(10);
  qMove(x);
}
function qMove(x) {
  const pt = $('#ptab .pt'), r = pt.getBoundingClientRect(), px = Math.max(0, Math.min(x - r.left, r.width));
  qX.t = Math.max(qLW / 2 - 8, Math.min(px, r.width - qLW / 2 + 8));
  const btns = $$('.ptrow button', pt), b = btns.find(b => px >= b.offsetLeft && px <= b.offsetLeft + b.offsetWidth) || btns[btns.length - 1];
  if (b.dataset.r !== qHov) { qHov = b.dataset.r; if (navigator.vibrate) navigator.vibrate(6); }
  if (qClone) $$('button', qClone).forEach(c => c.classList.toggle('on', c.dataset.r === qHov));
  qKick();
}
function qClose() {
  qOn = false; qGuard = true; setTimeout(() => qGuard = false, 160);
  const pt = $('#ptab .pt'), b = $$('.ptrow button', pt).find(b => b.dataset.r === qHov);
  if (b) { qX.t = b.offsetLeft + b.offsetWidth / 2; qSel(b); }
  qS.t = 1; setTimeout(() => { qO.t = 0; qKick(); }, 120);
  if (qHov) go(qHov);
  qKick();
}
function renderPhone() {
  const el = $('#ptab'); if (!el) return; buildPhone();
  if (qOn) return;
  const k = S.route.split(':')[0], act = k === 'search' ? 'search' : LIBR.includes(k) || PLR.includes(k) ? 'library' : k;
  $$('.ptrow button', el).forEach(b => b.classList.toggle('on', b.dataset.r === act));
  $('.ps', el).classList.toggle('on', act === 'search');
  const on = $('.ptrow button.on', el), sel = $('.ptsel', el);
  if (on) qSel(on); else sel.style.opacity = 0;
}
let lastSY = 0;
function phoneScroll() {
  if (!document.body.classList.contains('phone')) return;
  const y = main.scrollTop, d = y - lastSY;
  if (y < 30) document.body.classList.remove('min');
  else if (d > 14) { document.body.classList.add('min'); lastSY = y; }
  else if (d < -14) { document.body.classList.remove('min'); lastSY = y; }
  if (Math.abs(d) > 14 || y < 30) lastSY = y;
}
main.addEventListener('scroll', phoneScroll, { passive: true });
function applyPhone() {
  const p = isPhone(); document.body.classList.toggle('phone', p);
  if (p) { setSB(false); renderPhone(); rfSizes(); rfKick(600); }
}
addEventListener('resize', () => { applyPhone(); });
function renderSidebar() {
  renderTop(); renderPhone();
  const ni = (r, icon, label, extra = '') => `<button class="ni${S.route === r ? ' on' : ''}" data-act="go" data-r="${r}">${ic(icon)}<span>${esc(label)}</span>${extra}</button>`;
  const grp = (id, label, body) => `<button class="sg${S.col[id] ? ' c' : ''}" data-act="col" data-id="${id}"><span>${label}</span>${ic('chevd')}</button><div class="sgc${S.col[id] ? ' c' : ''}"><div>${body}</div></div>`;
  const pinHTML = pins.length ? pins.map((p, i) => `<button class="ni${S.route === p.r ? ' on' : ''}" data-act="${S.edit ? 'unpin' : 'go'}" data-r="${esc(p.r)}" data-i="${i}">${S.edit ? `<span class="rm">${ic('xmark')}</span>` : ic(p.r === 'fav' ? 'star' : p.r.startsWith('pl') || p.r.startsWith('folder') ? 'plnote' : 'stack')}<span>${esc(p.name)}</span></button>`).join('') : `<div style="padding:4px 14px 8px"><small>${ja ? 'プレイリストやアルバムのメニューからピン留め' : 'Pin from a playlist or album menu'}</small></div>`;
  const pl = playlists.filter(p => !p.parent).map(p => ni((p.folder ? 'folder:' : 'pl:') + p.id, p.folder ? 'folder' : 'plnote', p.name)).join('');
  $('#sidebar').innerHTML = `
    <div class="sbh"><button class="ib round" style="background:rgba(255,255,255,.5);font-size:21px" data-act="mode" data-m="tabs" aria-label="Tab bar">${ic('tabbar')}</button></div>
    <div class="sbscroll">${NAV.map(([r, i, l]) => ni(r, i, t(l))).join('')}
      ${grp('lib', t('library'), grp('pins', t('pins'), pinHTML) + LIBN.map(([r, i, l]) => ni(r, i, t(l))).join(''))}
      ${grp('pls', t('playlists'), ni('playlists', 'grid', t('allPl')) + ni('fav', 'star', t('fav')) + pl)}
      <div style="height:12px"></div></div>
    <div class="profrow"><button class="prof" data-act="account"><span class="avatar">${ic('person')}</span><span>${esc(uname || t('name'))}</span></button><button class="ib" data-act="settings" aria-label="Settings">${ic('sliders')}</button></div>`;
}

/* ============ 画面: ホーム ============ */
async function vHome(el, _, tok) {
  const nm = uname || t('name');
  const station = `<div class="pick station" data-act="station" data-term="__mix"><svg class="art" viewBox="0 0 100 133" preserveAspectRatio="xMidYMid slice"><polygon points="-6,6 62,66 -6,126" fill="#ffb11f"/><polygon points="6,28 42,66 6,104" fill="#ff7a1a"/><polygon points="14,44 28,66 14,88" fill="#ff4d2e"/></svg><small>${t('madeFor')}</small><b>${esc(nm)}${t('station')}</b></div>`;
  const mood = `<div class="pick mood" data-act="station" data-term="${ja ? 'リラックス' : 'relax chill'}"><svg class="art" viewBox="0 0 100 133" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#fff" stroke-width="1.4" opacity=".9"><ellipse cx="55" cy="26" rx="22" ry="9"/><ellipse cx="50" cy="50" rx="36" ry="14"/><ellipse cx="46" cy="82" rx="44" ry="20"/></g></svg><small>${t('moodFor')}</small><b>${t('relax')}</b><p>${t('relaxD')}</p></div>`;
  const rp = topTracks(5), replay = rp.length ? `<div class="pick replay" data-act="go" data-r="top"><i>Replay</i><strong>${ja ? 'あなたの<br>ベスト' : 'Your<br>Best'}</strong><small>${esc([...new Set(rp.map(x => x.artist))].slice(0, 4).join(', '))}</small></div>` : '';
  el.innerHTML = head(t('home')) + `<h2>${t('topPicks')}</h2><div class="hs" id="picks">${replay}${station}${mood}</div>
    <h2>${t('recent')} ${ic('chevr')}</h2><div id="rec"></div><div id="heavy"></div><div id="charts"></div><div id="trend"></div>`;
  const rl = recent.map(unslim).filter(Boolean).slice(0, 14);
  $('#rec', el).innerHTML = rl.length ? `<div class="hs">${rl.map((tr, i) => { const k = reg(rl); return tile(null, tr.title, tr.artist, `data-act="play" data-l="${k}" data-i="${i}"`, tr); }).join('')}</div>` : `<small>${t('noRecent')}</small>`;
  const hv = topTracks(14).filter(x => cnt[x.id] > 1);
  if (hv.length) { const k = reg(hv); $('#heavy', el).innerHTML = `<h2>${t('heavy')} ${ic('chevr')}</h2><div class="hs">${hv.map((x, i) => tile(null, x.title, x.artist, `data-act="play" data-l="${k}" data-i="${i}"`, x)).join('')}</div>`; }
  try {
    const als = await itAlbums(ja ? 'J-POP ヒット' : 'top hits', 14); if (tok !== S.tok) return;
    $('#picks', el).insertAdjacentHTML('beforeend', als.slice(0, 4).map(r => `<div class="pick art" style="background-image:url('${esc((r.artworkUrl100 || '').replace('100x100', '600x600'))}')" data-act="go" data-r="ialbum:${r.collectionId}"><small>${t('album')}</small><b>${esc(r.collectionName)}</b><p>${esc(r.artistName)}</p></div>`).join(''));
    $('#charts', el).innerHTML = `<h2>${t('charts')} ${ic('chevr')}</h2><div class="hs">${als.slice(4).map(albumTile).join('')}</div>`;
  } catch {}
  try {
    const tr = await auTrending(14); if (tok !== S.tok) return; const k = reg(tr);
    $('#trend', el).innerHTML = `<h2>${t('trending')}</h2><div class="hs">${tr.map((x, i) => tile(null, x.title, x.artist, `data-act="play" data-l="${k}" data-i="${i}"`, x)).join('')}</div>`;
  } catch {}
}

/* ============ 検索 ============ */
const CATS = [['Pop', 'pop'], ['Hits', 'hits'], ['J-POP', 'j-pop'], ['Alternative', 'alternative'], ['Hip-Hop', 'hip hop'], ['Country', 'country'], ['Dance', 'dance'], ['Rock', 'rock'], ['Latin', 'latin'], ['R&B', 'r&b'], ['Jazz', 'jazz'], ['Classical', 'classical'], ['Electronic', 'electronic'], ['Anime', 'anime'], ['Soul / Funk', 'soul funk'], ['Reggae', 'reggae'], ['Blues', 'blues'], ['Lo-fi', 'lofi']];
const catHTML = () => CATS.map(([n, q], i) => `<div class="cat" style="--h:${(i * 47 + 340) % 360}" data-act="cat" data-q="${esc(q)}"><span>${n}</span>${ic('note')}</div>`).join('');
let sTimer;
function vSearch(el) {
  const seg = [['audius', 'Audius'], ['archive', 'Internet Archive'], ['youtube', 'YouTube'], ['commons', 'Wikimedia'], ['jamendo', 'Jamendo'], ['itunes', ja ? 'iTunes(30秒)' : 'iTunes (30s)'], ['lib', t('library')]];
  el.innerHTML = `<div class="sbar"><label class="glass sin">${ic('search')}<input id="q" type="search" placeholder="${t('searchPh')}" value="${esc(S.q)}" autocomplete="off" enterkeyhint="search"></label><button class="ib glass sxb" data-act="sclr" aria-label="Clear">${ic('xmark')}</button><div class="seg glass">${seg.map(([k, l]) => `<button class="${S.src === k ? 'on' : ''}" data-act="seg" data-s="${k}">${l}</button>`).join('')}</div></div><div class="pseg"><div class="seg2p glass"><button class="${S.src !== 'lib' ? 'on' : ''}" data-act="seg" data-s="${S.on || 'audius'}">${ja ? 'オンライン' : 'Online'}</button><button class="${S.src === 'lib' ? 'on' : ''}" data-act="seg" data-s="lib">${t('library')}</button></div>${S.src !== 'lib' ? `<div class="chips2">${seg.slice(0, 6).map(([k, l]) => `<button class="${S.src === k ? 'on' : ''}" data-act="seg" data-s="${k}">${l}</button>`).join('')}</div>` : ''}</div><div id="res"></div>`;
  $('#q', el).addEventListener('input', e => { S.q = e.target.value; clearTimeout(sTimer); sTimer = setTimeout(doSearch, 350); });
  doSearch();
}
async function doSearch() {
  const res = $('#res'); if (!res || S.route !== 'search') return;
  const my = ++S.tok, q = S.q.trim(); S.lists = {}; S.lk = 0;
  if (q.length > 1) { shist = [q, ...shist.filter(x => x !== q)].slice(0, 8); LS.set('shist', shist); }
  if (!q && S.src !== 'lib') { res.innerHTML = (shist.length ? `<div class="hhead"><h2>${ja ? '最近検索された項目' : 'Recent Searches'}</h2><button data-act="clrh">${t('clear')}</button></div><div class="tl hrows">${shist.map(h => `<div class="tr" data-act="cat" data-q="${esc(h)}"><span class="hico">${ic('search')}</span><div class="ti"><b>${esc(h)}</b><small>${ja ? '検索' : 'Search'}</small></div><button class="ib" data-act="rmh" data-q="${esc(h)}" aria-label="Remove">${ic('xmark')}</button></div>`).join('')}</div>` : '') + `<h2>${t('browse')}</h2><div class="cats">${catHTML()}</div>`; return; }
  if (S.src === 'lib') {
    const ql = q.toLowerCase(), l = [...lib.values()].filter(x => !ql || (x.title + ' ' + x.artist + ' ' + x.album).toLowerCase().includes(ql));
    res.innerHTML = l.length ? rows(l) : emptyHTML('search', q ? t('noRes') : t('noSongs')); return;
  }
  res.innerHTML = spinner;
  try {
    if (S.src === 'itunes') {
      const [songs, als] = await Promise.all([itSongs(q, 30), itAlbums(q, 12)]); if (my !== S.tok) return;
      res.innerHTML = (als.length ? `<h2>${t('albums')}</h2><div class="hs">${als.map(albumTile).join('')}</div>` : '') + (songs.length ? `<h2>${t('songs')}</h2>${rows(songs)}` : '') || emptyHTML('search', t('noRes'));
    } else if (S.src === 'youtube') {
      const songs = await ytSearch(q); if (my !== S.tok) return;
      res.innerHTML = songs.length ? rows(songs) : emptyHTML('search', t('noRes'));
    } else if (S.src === 'archive') {
      const items = await iaSearch(q); if (my !== S.tok) return;
      res.innerHTML = items.length ? `<div class="grid">${items.map(r => tile(`https://archive.org/services/img/${encodeURIComponent(r.identifier)}`, r.title || r.identifier, [].concat(r.creator || '').join(', '), `data-act="go" data-r="iaitem:${esc(r.identifier)}"`)).join('')}</div>` : emptyHTML('search', t('noRes'));
    } else if (S.src === 'commons') {
      const songs = await wcSearch(q); if (my !== S.tok) return;
      res.innerHTML = songs.length ? rows(songs) : emptyHTML('search', t('noRes'));
    } else if (S.src === 'jamendo') {
      if (!jamKey()) { res.innerHTML = emptyHTML('search', ja ? 'Jamendo（CC音源をフル再生）には無料のclient_idが必要です。<br>developer.jamendo.com で取得できます。' : 'Jamendo (full CC tracks) needs a free client_id.<br>Get one at developer.jamendo.com.') + `<div class="ctr"><button class="pbtn glass" data-act="jamkey">${ja ? 'client_idを設定' : 'Set client_id'}</button></div>`; return; }
      const songs = await jamSearch(q); if (my !== S.tok) return;
      res.innerHTML = songs.length ? rows(songs) : emptyHTML('search', t('noRes'));
    } else {
      const songs = await auSearch(q, 30); if (my !== S.tok) return;
      res.innerHTML = songs.length ? rows(songs) : emptyHTML('search', t('noRes'));
    }
  } catch { if (my === S.tok) res.innerHTML = emptyHTML('search', t('err')); }
}

/* ============ 新着 / ラジオ ============ */
async function vNew(el, _, tok) {
  el.innerHTML = head(t('new')) + `<div id="n1">${spinner}</div>`;
  try {
    const [a, b, c] = await Promise.all([itAlbums(ja ? '新曲 邦楽' : 'new music 2026', 18), itAlbums(ja ? 'アニメ' : 'indie', 12), auTrending(20).catch(() => [])]); if (tok !== S.tok) return;
    const k = reg(c);
    $('#n1', el).innerHTML = `<h2>${ja ? '新作アルバム' : 'New Albums'}</h2><div class="hs">${a.map(albumTile).join('')}</div><h2>${ja ? 'ピックアップ' : 'Featured'}</h2><div class="hs">${b.map(albumTile).join('')}</div>${c.length ? `<h2>${t('trending')}</h2><div class="hs">${c.map((x, i) => tile(null, x.title, x.artist, `data-act="play" data-l="${k}" data-i="${i}"`, x)).join('')}</div>` : ''}`;
  } catch { $('#n1', el).innerHTML = emptyHTML('grid', t('err')); }
}
const RSTA = [['Chill', 'chill lofi', '#00c2e0', 'chill'], ['1', 'pop hits', '#ff1d2d', 'one'], ['HITS', 'top hits', '#1d5bff', 'hits'], ['COUNTRY', 'country', '#ffb400', 'country'], ['UNO', 'latin pop', '#ff2d8a', 'uno'], ['club', 'dance club', '#111', 'club']];
const RLIVE = [[ja ? 'ポップ・ナウ' : 'Pop Now', ja ? 'いま聴きたいポップを一挙に' : 'The pop you want to hear right now', 'pop', 'linear-gradient(135deg,#ff5e62,#ff9966)'], [ja ? 'ジャズ・ラウンジ' : 'Jazz Lounge', ja ? '夜に寄り添うジャズ' : 'Late night jazz', 'jazz', 'linear-gradient(135deg,#41295a,#2f0743)'], [ja ? 'ヒップホップ・ライブ' : 'Hip-Hop Live', ja ? '最新のヒップホップ' : 'Latest in hip-hop', 'hip hop', 'linear-gradient(135deg,#0f2027,#2c5364)'], [ja ? 'アニメ・ステーション' : 'Anime Station', ja ? 'アニメソング特集' : 'Anime songs', 'anime', 'linear-gradient(135deg,#f093fb,#f5576c)']];
function vRadio(el) {
  el.innerHTML = head(t('radio')) + `<div class="rtiles">${RSTA.map(([n, q, c, k]) => `<div class="rtile" data-act="station" data-term="${esc(q)}"><b class="rt-${k}" style="color:${c}">${esc(n)}</b><small>${ic('radio')} Radio</small></div>`).join('')}</div><h2>${ja ? 'オンエア中' : 'On Air'}</h2><div class="hs">${RLIVE.map(([n, d, q, g]) => `<div class="rlive" style="background:${g}" data-act="station" data-term="${esc(q)}"><small>${ja ? 'ライブ' : 'LIVE'}</small><b>${esc(n)}</b><p>${esc(d)}</p></div>`).join('')}</div><h2>${ja ? 'ジャンル別ステーション' : 'Genre Stations'}</h2>` + `<div class="cats">${CATS.map(([n, q], i) => `<div class="cat" style="--h:${(i * 47 + 200) % 360}" data-act="station" data-term="${esc(q)}"><span>${n} ${ja ? 'ステーション' : 'Station'}</span>${ic('radio')}</div>`).join('')}</div>`;
}
async function station(term) {
  if (term === '__mix') {
    const cnt = {}; recent.map(unslim).filter(Boolean).forEach(x => cnt[x.artist] = (cnt[x.artist] || 0) + 1);
    term = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] || (ja ? 'J-POP' : 'pop hits');
  }
  toast(t('preparing'), 8000);
  try { let l = []; try { l = await auSearch(term, 40); } catch {} if (l.length < 5) l = await itSongs(term, 50); l = shuf(l); if (!l.length) throw 0; P.shuffle = true; play(l, 0); toast(term, 1500); }
  catch { toast(t('err')); }
}

/* ============ ライブラリ ============ */
const uploadBtns = () => `<button class="pbtn glass" data-act="upload">${ic('upload')}${t('upload')}</button><button class="pbtn glass" data-act="addurl">${ic('link')}${t('addUrl')}</button>`;
const allSongs = () => [...lib.values()];
function vSongs(el) { const l = allSongs().sort((a, b) => a.title.localeCompare(b.title, ja ? 'ja' : 'en')); el.innerHTML = head(t('songs'), uploadBtns()) + (l.length ? playBtns(l) + rows(l) : emptyHTML('note', t('noSongs'))); }
function vUploads(el) { const l = allSongs().filter(x => x.src === 'upload' || x.src === 'url').sort((a, b) => b.added - a.added); el.innerHTML = head(t('uploaded'), uploadBtns()) + (l.length ? playBtns(l) + rows(l) : emptyHTML('download', t('noSongs'))); }
function vTop(el) { const l = topTracks(50); el.innerHTML = head(t('topPlayed')) + (l.length ? playBtns(l) + rows(l) : emptyHTML('flame', t('noRecent'))); }
function vRecentAdded(el) { const l = allSongs().sort((a, b) => b.added - a.added); el.innerHTML = head(t('recentAdded'), uploadBtns()) + (l.length ? rows(l) : emptyHTML('clock', t('noSongs'))); }
function playBtns(l) { const k = reg(l); return `<div class="dbtn" style="margin:6px 0 14px"><button class="pbtn glass" data-act="playall" data-l="${k}">${ic('play')}${t('play')}</button><button class="pbtn glass" data-act="playall" data-l="${k}" data-sh="1">${ic('shuffle')}${t('shuffle')}</button></div>`; }
function groupBy(l, f) { const m = new Map(); l.forEach(x => { const k = f(x); (m.get(k) || m.set(k, []).get(k)).push(x); }); return m; }
function vArtists(el) {
  const g = groupBy(allSongs(), x => x.artist);
  el.innerHTML = head(t('artists')) + (g.size ? `<div class="tl">${[...g].sort((a, b) => a[0].localeCompare(b[0])).map(([n, l]) => `<div class="tr" data-act="go" data-r="lartist:${esc(n)}"><div style="border-radius:50%;overflow:hidden;display:flex">${cov(l.find(x => x.art) || l[0], 'sm')}</div><div class="ti"><b>${esc(n)}</b><small>${l.length} ${t('songsN')}</small></div>${ic('chevr')}</div>`).join('')}</div>` : emptyHTML('mic', t('noSongs')));
}
function vAlbums(el) {
  const g = groupBy(allSongs(), x => x.artist + '|' + x.album);
  el.innerHTML = head(t('albums')) + (g.size ? `<div class="grid">${[...g].map(([k, l]) => tile(null, l[0].album || '—', l[0].artist, `data-act="go" data-r="lalbum:${esc(k)}"`, l.find(x => x.art) || l[0])).join('')}</div>` : emptyHTML('stack', t('noSongs')));
}
const doShare = async (title, text, url) => {
  try { if (navigator.share) await navigator.share({ title, text, url }); else { await navigator.clipboard.writeText(url || text); toast(ja ? 'リンクをコピーしました' : 'Link copied'); } } catch {}
};
const shareUrl = tr => /^https?:/.test(tr.url || '') && tr.src !== 'itunes' ? tr.url : (tr.cid ? `https://music.apple.com/album/${tr.cid}` : `https://www.google.com/search?q=${encodeURIComponent(tr.title + ' ' + tr.artist)}`);
function listItems(l, name) {
  return [
    { label: t('playNext'), icon: 'next', act: () => { if (P.i < 0) { play(l, 0); } else P.q.splice(P.i + 1, 0, ...l); toast(t('added')); } },
    { label: t('playLast'), icon: 'list', act: () => { if (P.i < 0) { play(l, 0); } else P.q.push(...l); toast(t('added')); } },
    { label: t('addPl'), icon: 'plnote', sub: playlists.filter(p => !p.folder).map(p => ({ label: p.name, icon: 'plnote', act: async () => { for (const r of l) { await addToLib(r, true); p.songs = p.songs || []; if (!p.songs.includes(r.id)) p.songs.push(r.id); } saveAll(); toast(t('added')); } })).concat([{ label: t('newPl'), icon: 'plus', act: async () => { const n = await ask(t('newPl'), t('plName'), name); if (n) { for (const r of l) await addToLib(r, true); playlists.push({ id: uid('pl'), name: n, songs: l.map(r => r.id) }); saveAll(); renderSidebar(); toast(t('added')); } } }]) },
    { label: ja ? '共有…' : 'Share…', icon: 'share', act: () => doShare(name || '', l.slice(0, 10).map(x => x.title + ' - ' + x.artist).join('\n'), location.href) },
  ];
}
async function vIArtist(el, name, tok) {
  el.innerHTML = head('', '', true) + spinner;
  const lc = s => (s || '').toLowerCase(), m = x => lc(x.artist).includes(lc(name)) || lc(name).includes(lc(x.artist));
  const [ar, au1, it1] = await Promise.all([itunes(`search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=1`).catch(() => ({ results: [] })), auSearch(name, 25).catch(() => []), itSongs(name, 15).catch(() => [])]);
  if (tok !== S.tok) return;
  const a = ar.results[0]; let albums = [];
  if (a && a.artistId && m({ artist: a.artistName })) { try { albums = (await itunes(`lookup?id=${a.artistId}&entity=album&limit=24`)).results.filter(x => x.collectionId && x.wrapperType === 'collection'); } catch {} if (tok !== S.tok) return; }
  const full = au1.filter(m), prev = it1.filter(m), tracks = [...full, ...prev];
  const loc = allSongs().filter(x => x.artist === name);
  const all = [...loc, ...tracks.filter(x => !loc.some(y => y.id === x.id))];
  const after = albums.length ? `<h2>${ja ? 'アルバム' : 'Albums'}</h2><div class="hs">${albums.map(albumTile).join('')}</div>` : '';
  const sim = au1.filter(x => !m(x)).slice(0, 12), k2 = reg(sim);
  const sm = sim.length ? `<h2>${ja ? '似ているアーティスト' : 'Similar Artists'}</h2><div class="hs">${[...new Map(sim.map(x => [x.artist, x])).values()].map(x => `<div class="tile" data-act="go" data-r="iartist:${esc(x.artist)}"><div style="border-radius:50%;overflow:hidden">${cov(x)}</div><b style="text-align:center">${esc(x.artist)}</b></div>`).join('')}</div>` : '';
  detail(el, { title: name, sub: [a && a.primaryGenreName, `${all.length} ${t('songsN')}`].filter(Boolean).join(' · '), art: albums[0] && (albums[0].artworkUrl100 || '').replace('100x100', '600x600'), tracks: all, noAlbum: false, after: after + sm, menu: [pinItem('iartist:' + name, name)] });
}
function detail(el, o) {
  const l = o.tracks, k = reg(l);
  el.innerHTML = head('', `<button class="ib glass" data-act="hmore">${ic('ellipsis')}</button>`, true) + `<div class="dhead">${o.art ? `<div class="cov hd" style="background-image:url('${esc(o.art)}')"></div>` : (o.collage || cov(l[0], 'hd'))}<div><h1>${esc(o.title)}</h1><p>${esc(o.sub || '')}</p><div class="dbtn"><button class="pbtn glass" data-act="playall" data-l="${k}">${ic('play')}${t('play')}</button><button class="pbtn glass" data-act="playall" data-l="${k}" data-sh="1">${ic('shuffle')}${t('shuffle')}</button></div></div></div>${l.length ? rows(l, { num: o.num, noAlbum: o.noAlbum }) : emptyHTML(o.icon || 'note', o.empty || t('noSongs'))}${o.after || ''}`;
  S.hmore = l.length ? [...(o.menu || []), '-', ...listItems(l, o.title)] : (o.menu || null);
}
function vLAlbum(el, k) { const l = allSongs().filter(x => x.artist + '|' + x.album === k); detail(el, { title: l[0]?.album || '—', sub: l[0]?.artist, tracks: l, noAlbum: true, menu: [pinItem(`lalbum:${k}`, l[0]?.album || '—')] }); }
function vLArtist(el, n) { const l = allSongs().filter(x => x.artist === n); detail(el, { title: n, sub: `${l.length} ${t('songsN')}`, tracks: l, menu: [pinItem(`lartist:${n}`, n)] }); }
async function vIAlbum(el, id, tok) {
  el.innerHTML = head('', '', true) + spinner;
  try {
    const r = (await itunes(`lookup?id=${id}&entity=song`)).results, c = r[0], tr = r.filter(x => x.wrapperType === 'track' && x.previewUrl).map(fromIt);
    if (tok !== S.tok) return;
    tr.forEach(x => { x.dur = 0; });
    detail(el, { title: c.collectionName, sub: `${c.artistName} · ${c.primaryGenreName || ''} · ${(c.releaseDate || '').slice(0, 4)}`, art: (c.artworkUrl100 || '').replace('100x100', '600x600'), tracks: tr, num: true, noAlbum: true, menu: [pinItem(`ialbum:${id}`, c.collectionName), { label: t('addLib'), icon: 'plus', act: async () => { for (const x of tr) await addToLib(x, true); toast(t('added')); } }] });
  } catch { el.innerHTML = head('', '', true) + emptyHTML('stack', t('err')); }
}
async function vIAItem(el, id, tok) {
  el.innerHTML = head('', '', true) + spinner;
  try {
    const { md, tracks } = await iaItem(id); if (tok !== S.tok) return;
    detail(el, { title: md.title || id, sub: [].concat(md.creator || 'Internet Archive').join(', '), art: `https://archive.org/services/img/${encodeURIComponent(id)}`, tracks, num: true, noAlbum: true, empty: ja ? '再生できるmp3/m4aが見つかりません' : 'No playable mp3/m4a found', menu: [pinItem('iaitem:' + id, md.title || id), { label: t('addLib'), icon: 'plus', act: async () => { for (const x of tracks) await addToLib(x, true); toast(t('added')); } }] });
  } catch { el.innerHTML = head('', '', true) + emptyHTML('stack', t('err')); }
}
const pinItem = (r, name) => pins.some(p => p.r === r) ? { label: t('unpin'), icon: 'pin', act: () => { pins = pins.filter(p => p.r !== r); saveAll(); renderSidebar(); } } : { label: t('pin'), icon: 'pin', act: () => { pins.push({ r, name }); saveAll(); renderSidebar(); toast(t('added')); } };

/* ============ プレイリスト ============ */
const plSongs = p => (p.songs || []).map(id => lib.get(id)).filter(Boolean);
const collageOf = p => { const a = plSongs(p).filter(x => x.art).slice(0, 4); if (a.length >= 4) return `<div class="collage">${a.map(x => cov(x)).join('')}</div>`; return a.length ? cov(a[0]) : `<div class="cov gen" style="--h:${hue(p.name)}">${ic('plnote')}</div>`; };
function vPlaylists(el) {
  const top = playlists.filter(p => !p.parent);
  el.innerHTML = head(t('playlists'), `<button class="ib glass" data-act="plmenu">${ic('ellipsis')}</button>`) +
    `<div class="grid"><div class="pt" data-act="go" data-r="fav"><div class="favtile">${ic('starfill')}</div><b>${t('fav')} ★</b></div>${top.map(p => `<div class="pt" data-act="go" data-r="${p.folder ? 'folder' : 'pl'}:${p.id}">${p.folder ? `<div class="favtile" style="color:var(--fg2)">${ic('folder')}</div>` : collageOf(p)}<b>${esc(p.name)}</b><small>${p.folder ? playlists.filter(x => x.parent === p.id).length + ' ' + t('pls') : plSongs(p).length + ' ' + t('songsN')}</small><button class="ib glass dots" data-act="pmore" data-id="${p.id}">${ic('ellipsis')}</button></div>`).join('')}</div>`;
}
function vFav(el) { const l = [...favs].map(id => lib.get(id)).filter(Boolean); detail(el, { title: t('fav'), sub: `${l.length} ${t('songsN')}`, tracks: l, empty: t('notFav'), icon: 'star', collage: `<div class="cov hd" style="display:grid;place-items:center;font-size:90px;color:var(--acc);background:var(--card)">${ic('starfill')}</div>`, menu: [pinItem('fav', t('fav'))] }); }
function vPl(el, id) {
  const p = playlists.find(x => x.id === id); if (!p) return go('playlists');
  const l = plSongs(p); detail(el, { title: p.name, sub: `${l.length} ${t('songsN')}`, tracks: l, empty: t('empPl'), icon: 'plnote', collage: `<div class="hd" style="width:min(220px,30vw)">${collageOf(p)}</div>`, menu: plMenu(p) });
}
function vFolder(el, id) {
  const f = playlists.find(x => x.id === id); if (!f) return go('playlists'); const ch = playlists.filter(x => x.parent === id);
  el.innerHTML = head(f.name, `<button class="ib glass" data-act="pmore" data-id="${id}">${ic('ellipsis')}</button>`, true) + (ch.length ? `<div class="grid">${ch.map(p => `<div class="pt" data-act="go" data-r="pl:${p.id}">${collageOf(p)}<b>${esc(p.name)}</b><small>${plSongs(p).length} ${t('songsN')}</small><button class="ib glass dots" data-act="pmore" data-id="${p.id}">${ic('ellipsis')}</button></div>`).join('')}</div>` : emptyHTML('folder', t('noPl')));
}
function plMenu(p) {
  const folders = playlists.filter(x => x.folder && x.id !== p.id);
  const it = [pinItem((p.folder ? 'folder:' : 'pl:') + p.id, p.name),
    { label: t('rename'), icon: 'quote', act: async () => { const n = await ask(t('rename'), '', p.name); if (n) { p.name = n; saveAll(); renderSidebar(); render(); } } }];
  if (!p.folder && folders.length) it.push({ label: t('toFolder'), icon: 'folder', sub: folders.map(f => ({ label: f.name, icon: 'folder', act: () => { p.parent = f.id; saveAll(); renderSidebar(); render(); } })) });
  if (p.parent) it.push({ label: t('out'), icon: 'xmark', act: () => { delete p.parent; saveAll(); render(); } });
  it.push('-', { label: t('del'), icon: 'trash', danger: true, act: () => { playlists = playlists.filter(x => x.id !== p.id).map(x => x.parent === p.id ? (delete x.parent, x) : x); pins = pins.filter(x => !x.r.endsWith(':' + p.id)); saveAll(); renderSidebar(); S.stack.length ? back() : go('playlists'); } });
  return it;
}

/* ============ クリック処理 ============ */
document.addEventListener('click', async e => {
  const a = e.target.closest('[data-act]'); if (!a) return;
  const d = a.dataset, rect = a.getBoundingClientRect();
  switch (d.act) {
    case 'go': a.closest('#sidebar, #ptab') ? go(d.r) : nav(d.r); break;
    case 'back': back(); break;
    case 'play': { const l = S.lists[d.l]; if (l) { if (cur() && l[+d.i].id === cur().id) toggle(); else play(l, +d.i); } break; }
    case 'more': openTrackMenu(a, rect.left - 200, rect.bottom + 4); break;
    case 'playall': { const l = S.lists[d.l]; if (l && l.length) { P.shuffle = !!d.sh; play(d.sh ? shuf(l) : l, 0); } break; }
    case 'mode': S.mode = d.m; applyMode(); break;
    case 'tplay': playLib(false); break;
    case 'tshuf': playLib(true); break;
    case 'tmore': menu(rect.right - 250, rect.bottom + 8, [{ label: t('upload'), icon: 'upload', act: () => $('#file').click() }, { label: t('addUrl'), icon: 'link', act: () => document.querySelector('[data-act=addurl]') ? document.querySelector('[data-act=addurl]').click() : (go('songs')) }, glassItem(), settingsItem(), '-', { label: ja ? 'サイドバーに切り替え' : 'Switch to Sidebar', icon: 'sidebar', act: () => { S.mode = 'sidebar'; applyMode(); } }]); break;
    case 'sidebar': setSB(!S.sb); break;
    case 'col': S.col[d.id] = !S.col[d.id]; saveAll(); renderSidebar(); break;
    case 'edit': S.edit = !S.edit; renderSidebar(); break;
    case 'unpin': pins.splice(+d.i, 1); saveAll(); renderSidebar(); break;
    case 'name': { const n = await ask(t('yourName'), t('name'), uname); if (n !== null) { uname = n; LS.set('name', n); renderSidebar(); if (S.route === 'home') render(); } break; }
    case 'sclr': S.q = ''; { const i = $('#q'); if (i) { i.value = ''; i.blur(); } } doSearch(); break;
    case 'rmh': shist = shist.filter(x => x !== d.q); LS.set('shist', shist); doSearch(); break;
    case 'account': openAccount(); break;
    case 'seg': S.src = d.s; if (d.s !== 'lib') S.on = d.s; if ($('.pseg')) { render(); break; } $$('.seg button').forEach(b => b.classList.toggle('on', b === a)); doSearch(); break;
    case 'cat': S.q = d.q; { const i = $('#q'); if (i) i.value = d.q; } doSearch(); break;
    case 'clrh': shist = []; LS.set('shist', shist); render(); break;
    case 'settings': openSettings(); break;
    case 'qrm': { const i = +d.i; if (i !== P.i) { P.q.splice(i, 1); if (i < P.i) P.i--; npPanel('queue'); } break; }
    case 'qclear': P.q.splice(P.i + 1); npPanel('queue'); break;
    case 'station': station(d.term); break;
    case 'jamkey': { const k = await ask('Jamendo client_id', 'client_id', jamKey()); if (k) { LS.set('jamendo', k); doSearch(); } break; }
    case 'upload': $('#file').click(); break;
    case 'addurl': { const r = await ask(t('addUrl'), t('urlPh'), '', t('titlePh')); if (r && /^https?:\/\//i.test(r[0])) { const [url, title] = r; await addToLib({ id: uid('ur'), title: title || decodeURIComponent(url.split('/').pop().split('?')[0]) || url, artist: new URL(url).hostname, album: ja ? '外部URL' : 'Web', dur: 0, url, art: null, src: 'url' }); render(); } break; }
    case 'plmenu': menu(rect.right - 250, rect.bottom + 8, [{ label: t('newPl'), icon: 'plnote', act: async () => { const n = await ask(t('newPl'), t('plName')); if (n) { playlists.push({ id: uid('pl'), name: n, songs: [] }); saveAll(); renderSidebar(); render(); } } }, { label: t('newFolder'), icon: 'folder', act: async () => { const n = await ask(t('newFolder'), t('fName')); if (n) { playlists.push({ id: uid('fo'), name: n, folder: true }); saveAll(); renderSidebar(); render(); } } }]); break;
    case 'pmore': { e.stopPropagation(); const p = playlists.find(x => x.id === d.id); if (p) menu(rect.left - 150, rect.bottom + 6, plMenu(p)); break; }
    case 'hmore': if (S.hmore) menu(rect.right - 250, rect.bottom + 8, S.hmore); break;
  }
});
$('#file').addEventListener('change', e => { importFiles(e.target.files); e.target.value = ''; });
['dragenter', 'dragover'].forEach(n => addEventListener(n, e => { e.preventDefault(); document.body.classList.add('dragover'); }));
['dragleave', 'drop'].forEach(n => addEventListener(n, e => { e.preventDefault(); if (n === 'drop' || e.target === document.documentElement) document.body.classList.remove('dragover'); if (n === 'drop') importFiles(e.dataTransfer.files); }));
$('#scrim').addEventListener('click', () => setSB(false));
// Liquid Glass: ポインタに追従するハイライト
document.addEventListener('pointermove', e => {
  const g = e.target.closest && e.target.closest('.glass'); if (!g) return;
  const r = g.getBoundingClientRect(); g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); g.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); g.classList.add('lit');
});
document.addEventListener('pointerout', e => { const g = e.target.closest && e.target.closest('.glass'); if (g && !g.contains(e.relatedTarget)) g.classList.remove('lit'); });
document.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; if (e.code === 'Space') { e.preventDefault(); toggle(); } else if (e.code === 'ArrowRight') next(); else if (e.code === 'ArrowLeft') prev(); });
$('#sbopen').innerHTML = ic('sidebar');

/* ============ 上部タブバー + Liquid Glassレンズ(スプリング物理) ============ */
const TABS = [['home', 'home'], ['new', 'new'], ['radio', 'radio'], ['lib', 'library'], ['pls', 'playlists']];
const TABROUTE = { home: 'home', new: 'new', radio: 'radio', lib: 'songs', pls: 'playlists', search: 'search' };
const LIBR = ['library', 'recent', 'top', 'artists', 'albums', 'songs', 'uploads', 'lalbum', 'lartist'];
const PLR = ['playlists', 'fav', 'pl', 'folder'];
const tabOf = r => { const k = r.split(':')[0]; if (['home', 'new', 'radio', 'search'].includes(k)) return k; if (LIBR.includes(k)) return 'lib'; if (PLR.includes(k)) return 'pls'; return null; };
function playLib(sh) {
  const l = allSongs().sort((a, b) => a.title.localeCompare(b.title, ja ? 'ja' : 'en'));
  if (!l.length) return toast(t('noSongs').replace(/<br>/g, ' '));
  P.shuffle = sh; play(sh ? shuf(l) : l, 0);
}
function buildTop() {
  $('#topbar').innerHTML = `<div class="tbar glass"><button class="tbi" data-act="mode" data-m="sidebar" aria-label="Sidebar">${ic('sidebar')}</button>
    <div class="tbtabs"><div class="tbreal"><i class="tbpill"></i>${TABS.map(([id, l]) => `<button class="tbt" data-tab="${id}">${t(l)}</button>`).join('')}</div><div class="tblens"><div class="lensv"></div><div class="lspec"></div></div></div>
    <button class="tbi" data-tab="search" aria-label="Search">${ic('search')}</button></div>
    <div class="tright"><button class="ib glass" data-act="tplay" aria-label="Play">${ic('play')}</button><button class="ib glass" data-act="tshuf" aria-label="Shuffle">${ic('shuffle')}</button><button class="ib glass" data-act="tmore" aria-label="More">${ic('ellipsis')}</button></div>`;
}

const pX = new Spr(0, 300, 21), pW = new Spr(80, 300, 22), pS = new Spr(1, 420, 17, .002, .02),
  lX = new Spr(0, 520, 34), lS = new Spr(.8, 380, 15, .002, .02), lO = new Spr(0, 520, 50, .01, .05);
const SPR = [pX, pW, pS, lX, lS, lO];
let LW = 100, lensOn = false, hov = null, placed = false, raf = 0, lastT = 0, cloneEl = null, guard = false;
const gTabs = () => $('#topbar .tbtabs');
function kick() { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); } }
function loop(ts) {
  const dt = Math.min(.033, (ts - lastT) / 1000 || .016); lastT = ts;
  for (let i = 0; i < 4; i++) SPR.forEach(s => s.step(dt / 4));
  draw();
  raf = (lensOn || !SPR.every(s => s.rest)) ? requestAnimationFrame(loop) : 0;
}
function draw() {
  const root = gTabs(); if (!root) return;
  const real = $('.tbreal', root), pill = $('.tbpill', real), lens = $('.tblens', root);
  // 選択楕円: 速度で横に伸び縦に潰れる(スクイッシュ)
  const st = Math.min(.3, Math.abs(pX.v) / 2400);
  pill.style.width = pW.x + 'px';
  pill.style.transform = `translateX(${pX.x}px) scale(${((1 + st) * pS.x).toFixed(4)},${((1 - st * .45) * pS.x).toFixed(4)})`;
  if (cloneEl && lO.x > .01) {
    // レンズ: 速度で伸縮し、縁の屈折(色収差)も速度で強まる
    const ls = Math.min(.4, Math.abs(lX.v) / 1500);
    const sx = lS.x * (1 + ls), sy = lS.x * (1 - ls * .5), left = lX.x - LW / 2;
    lens.style.opacity = Math.min(1, lO.x);
    lens.style.transform = `translateX(${left.toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    lens.style.setProperty('--st', ls.toFixed(3));
    cloneEl.style.left = (-left).toFixed(2) + 'px';
    const cp = $('.tbpill', cloneEl); cp.style.width = pill.style.width; cp.style.transform = pill.style.transform;
    const off = (.5 + ls * 7).toFixed(2);
    cloneEl.style.filter = `drop-shadow(${-off}px 0 0 rgba(255,60,120,.45)) drop-shadow(${off}px 0 0 rgba(60,170,255,.45))`;
    // レンズの下の本物のタブを穴あきマスクで消し、二重表示を防ぐ
    const hw = LW * sx * Math.min(1, lO.x * 1.4), a = lX.x - hw / 2, b = lX.x + hw / 2;
    real.style.webkitMaskImage = real.style.maskImage = `linear-gradient(90deg,#000 ${a - 4}px,transparent ${a + 1}px,transparent ${b - 1}px,#000 ${b + 4}px)`;
  } else if (cloneEl && lO.t === 0) {
    lens.style.opacity = 0; real.style.webkitMaskImage = real.style.maskImage = ''; cloneEl.remove(); cloneEl = null; root.classList.remove('lensing');
  }
}
function renderTop() {
  const tp = $('#topbar'); if (!tp.firstChild) buildTop();
  const k = tabOf(S.route); if (k) S.tab = k;
  $$('.tbt', tp).forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
  $('.tbi[data-tab=search]', tp).classList.toggle('on', S.tab === 'search');
  const on = $('.tbt.on', tp), root = $('.tbtabs', tp);
  root.style.setProperty('--po', on ? 1 : 0);
  if (on && !lensOn) {
    pX.t = on.offsetLeft; pW.t = on.offsetWidth;
    if (!placed && on.offsetWidth) { pX.x = pX.t; pW.x = pW.t; pX.v = pW.v = 0; placed = true; }
    kick();
  }
}
function applyMode(init) {
  const tabs = S.mode === 'tabs';
  document.body.classList.toggle('tabs', tabs);
  if (tabs) setSB(false); else setSB(init ? innerWidth > 1000 : true);
  LS.set('mode', S.mode); placed = false; renderTop(); renderSidebar(); rfKick(1000); rfSizes();
  requestAnimationFrame(() => requestAnimationFrame(() => { placed = false; renderTop(); }));
}
addEventListener('resize', () => { placed = false; renderTop(); });

function openLens(pid, x) {
  const root = gTabs(), real = $('.tbreal', root), lens = $('.tblens', root), act = $('.tbt.on', real); if (!act) return;
  lensOn = true; root.classList.add('lensing'); hov = act.dataset.tab; LW = act.offsetWidth + 28; lens.style.width = LW + 'px';
  if (cloneEl) cloneEl.remove();
  cloneEl = real.cloneNode(true); cloneEl.removeAttribute('style'); cloneEl.classList.add('lensc'); cloneEl.style.width = real.offsetWidth + 'px';
  $('.lensv', lens).prepend(cloneEl);
  if (glassOn() && $('#rfdefs')) { const lh = lens.offsetHeight; try { const nid = rfFilter({ id: 'rfl', w: Math.round(LW), h: lh, B: Math.min(lh * .3, 17), k: .9 * ST.refr }); $('.lensv', lens).style.filter = 'url(#' + nid + ')'; const o = document.getElementById(lensFid); if (o) o.remove(); lensFid = nid; } catch {} } else $('.lensv', lens).style.filter = '';
  lX.x = lX.t = act.offsetLeft + act.offsetWidth / 2; lX.v = 0;
  lS.x = .8; lS.v = 0; lS.t = 1.32; lO.x = .02; lO.t = 1; pS.t = 1;
  try { $('#topbar').setPointerCapture(pid); } catch {}
  if (navigator.vibrate) navigator.vibrate(10);
  moveLens(x);
}
function moveLens(x) {
  const root = gTabs(), r = root.getBoundingClientRect();
  const px = Math.max(0, Math.min(x - r.left, r.width));
  lX.t = Math.max(LW / 2 - 12, Math.min(px, r.width - LW / 2 + 12));
  const btns = $$('.tbreal .tbt', root);
  const b = btns.find(b => px >= b.offsetLeft && px <= b.offsetLeft + b.offsetWidth) || btns[btns.length - 1];
  if (b.dataset.tab !== hov) { hov = b.dataset.tab; if (navigator.vibrate) navigator.vibrate(6); }
  pX.t = b.offsetLeft; pW.t = b.offsetWidth; root.style.setProperty('--po', 1);
  if (cloneEl) $$('.tbt', cloneEl).forEach(c => c.classList.toggle('on', c.dataset.tab === hov));
  kick();
}
function closeLens() {
  lensOn = false; guard = true; setTimeout(() => guard = false, 140);
  const b = $$('.tbreal .tbt', gTabs()).find(b => b.dataset.tab === hov);
  if (b) lX.t = b.offsetLeft + b.offsetWidth / 2;      // 楕円へ吸い込まれるように戻る
  lS.t = 1; setTimeout(() => { lO.t = 0; kick(); }, 120);
  if (hov && hov !== S.tab) go(TABROUTE[hov]); else renderTop();
  kick();
}
(function lensInit() {
  const tp = $('#topbar'); let timer = null, start = null, pid = null, curX = 0;
  tp.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b || guard || lensOn) return;
    go(TABROUTE[b.dataset.tab]);
  });
  tp.addEventListener('contextmenu', e => e.preventDefault());
  tp.addEventListener('pointerdown', e => {
    const b = e.target.closest('.tbreal .tbt.on'); if (!b || lensOn) return;
    start = { x: e.clientX, y: e.clientY }; curX = e.clientX; pid = e.pointerId;
    pS.t = 1.1; kick();
    timer = setTimeout(() => { if (start) openLens(pid, curX); }, 220);
  });
  tp.addEventListener('pointermove', e => {
    curX = e.clientX; if (!start) return;
    if (lensOn) return moveLens(e.clientX);
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) { clearTimeout(timer); start = null; pS.t = 1; kick(); }
  });
  const end = () => { clearTimeout(timer); pS.t = 1; if (lensOn) closeLens(); start = null; kick(); };
  tp.addEventListener('pointerup', end); tp.addEventListener('pointercancel', end);
})();

/* ============ 設定(外観・アクセント・Liquid Glass調整) ============ */
const DEF = { ap: 'auto', acc: '#fa2d48', refr: 1, blur: 1.2, lg: .5, bold: 0, rp: 0, rm: 0, fs: 1, auto: 0, resume: 1 };
const ST = Object.assign({}, DEF, LS.get('set', {}));
const ACCS = ['#fa2d48', '#ff375f', '#ff9f0a', '#0a84ff', '#bf5af2', '#30d158'];
const mqOrig = new WeakMap(); let rfDeb = 0;
function applyAppearance(mode) {
  // prefers-color-scheme:dark のメディアルールを書き換えて、自動/ライト/ダークを強制
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) {
      if (r.type !== CSSRule.MEDIA_RULE) continue;
      if (!mqOrig.has(r)) mqOrig.set(r, r.media.mediaText);
      const o = mqOrig.get(r); if (!/prefers-color-scheme:\s*dark/.test(o)) continue;
      r.media.mediaText = mode === 'dark' ? 'all' : mode === 'light' ? 'not all' : o;
    }
  }
  document.documentElement.style.colorScheme = mode === 'auto' ? '' : mode;
}
function applySettings(rebuild) {
  const root = document.documentElement.style;
  root.setProperty('--acc', ST.acc); root.setProperty('--rfblur', ST.blur + 'px'); root.setProperty('--rfto', ST.lg * 2);
  applyAppearance(ST.ap);
  if (rebuild) { clearTimeout(rfDeb); rfDeb = setTimeout(() => { RF.forEach(r => { r.w = 0; }); rfSizes(); }, 160); }
}
const settingsItem = () => ({ label: ja ? '設定…' : 'Settings…', icon: 'sliders', act: openSettings });
function applyExtra() {
  document.body.classList.toggle('bold', !!ST.bold);
  document.body.classList.toggle('noprlx', !!ST.rp); document.body.classList.toggle('noanim', !!ST.rm); P.auto = !!ST.auto;
  document.documentElement.style.setProperty('--rfto', ST.lg * 2);
  document.documentElement.style.setProperty('--fs', ST.fs || 1);
}
const effDark = () => ST.ap === 'dark' || (ST.ap === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
const SECS = [
  [['playback', 'note', '#ff375f', ['再生', 'Playback']], ['sources', 'globe', '#0a84ff', ['音楽サービス', 'Music Services']]],
  [['appearance', 'contrast', '#ffffff', ['外観', 'Appearance']], ['glass', 'stack', '#40c8e0', ['Liquid Glass', 'Liquid Glass']], ['display', 'sunfill', '#0a84ff', ['画面表示と文字サイズ', 'Display & Text Size']], ['access', 'access', '#0a84ff', ['アクセシビリティ', 'Accessibility']]],
  [['library', 'ptlib', '#ff9f0a', ['ライブラリ', 'Library']], ['about', 'gear', '#aeaeb2', ['情報', 'About']]],
];
function openAccount() {
  let el = $('#acct'); if (el) el.remove();
  el = document.createElement('div'); el.id = 'acct'; document.body.appendChild(el);
  const close = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 420); };
  const row = (l, ic2, act, chev) => `<button class="arow" data-a="${act}">${ic2 ? `<span class="ai">${ic(ic2)}</span>` : ''}<span>${l}</span>${chev ? `<b>${ic('chevr')}</b>` : ''}</button>`;
  const pill = (l, i, act) => `<button class="apill" data-a="${act}">${ic(i)}<span>${l}</span></button>`;
  el.innerHTML = `<div class="ash"><div class="ahd"><span class="alogo">${ic('note')}</span><h2>${ja ? 'アカウント' : 'Account'}</h2><button class="sx glass" data-a="close" aria-label="Close">${ic('xmark')}</button></div>
    <div class="abody"><button class="aprof" data-a="profile"><span class="avatar">${ic('person')}</span><span><b>${esc(uname || t('name'))}</b><small>${ja ? 'プロフィール、設定' : 'Profile & settings'}</small></span><b class="chv">${ic('chevr')}</b></button>
    <button class="abig" data-a="upload">${ja ? 'ライブラリに曲を追加' : 'Add Music to Library'}</button><p class="aft">${ja ? '端末のファイルやURLから、あなたのライブラリに追加できます。' : 'Add files from your device or a URL.'}</p>
    <div class="agrp">${row(ja ? '再生履歴' : 'Play History', '', 'hist', 1)}${row(ja ? 'よく再生した項目' : 'Most Played', '', 'top', 1)}</div>
    <div class="apills">${pill(ja ? 'アップロード' : 'Upload', 'upload', 'upload')}${pill(ja ? 'URLを追加' : 'Add URL', 'link', 'url')}${pill(ja ? 'アプリを共有' : 'Share App', 'share', 'share')}</div>
    <div class="agrp blue">${row(ja ? 'お気に入りの曲' : 'Favorite Songs', 'star', 'fav')}${row(ja ? 'ミュージック設定' : 'Music Settings', 'gear', 'settings')}</div></div></div>`;
  requestAnimationFrame(() => el.classList.add('show'));
  el.onclick = async e => {
    if (e.target === el) return close();
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'close') return close();
    if (a === 'profile') { close(); openSettings('profile'); }
    else if (a === 'settings') { close(); openSettings(); }
    else if (a === 'upload') { $('#file').click(); }
    else if (a === 'url') { close(); const r = await ask(t('addUrl'), t('urlPh'), '', t('titlePh')); if (r && /^https?:\/\//i.test(r[0])) { const [url, title] = r; await addToLib({ id: uid('ur'), title: title || decodeURIComponent(url.split('/').pop().split('?')[0]) || url, artist: new URL(url).hostname, album: ja ? '外部URL' : 'Web', dur: 0, url, art: null, src: 'url' }); render(); } }
    else if (a === 'share') doShare('Music', ja ? '音楽プレイヤーPWA' : 'Music PWA', location.href.split('#')[0]);
    else if (a === 'hist') { close(); go('top'); }
    else if (a === 'top') { close(); go('top'); }
    else if (a === 'fav') { close(); go('fav'); }
  };
}
function openSettings(start) {
  let el = $('#settings'); if (el) el.remove();
  el = document.createElement('div'); el.id = 'settings'; document.body.appendChild(el);
  let sec = start || 'playback', q = '', det = false;
  const L = a => a[ja ? 0 : 1];
  const tg = (k, on) => `<button class="tgl${on ? ' on' : ''}" data-tg="${k}" role="switch" aria-checked="${!!on}"><i></i></button>`;
  const row = (l, r, extra = '') => `<div class="srw" ${extra}><span>${l}</span><em>${r || ''}</em>${extra.includes('data-') ? `<b>${ic('chevr')}</b>` : ''}</div>`;
  const trow = (l, k, on) => `<div class="srw"><span>${l}</span>${tg(k, on)}</div>`;
  const grp = (h, body, f) => `${h ? `<div class="sgh">${h}</div>` : ''}<div class="sgp">${body}</div>${f ? `<p class="sft">${f}</p>` : ''}`;
  const btn = (l, a, red) => `<div class="srw act${red ? ' red' : ''}" data-do="${a}"><span>${l}</span></div>`;
  const ck = (l, a, on) => `<div class="srw act" data-do="${a}"><span>${l}</span>${on ? `<b class="ckm">${ic('check')}</b>` : ''}</div>`;
  const RT = [.75, 1, 1.25, 1.5, 2];
  const C = {
    profile: () => grp('', `<div class="srw"><span>${ja ? '名前' : 'Name'}</span><input class="sin2" id="nmin" value="${esc(uname)}" placeholder="${t('name')}" maxlength="30"></div>`, ja ? 'ホームの「あなたのステーション」などに表示されます。' : 'Shown in your station name on Home.'),
    playback: () => grp('', trow(ja ? '自動再生' : 'Autoplay', 'auto', ST.auto) + trow(ja ? '再生位置を記憶' : 'Remember Playback', 'resume', ST.resume), ja ? '自動再生をオンにすると、キューが終わったあと同じアーティストの曲が続けて再生されます。' : 'When the queue ends, similar songs keep playing.')
      + grp(ja ? '再生速度' : 'Playback Speed', `<div class="seg2">${RT.map(r => `<button data-do="rate:${r}" class="${au.playbackRate === r ? 'on' : ''}">${r}×</button>`).join('')}</div>`)
      + grp(ja ? 'スリープタイマー' : 'Sleep Timer', [15, 30, 45, 60].map(m => btn(m + (ja ? '分' : ' min'), 'sleep:' + m)).join('') + btn(ja ? 'この曲の終わりまで' : 'End of Track', 'sleep:end') + btn(ja ? 'オフ' : 'Off', 'sleep:0')),
    sources: () => grp(ja ? '検索の既定ソース' : 'Default Search Source', [['audius', 'Audius', ja ? 'フル再生・無料' : 'Full tracks'], ['youtube', 'YouTube', ja ? '公開サーバー経由' : 'Via public servers'], ['archive', 'Internet Archive', ja ? 'フル再生' : 'Full tracks'], ['commons', 'Wikimedia Commons', ja ? 'フル再生' : 'Full tracks'], ['jamendo', 'Jamendo', 'client_id'], ['itunes', 'iTunes', ja ? '30秒プレビュー' : '30s previews'], ['lib', t('library'), '']].map(([k, n, d]) => `<div class="srw act" data-do="src:${k}"><span>${n}${d ? `<small> ${d}</small>` : ''}</span>${S.src === k ? `<b class="ckm">${ic('check')}</b>` : ''}</div>`).join(''))
      + grp('Jamendo', `<div class="srw act" data-do="jam"><span>client_id</span><em>${jamKey() ? (ja ? '設定済み' : 'Set') : (ja ? '未設定' : 'Not set')}</em><b>${ic('chevr')}</b></div>`, ja ? 'developer.jamendo.com で無料のclient_idを取得できます。' : 'Get a free client_id at developer.jamendo.com.'),
    appearance: () => grp('', `<div class="apr">${['light', 'dark'].map(k => { const on = ST.ap === 'auto' ? (effDark() === (k === 'dark')) : ST.ap === k;
        return `<button data-ap="${k}" class="apo"><div class="pv ${k}"><span>9:41</span><i></i><i></i></div><div>${k === 'light' ? (ja ? 'ライト' : 'Light') : (ja ? 'ダーク' : 'Dark')}</div><div class="rd${on ? ' on' : ''}">${on ? ic('check') : ''}</div></button>`; }).join('')}</div>${trow(ja ? '自動' : 'Automatic', 'auto2', ST.ap === 'auto')}`, ja ? '“自動” では、端末の設定に合わせてライトとダークが切り替わります。' : 'Automatic follows your device setting.')
      + grp(ja ? 'アクセントカラー' : 'Accent Color', `<div class="swp">${ACCS.map(c => `<button data-acc="${c}" style="background:${c}" class="${ST.acc === c ? 'on' : ''}" aria-label="${c}"></button>`).join('')}</div>`),
    glass: () => `<div class="lgpv"><div class="lgim"><div class="lgbar"><span class="glass lgc">${ic('list')}</span><span class="glass lgs">${ic('search')}<small>${ja ? '検索' : 'Search'}</small></span></div></div><div class="lgtx"><h3>${ja ? 'ようこそ Apple Park へ' : 'Welcome to Apple Park'}</h3><h4>${ja ? 'カリフォルニア州クパティーノ' : 'Cupertino, California'}</h4><p>${ja ? 'この場所ならではの自然の魅力や美しさを発見しましょう。' : 'Discover the natural beauty of this place.'}</p></div></div>`
      + `<div class="sgp lgsl"><span class="lgi">${ic('stack')}</span><input type="range" class="gs" data-k="lg" min="0" max="1" step="0.01" value="${ST.lg}"><span class="lgi f">${ic('stack')}</span></div><p class="sft">${ja ? '“クリア” を選択すると透明度が高くなり、“色合い調整” を選択すると不透明度が上がってコンテンツやコントロールのコントラストが強くなります。' : 'Clear is more transparent. Tinted is more opaque for stronger contrast.'}</p>`
      + grp(ja ? '屈折' : 'Refraction', trow(ja ? '背景の屈折効果' : 'Edge Refraction', 'glass', glassOn()) + `<div class="srw srs"><span>${ja ? '屈折の強さ' : 'Strength'}</span><input type="range" class="gs" data-k="refr" min="0" max="2" step="0.05" value="${ST.refr}"></div><div class="srw srs"><span>${ja ? 'ぼかし' : 'Blur'}</span><input type="range" class="gs" data-k="blur" min="0" max="6" step="0.1" value="${ST.blur}"></div>`),
    display: () => grp(ja ? 'テキストサイズ' : 'Text Size', `<div class="srw srs"><small style="font-size:14px">A</small><input type="range" class="gs" data-k="fs" min="0.85" max="1.3" step="0.05" value="${ST.fs || 1}"><small style="font-size:24px">A</small></div>`, ja ? 'アプリ全体の文字の大きさを調整します。' : 'Adjusts text size across the app.') + grp('', trow(ja ? '文字を太くする' : 'Bold Text', 'bold', ST.bold)),
    access: () => grp(ja ? '視覚' : 'Vision', trow(ja ? '視差効果を減らす' : 'Reduce Parallax', 'rp', ST.rp) + trow(ja ? 'モーションを減らす' : 'Reduce Motion', 'rm', ST.rm) + trow(ja ? '透明度を下げる(屈折オフ)' : 'Reduce Transparency', 'glassoff', !glassOn()), ja ? '“モーションを減らす” はアニメーションを最小限にします。' : 'Reduce Motion minimizes animations.'),
    library: () => grp(ja ? 'ライブラリ' : 'Library', row(ja ? '曲' : 'Songs', String(allSongs().length)) + row(ja ? 'お気に入り' : 'Favorites', String(favs.size)) + row(ja ? 'プレイリスト' : 'Playlists', String(playlists.length)) + row(ja ? '再生履歴' : 'History', String(recent.length)))
      + grp(ja ? 'データ' : 'Data', btn(ja ? '再生履歴を消去' : 'Clear Play History', 'clrrecent', 1) + btn(ja ? '再生回数をリセット' : 'Reset Play Counts', 'clrcnt', 1) + btn(ja ? '検索履歴を消去' : 'Clear Search History', 'clrhist', 1) + btn(ja ? 'キャッシュを消去' : 'Clear Cache', 'clrcache', 1))
      + grp(ja ? 'バックアップ' : 'Backup', btn(ja ? 'プレイリストと設定を書き出す' : 'Export Playlists & Settings', 'bkexp') + btn(ja ? 'バックアップを読み込む' : 'Import Backup', 'bkimp'), ja ? '曲のファイル本体は含まれません。プレイリスト、お気に入り、履歴、設定が対象です。' : 'Audio files are not included.'),
    about: () => `<div class="sgp aboutc"><div class="aico">${ic('note')}</div><b>Music</b><small>iPadOS Music PWA · v17</small></div>` + grp('', row(ja ? '表示モード' : 'Display Mode', matchMedia('(display-mode: standalone)').matches ? 'PWA' : 'Browser') + row(ja ? '言語' : 'Language', ja ? '日本語' : 'English') + row(ja ? 'ガラス効果' : 'Glass', glassOn() ? (ja ? 'オン' : 'On') : (ja ? 'オフ' : 'Off'))) + `<p class="sft">${ja ? '音楽は Audius / Internet Archive / Wikimedia Commons / Jamendo / iTunes から取得します。' : 'Music comes from Audius, Internet Archive, Wikimedia Commons, Jamendo and iTunes.'}</p>`,
  };
  const title = id => id === 'profile' ? (ja ? 'プロフィール' : 'Profile') : L(SECS.flat().find(s => s[0] === id)[3]);
  const left = () => {
    const ql = q.toLowerCase(), g = SECS.map(gr => gr.filter(s => !ql || L(s[3]).toLowerCase().includes(ql))).filter(gr => gr.length);
    return `<button class="sprof${sec === 'profile' ? ' on' : ''}" data-sec="profile"><span class="avatar">${ic('person')}</span><span><b>${esc(uname || t('name'))}</b><small>${ja ? 'プロフィールを編集' : 'Edit profile'}</small></span></button>`
      + g.map(gr => `<div class="slg">${gr.map(s => `<button class="sli${sec === s[0] ? ' on' : ''}" data-sec="${s[0]}"><span class="sico" style="--g:${s[2]}">${ic(s[1])}</span><span>${L(s[3])}</span></button>`).join('')}</div>`).join('') || `<p class="sft">${ja ? '該当なし' : 'No results'}</p>`;
  };
  const draw = (keep) => {
    const sc = keep ? $('.srb', el)?.scrollTop : 0;
    el.className = (el.classList.contains('show') ? 'show ' : '') + (det ? 'det' : '');
    el.innerHTML = `<div class="sw"><aside class="sl"><div class="slh"><label class="glass sfield">${ic('search')}<input id="sq" type="search" placeholder="${ja ? '検索' : 'Search'}" value="${esc(q)}" autocomplete="off"></label></div><div class="slb">${left()}</div></aside>
      <section class="sr"><div class="sbar"><button class="sback glass" data-sb="back" aria-label="Back">${ic('chevl')}</button><h1>${title(sec)}</h1><button class="sx glass" data-sb="close" aria-label="Close">${ic('xmark')}</button></div><div class="srb sbody">${C[sec]()}</div></section></div>`;
    $$('input.gs', el).forEach(paint);
    if (keep && sc) $('.srb', el).scrollTop = sc;
    if (q) { const i = $('#sq', el); i.focus(); i.setSelectionRange(q.length, q.length); }
  };
  const paint = r => { const mn = +r.min, mx = +r.max; r.style.setProperty('--p', ((+r.value - mn) / (mx - mn) * 100) + '%'); };
  draw(); requestAnimationFrame(() => el.classList.add('show'));
  const close = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 380); };
  const save = () => { LS.set('set', ST); applySettings(); applyExtra(); };
  el.addEventListener('input', e => {
    const r = e.target.closest('input.gs');
    if (r) { ST[r.dataset.k] = +r.value; paint(r); LS.set('set', ST); applySettings(r.dataset.k === 'refr'); applyExtra(); return; }
    if (e.target.id === 'nmin') { uname = e.target.value; LS.set('name', uname); const b = $('.sprof b', el); if (b) b.textContent = uname || t('name'); renderSidebar(); return; }
    if (e.target.id === 'sq') { q = e.target.value; $('.slb', el).innerHTML = left(); }
  });
  el.addEventListener('click', async e => {
    const t0 = e.target;
    const sb = t0.closest('[data-sb]'); if (sb) { if (sb.dataset.sb === 'back') { det = false; draw(); } else close(); return; }
    const sc = t0.closest('[data-sec]'); if (sc) { sec = sc.dataset.sec; det = true; draw(); return; }
    const ap = t0.closest('[data-ap]'); if (ap) { ST.ap = ap.dataset.ap; save(); draw(true); return; }
    const ac = t0.closest('[data-acc]'); if (ac) { ST.acc = ac.dataset.acc; save(); draw(true); return; }
    const tgl = t0.closest('[data-tg]');
    if (tgl) {
      const k = tgl.dataset.tg;
      if (k === 'auto') { ST.auto = ST.auto ? 0 : 1; P.auto = !!ST.auto; }
      else if (k === 'auto2') ST.ap = ST.ap === 'auto' ? (effDark() ? 'dark' : 'light') : 'auto';
      else if (k === 'glass' || k === 'glassoff') glassItem().act();
      else ST[k] = ST[k] ? 0 : 1;
      save(); draw(true); return;
    }
    const d = t0.closest('[data-do]'); if (!d) return; const [a, v] = d.dataset.do.split(':');
    if (a === 'rate') { const r = +v; au.defaultPlaybackRate = r; au.playbackRate = r; au.preservesPitch = true; }
    else if (a === 'sleep') { if (v === 'end') { S.sleepEnd = true; toast(ja ? 'この曲の終わりで停止' : 'Stops at end of track'); } else setSleep(+v * 60); }
    else if (a === 'src') { S.src = v; }
    else if (a === 'jam') { const k = await ask('Jamendo client_id', 'client_id', jamKey()); if (k) LS.set('jamendo', k); }
    else if (a === 'clrrecent') { recent = []; LS.set('recent', recent); toast(ja ? '消去しました' : 'Cleared'); }
    else if (a === 'clrcnt') { cnt = {}; LS.set('cnt', cnt); toast(ja ? 'リセットしました' : 'Reset'); }
    else if (a === 'clrhist') { shist = []; LS.set('shist', shist); toast(ja ? '消去しました' : 'Cleared'); }
    else if (a === 'bkexp') {
      const data = { v: 1, pl: playlists, fav: [...favs], recent, cnt, pins, name: uname, set: ST, songs: [...lib.values()].filter(x => !x.blob).map(slim) };
      const u = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })), l = document.createElement('a');
      l.href = u; l.download = 'music-backup.json'; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000);
    }
    else if (a === 'bkimp') {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
      inp.onchange = async () => { try { const j = JSON.parse(await inp.files[0].text()); if (j.pl) playlists = j.pl; if (j.fav) favs = new Set(j.fav); if (j.recent) recent = j.recent; if (j.cnt) cnt = j.cnt; if (j.pins) pins = j.pins; if (j.name != null) { uname = j.name; LS.set('name', uname); } if (j.set) { Object.assign(ST, j.set); LS.set('set', ST); applySettings(); applyExtra(); } for (const s of j.songs || []) if (s.id && !lib.has(s.id)) { s.added = s.added || Date.now(); lib.set(s.id, s); await idb.put(s); } saveAll(); LS.set('cnt', cnt); renderSidebar(); render(); toast(ja ? '読み込みました' : 'Imported'); } catch { toast(t('err')); } };
      inp.click();
    }
    else if (a === 'clrcache') { try { for (const k of await caches.keys()) await caches.delete(k); } catch {} toast(ja ? 'キャッシュを消去しました' : 'Cache cleared'); }
    draw(true);
  });
}

/* ============ 歌詞(LRCLIB) / 再生速度 / スリープタイマー ============ */
const lyc = new Map(); let lyLines = null, lyIdx = -1;
function parseLrc(x) { if (!x) return null; const out = []; for (const line of x.split('\n')) { const m = /^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/.exec(line.trim()); if (m) out.push({ t: +m[1] * 60 + +m[2], x: m[3].trim() }); } return out.length ? out : null; }
async function fetchLyrics(tr) {
  if (lyc.has(tr.id)) return lyc.get(tr.id);
  const q = `track_name=${encodeURIComponent(tr.title)}&artist_name=${encodeURIComponent(tr.artist)}`; let res = null;
  try {
    let r = await fetch(`https://lrclib.net/api/get?${q}${tr.album ? '&album_name=' + encodeURIComponent(tr.album) : ''}${tr.dur && tr.src !== 'itunes' ? '&duration=' + Math.round(tr.dur) : ''}`);
    if (r.ok) res = await r.json();
    if (!res || (!res.syncedLyrics && !res.plainLyrics)) { r = await fetch(`https://lrclib.net/api/search?${q}`); if (r.ok) { const arr = await r.json(); res = arr.find(x => x.syncedLyrics) || arr.find(x => x.plainLyrics) || null; } }
  } catch {}
  const out = res ? { synced: parseLrc(res.syncedLyrics), plain: res.plainLyrics || '' } : null;
  lyc.set(tr.id, out); return out;
}
function lyricSync(force) {
  if (!lyLines || !np.classList.contains('mode-lyrics')) return;
  const c = au.currentTime + .25; let i = -1;
  for (let k = 0; k < lyLines.length; k++) { if (lyLines[k].t <= c) i = k; else break; }
  if (i === lyIdx && !force) return; lyIdx = i;
  const panel = $('.nppanel', np), rows = $$('.lyl', panel);
  rows.forEach((r, k) => { r.classList.toggle('on', k === i); r.classList.toggle('past', k < i); });
  const a = rows[i]; if (a) panel.scrollTo({ top: a.offsetTop - panel.clientHeight / 2 + a.offsetHeight / 2, behavior: 'smooth' });
}
const RATES = [.75, 1, 1.25, 1.5, 2];
const speedItem = () => ({ label: (ja ? '再生速度: ' : 'Speed: ') + au.playbackRate + '×', icon: 'clock', sub: RATES.map(r => ({ label: r + '×' + (au.playbackRate === r ? ' ✓' : ''), icon: 'play', act: () => { au.defaultPlaybackRate = r; au.playbackRate = r; au.preservesPitch = true; toast((ja ? '再生速度 ' : 'Speed ') + r + '×'); } })) });
let sleepT = 0;
function fadePause() { const v = au.volume; let i = 0; const iv = setInterval(() => { i++; au.volume = Math.max(0, v * (1 - i / 30)); if (i >= 30) { clearInterval(iv); au.pause(); au.volume = v; } }, 100); }
function setSleep(sec) { clearTimeout(sleepT); S.sleepEnd = false; if (!sec) return toast(ja ? 'スリープタイマー オフ' : 'Sleep timer off'); toast((ja ? 'スリープタイマー ' : 'Sleep timer ') + Math.round(sec / 60) + (ja ? '分' : ' min')); sleepT = setTimeout(fadePause, sec * 1000); }
const sleepItem = () => ({ label: ja ? 'スリープタイマー' : 'Sleep Timer', icon: 'clock', sub: [15, 30, 45, 60].map(m => ({ label: m + (ja ? '分' : ' min'), icon: 'clock', act: () => setSleep(m * 60) })).concat([{ label: ja ? 'この曲の終わりまで' : 'End of Track', icon: 'clock', act: () => { clearTimeout(sleepT); S.sleepEnd = true; toast(ja ? 'この曲の後に停止します' : 'Will stop after this track'); } }, { label: ja ? 'オフ' : 'Off', icon: 'xmark', act: () => setSleep(0) }]) });

/* ============ Liquid Glass 背景屈折(ミニプレイヤー / 上部タブバー) ============
   背後のコンテンツ(#main)を複製してガラス内に敷き、縁だけ強く曲げる変位マップ(SVG feDisplacementMap)で屈折。
   RGBで曲げ量をずらして色収差も出す。backdrop-filter+url()が使えないSafari/iPadでも動く方式。 */
const RF = []; let RFG = 0, lensFid = '', rfRaf = 0, rfUntil = 0, rfT = 0, rfS = 0;
const SVGNS = 'http://www.w3.org/2000/svg';
const glassOn = () => LS.get('rf', 'on') !== 'off';
const glassItem = () => ({ label: (ja ? 'ガラスの屈折効果: ' : 'Glass refraction: ') + (glassOn() ? (ja ? 'オン' : 'On') : (ja ? 'オフ' : 'Off')), icon: glassOn() ? 'check' : 'xmark', act: () => { LS.set('rf', glassOn() ? 'off' : 'on'); document.body.classList.toggle('rf-off', !glassOn()); if (glassOn()) { rfClone(); rfSizes(); } toast(glassOn() ? (ja ? '屈折効果 オン' : 'Refraction on') : (ja ? '屈折効果 オフ' : 'Refraction off')); } });
function sdRR(px, py, w, h, r) {
  const dx = Math.abs(px - w / 2) - (w / 2 - r), dy = Math.abs(py - h / 2) - (h / 2 - r);
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - r;
}
function rfMap(w, h, B) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'), im = g.createImageData(w, h), d = im.data, r = Math.min(h / 2, w / 2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const px = x + .5, py = y + .5, depth = -sdRR(px, py, w, h, r); let dx = 0, dy = 0;
    if (depth < B) {
      const e = .75, gx = sdRR(px + e, py, w, h, r) - sdRR(px - e, py, w, h, r), gy = sdRR(px, py + e, w, h, r) - sdRR(px, py - e, w, h, r), gl = Math.hypot(gx, gy) || 1;
      const s = Math.pow(1 - Math.max(0, depth) / B, 1.6);
      dx = -gx / gl * s; dy = -gy / gl * s;          // 縁ほど内側の像を引き寄せる(凸レンズ)
    }
    const i = (y * w + x) * 4; d[i] = 128 + 127 * dx; d[i + 1] = 128 + 127 * dy; d[i + 2] = 128; d[i + 3] = 255;
  }
  g.putImageData(im, 0, 0); return c.toDataURL();
}
function rfFilter(r) {
  const { w, h, B } = r, url = rfMap(w, h, B), S0 = 2 * B * (r.k || 1.3); /* 縁の曲げ量=B*1.3: 縁の幅を超えて折り返し、文字が外側へ流れ反転して見える */
  const nid = r.id + 'g' + (++RFG);
  const f = document.createElementNS(SVGNS, 'filter');
  f.id = nid; f.setAttribute('x', 0); f.setAttribute('y', 0); f.setAttribute('width', w); f.setAttribute('height', h);
  f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
  const ch = (k, sc, m) => `<feDisplacementMap in="SourceGraphic" in2="m" scale="${sc}" xChannelSelector="R" yChannelSelector="G" result="d${k}"/><feColorMatrix in="d${k}" type="matrix" values="${m}" result="c${k}"/>`;
  f.innerHTML = `<feImage href="${url}" xlink:href="${url}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="m"/>`
    + ch('r', S0, '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0') + ch('g', S0 * .92, '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0') + ch('b', S0 * .84, '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0')
    + '<feBlend in="cr" in2="cg" mode="screen" result="rg"/><feBlend in="rg" in2="cb" mode="screen"/>';
  $('#rfdefs').appendChild(f); return nid;
}
function rfSizes() {
  RF.forEach(r => {
    const w = r.el.offsetWidth, h = r.el.offsetHeight; if (!w || !h || (w === r.w && h === r.h)) return;
    r.w = w; r.h = h; r.B = Math.min(h * .4, 24); r.rfm.style.setProperty('--rfw', Math.max(8, Math.round(r.B * .5)) + 'px'); r.k = 1.6 * ST.refr; try { const nid = rfFilter(r); r.rfm.style.filter = r.rfm.style.webkitFilter = `url(#${nid})`; if (r.cur) { const o = document.getElementById(r.cur); if (o) o.remove(); } r.cur = nid; } catch {}
  });
}
function rfClone() {
  if (!glassOn()) return;
  const page = $('#main .page'); if (!page) return;
  RF.forEach(r => {
    const c = page.cloneNode(true); c.removeAttribute('id'); $$('[id]', c).forEach(e => e.removeAttribute('id')); c.setAttribute('aria-hidden', 'true');
    r.rfc.replaceChildren(c);
  });
  rfKick();
}
function posIn(el) { let x = 0, y = 0, e = el; const app = $('#app'); while (e && e !== app) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y }; }
function rfUpdate() {
  rfRaf = 0; if (!glassOn()) return;
  const mr = main.getBoundingClientRect(), cs = getComputedStyle(main);
  RF.forEach(r => {
    if (!r.el.offsetWidth) return; const p = posIn(r.el);
    r.rfc.style.width = main.clientWidth + 'px'; r.rfc.style.padding = cs.padding;
    r.rfc.style.transform = `translate(${(mr.left - p.x).toFixed(1)}px,${(mr.top - main.scrollTop - p.y).toFixed(1)}px)`;
  });
  if (performance.now() < rfUntil) rfRaf = requestAnimationFrame(rfUpdate);
}
function rfKick(ms = 0) { rfUntil = Math.max(rfUntil, performance.now() + ms); if (!rfRaf) rfRaf = requestAnimationFrame(rfUpdate); }
function rfInit() {
  document.body.classList.toggle('rf-off', !glassOn());
  const svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.style.cssText = 'position:absolute;pointer-events:none'; svg.innerHTML = '<defs id="rfdefs"></defs>'; document.body.append(svg);
  buildPhone(); [mini, $('#topbar .tbar'), $('#ptab .pt'), $('#ptab .ps')].forEach((el, i) => {
    if (!el) return;
    const rfm = document.createElement('div'); rfm.className = 'rfm'; rfm.innerHTML = '<div class="rfc"></div>';
    el.classList.add('rf'); el.prepend(rfm);
    RF.push({ el, rfm, rfc: rfm.firstChild, id: 'rf' + i, w: 0, h: 0 });
  });
  new MutationObserver(() => { clearTimeout(rfT); rfT = setTimeout(rfClone, 90); }).observe(main, { childList: true, subtree: true, characterData: true });
  main.addEventListener('scroll', () => rfKick(), { passive: true });
  const sched = () => { clearTimeout(rfS); rfS = setTimeout(() => { rfSizes(); rfKick(); }, 160); };
  addEventListener('resize', sched);
  if (window.ResizeObserver) { const ro = new ResizeObserver(sched); RF.forEach(r => ro.observe(r.el)); }
  rfSizes(); rfClone(); rfKick(1000);
}

/* ============ 起動 ============ */
(async function init() {
  applySettings(); applyExtra();
  ['top', 'bot'].forEach(k => { const d = document.createElement('div'); d.className = 'edge ' + k; $('#app').insertBefore(d, $('#mini')); });
  setSB(S.sb);
  buildTop(); applyMode(true); applyPhone(); rfInit();
  await idb.init();
  (await idb.all()).forEach(x => lib.set(x.id, x));
  renderSidebar(); render(); ui();
  try { if (ST.resume) restoreResume(); } catch {}
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
})();
