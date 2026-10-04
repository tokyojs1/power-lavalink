# PowerLavalink

مكتبة Lavalink v4 لـ Node.js وTypeScript لإدارة الصوت والطوابير والفلاتر.

A Lavalink v4 client for Node.js and TypeScript with playback queues and audio filters.

Created by **Power Development**.

## التثبيت · Installation

```sh
npm install power-lavalink
```

تحتاج Node.js 20+ ومشروع ESM وخادم Lavalink v4. فعّل `Guilds` و`GuildVoiceStates` في عميل Discord، مع صلاحيات الاتصال والتحدث.

Requires Node.js 20+, ESM and Lavalink v4. Enable the Discord `Guilds` and `GuildVoiceStates` intents and grant Connect/Speak permissions.

## الاتصال · Connection

المثال يستخدم عميل Discord.js باسم `discord` بعد تسجيل دخوله. ضع كلمة مرور الخادم في `lavalink_password`.

Use a logged-in Discord.js client named `discord` and set the server password in `lavalink_password`.

```js
import {
  PowerLavalink as powerlavalink,
  DiscordJSAdapter as discordjsadapter,
} from 'power-lavalink';

if (!discord.user) throw new Error('Discord is not ready');
const password = process.env.lavalink_password;
if (!password) throw new Error('lavalink_password is required');

const power = new powerlavalink({
  userId: discord.user.id,
  nodes: [{ id: 'main', host: '127.0.0.1', port: 2333, password }],
  adapter: new discordjsadapter((guildid, payload) => {
    const guild = discord.guilds.cache.get(guildid);
    if (!guild) throw new Error('Guild not found');
    guild.shard.send(payload);
  }),
});

discord.on('raw', (packet) => {
  power.handleVoiceUpdate(packet).catch((error) => console.error(error.code));
});
power.on('nodeError', ({ error }) => console.error(error.code));
power.on('playerError', ({ error }) => console.error(error.code));
power.on('clientError', ({ error }) => console.error(error.code));

await power.connect();
```

## التشغيل · Playback

استخدم معرّفي السيرفر والقناة في `guildid` و`channelid`. يحتاج `scsearch` إلى تفعيل SoundCloud على الخادم.

Set `guildid` and `channelid` to your guild and voice channel IDs. Enable SoundCloud on Lavalink to use `scsearch`.

```js
const powerplayer = await power.createPlayer({
  guildId: guildid,
  voiceChannelId: channelid,
});
await powerplayer.waitForVoice();

const result = await power.search('ambient piano', { source: 'scsearch' });
if (result.loadType === 'error') throw new Error(result.exception.message);
if (result.tracks.length) {
  powerplayer.queue.add(result.tracks);
  await powerplayer.play();
}
```

| الوظيفة · Action | الاستخدام · Method |
| --- | --- |
| إيقاف مؤقت · Pause | `await powerplayer.pause()` |
| استئناف · Resume | `await powerplayer.resume()` |
| تخطي · Skip | `await powerplayer.skip()` |
| إيقاف · Stop | `await powerplayer.stop()` |
| الانتقال إلى دقيقة · Seek | `await powerplayer.seek(60000)` |
| مستوى الصوت · Volume | `await powerplayer.setVolume(100)` |
| حذف المشغّل · Destroy player | `await powerplayer.destroy()` |
| إغلاق الاتصال · Shutdown | `await power.destroy()` |

المواضع بالميلي ثانية، ومستوى الصوت من 0 إلى 1000. `play()` يشغّل التالي؛ `play(track)` يشغّل مسارًا محددًا. يوجد مشغّل واحد لكل سيرفر.

Positions use milliseconds; volume ranges from 0 to 1000. `play()` plays the next queued item; `play(track)` plays a specific track. Each guild has one player.

## الطابور والفلاتر · Queue and filters

```js
powerplayer.queue.repeat = 'queue';
powerplayer.queue.shuffle();
powerplayer.queue.fairShuffle();
powerplayer.queue.deduplicate();

await powerplayer.filters.set({ timescale: { speed: 1.1 } });
await powerplayer.filters.clear();
```

التكرار يقبل `off` و`track` و`queue`. الخلط العادل يستخدم `userData.requester`. البحث الافتراضي يستخدم `ytsearch`، ويمكن اختيار مصدر آخر أو تمرير رابط.

Repeat modes are `off`, `track` and `queue`. Requester rotation uses `userData.requester`. Search defaults to `ytsearch`; choose another source or pass a URL.

## الأحداث · Events

```js
power.on('trackStart', ({ player: powerplayer, track }) => {
  console.log(powerplayer.guildId, track.info.title);
});
power.on('queueEnd', ({ player: powerplayer }) => console.log(powerplayer.guildId));
```

الأحداث تحمل كائنًا واحدًا. استخدم `on` و`once` و`off` لإدارة المستمعات، و`error.code` لمعرفة نوع الخطأ.

Events carry one object payload. Use `on`, `once` and `off` to manage listeners and `error.code` to identify failures.

## خيارات إضافية · More features

| الميزة · Feature | الواجهة · API |
| --- | --- |
| البحث بمصادر بديلة · Source fallback | `power.searchWithFallback()` |
| البحث داخل الطابور وحفظه · Queue search and serialization | `queue.find()`, `queue.serialize()`, `queue.deserialize()` |
| حفظ المشغّلات واستعادتها · Player persistence | `FilePlayerStore`, `persistence` |
| مسارات مؤجلة · Lazy tracks | `UnresolvedTrack` |
| حدود الطابور والأوامر · Queue and command limits | `player.maxQueueSize`, `player.maxPendingCommands` |
| سياسات أخطاء التشغيل · Failure handling | `player.failurePolicy` |
| تشغيل تلقائي عبر دالة توصيات · Autoplay callback | `player.autoplay`, `queue.autoplay` |
| إلغاء الطلبات · Cancellation | `{ signal }` |
| التحقق من المصادر والفلاتر · Capability validation | `validation`, `node.capabilities` |
| اختيار الخوادم ونقل المشغّلات · Node selection and migration | `nodeSelection`, `failover`, `powerplayer.moveTo()` |
| SponsorBlock وLavaLyrics | `powerplayer.sponsorBlock`, `powerplayer.lyrics` |
| التشخيص والمقاييس · Diagnostics and metrics | `power.diagnose()`, `power.metrics.get()` |
| التخزين المؤقت وإضافات العميل · Caching and client plugins | `cache`, `power.use()` |

إعدادات الحفظ والتوصيات وسياسات الأخطاء اختيارية. إضافتا SponsorBlock وLavaLyrics تحتاجان تثبيتًا على الخادم. تعريفات الخيارات والأحداث متوفرة في [index.d.ts](dist/index.d.ts).

Persistence, recommendations and failure policies are optional. SponsorBlock and LavaLyrics require server plugins. Full option and event types are available in [index.d.ts](dist/index.d.ts).

## الترخيص · License

[MIT](LICENSE) © 2026 **Power Development**
