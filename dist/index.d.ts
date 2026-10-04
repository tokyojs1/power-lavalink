declare const sponsorCategories: readonly ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "filler"];
type SponsorCategory = (typeof sponsorCategories)[number];
interface SponsorSegment {
    category: SponsorCategory;
    start: number;
    end: number;
}
interface SponsorChapter {
    name: string;
    start: number;
    end: number;
    duration: string | number;
}
interface LyricsLine {
    timestamp: number;
    duration: number | null;
    line: string;
    plugin: Record<string, unknown>;
}
interface Lyrics {
    sourceName: string;
    provider: string;
    text: string | null;
    lines: LyricsLine[];
    plugin: Record<string, unknown>;
}
type ServerPluginEvent = {
    op: 'event';
    guildId: string;
} & ({
    type: 'SegmentsLoaded';
    segments: SponsorSegment[];
} | {
    type: 'SegmentSkipped';
    segment: SponsorSegment;
} | {
    type: 'ChaptersLoaded';
    chapters: SponsorChapter[];
} | {
    type: 'ChapterStarted';
    chapter: SponsorChapter;
} | {
    type: 'LyricsFoundEvent';
    lyrics: Lyrics;
} | {
    type: 'LyricsNotFoundEvent';
} | {
    type: 'LyricsLineEvent';
    lineIndex: number;
    line: LyricsLine;
    skipped: boolean;
});
declare const validLyricsLine: (value: unknown) => value is LyricsLine;
declare const validLyrics: (value: unknown) => value is Lyrics;
declare function isServerPluginEvent(value: {
    type?: unknown;
}): value is ServerPluginEvent;
declare function validServerPluginEvent(value: Record<string, unknown>): boolean;

interface Logger {
    debug(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    trace?(...args: unknown[]): void;
}
type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
declare class SafeLogger {
    private readonly logger?;
    private readonly level;
    constructor(logger?: Logger | undefined, level?: LogLevel);
    write(level: Exclude<LogLevel, 'silent'>, message: string, context?: {
        node?: string;
        guildId?: string;
        code?: string;
    }): void;
}

interface TrackInfo {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    position: number;
    title: string;
    uri: string | null;
    artworkUrl: string | null;
    isrc: string | null;
    sourceName: string;
}
interface TrackData {
    encoded: string;
    info: TrackInfo;
    pluginInfo: Record<string, unknown>;
    userData: Record<string, unknown>;
}
interface PlaylistInfo {
    name: string;
    selectedTrack: number;
}
interface TrackException {
    message: string | null;
    severity: 'common' | 'suspicious' | 'fault';
    cause: string;
    causeStackTrace?: string;
}
type LoadResult = {
    loadType: 'track';
    data: TrackData;
} | {
    loadType: 'playlist';
    data: {
        info: PlaylistInfo;
        pluginInfo: Record<string, unknown>;
        tracks: TrackData[];
    };
} | {
    loadType: 'search';
    data: TrackData[];
} | {
    loadType: 'empty';
    data: null | Record<string, never>;
} | {
    loadType: 'error';
    data: TrackException;
};
interface EqualizerBand {
    band: number;
    gain: number;
}
interface FilterData {
    volume?: number;
    equalizer?: EqualizerBand[];
    karaoke?: {
        level?: number;
        monoLevel?: number;
        filterBand?: number;
        filterWidth?: number;
    };
    timescale?: {
        speed?: number;
        pitch?: number;
        rate?: number;
    };
    tremolo?: {
        frequency?: number;
        depth?: number;
    };
    vibrato?: {
        frequency?: number;
        depth?: number;
    };
    rotation?: {
        rotationHz?: number;
    };
    distortion?: {
        sinOffset?: number;
        sinScale?: number;
        cosOffset?: number;
        cosScale?: number;
        tanOffset?: number;
        tanScale?: number;
        offset?: number;
        scale?: number;
    };
    channelMix?: {
        leftToLeft?: number;
        leftToRight?: number;
        rightToLeft?: number;
        rightToRight?: number;
    };
    lowPass?: {
        smoothing?: number;
    };
    pluginFilters?: Record<string, unknown>;
}
interface VoiceState {
    token: string;
    endpoint: string;
    sessionId: string;
    channelId?: string | null;
}
interface PlayerState {
    time: number;
    position: number;
    connected: boolean;
    ping: number;
}
interface RemotePlayer {
    guildId: string;
    track: TrackData | null;
    volume: number;
    paused: boolean;
    state: PlayerState;
    voice: VoiceState;
    filters: FilterData;
}
type UpdateTrack = ({
    encoded: string | null;
    identifier?: never;
} | {
    identifier: string;
    encoded?: never;
}) & {
    userData?: Record<string, unknown>;
};
interface PlayerUpdate {
    track?: UpdateTrack;
    position?: number;
    endTime?: number | null;
    volume?: number;
    paused?: boolean;
    filters?: FilterData;
    voice?: VoiceState;
}
interface NodeStats {
    players: number;
    playingPlayers: number;
    uptime: number;
    memory: {
        free: number;
        used: number;
        allocated: number;
        reservable: number;
    };
    cpu: {
        cores: number;
        systemLoad: number;
        lavalinkLoad: number;
    };
    frameStats?: {
        sent: number;
        nulled: number;
        deficit: number;
    } | null;
}
interface NodeInfo {
    version: {
        semver: string;
        major: number;
        minor: number;
        patch: number;
        preRelease: string | null;
        build: string | null;
    };
    buildTime: number;
    git: {
        branch: string;
        commit: string;
        commitTime: number;
    };
    jvm: string;
    lavaplayer: string;
    sourceManagers: string[];
    filters: string[];
    plugins: {
        name: string;
        version: string;
    }[];
}
interface RoutePlannerStatus {
    class: string | null;
    details: {
        ipBlock: {
            type: string;
            size: string;
        };
        failingAddresses: {
            failingAddress: string;
            failingTimestamp: number;
            failingTime: string;
        }[];
        [key: string]: unknown;
    } | null;
}
type TrackEndReason = 'finished' | 'loadFailed' | 'stopped' | 'replaced' | 'cleanup';
type TrackEvent = {
    op: 'event';
    guildId: string;
} & ({
    type: 'TrackStartEvent';
    track: TrackData;
} | {
    type: 'TrackEndEvent';
    track: TrackData;
    reason: TrackEndReason;
} | {
    type: 'TrackExceptionEvent';
    track: TrackData;
    exception: TrackException;
} | {
    type: 'TrackStuckEvent';
    track: TrackData;
    thresholdMs: number;
} | {
    type: 'WebSocketClosedEvent';
    code: number;
    reason: string;
    byRemote: boolean;
});
type NodeMessage = ServerPluginEvent | {
    op: 'ready';
    resumed: boolean;
    sessionId: string;
} | {
    op: 'playerUpdate';
    guildId: string;
    state: PlayerState;
} | ({
    op: 'stats';
} & NodeStats) | TrackEvent;

declare class Track implements TrackData {
    readonly encoded: string;
    readonly info: TrackInfo;
    readonly pluginInfo: Record<string, unknown>;
    readonly userData: Record<string, unknown>;
    constructor(data: TrackData);
    toJSON(): TrackData;
    serialize(): string;
    static deserialize(value: string | TrackData): Track;
}
type SearchResult = {
    loadType: 'track';
    tracks: [Track];
    playlistInfo: null;
} | {
    loadType: 'search';
    tracks: Track[];
    playlistInfo: null;
} | {
    loadType: 'playlist';
    tracks: Track[];
    playlistInfo: PlaylistInfo;
    pluginInfo: Record<string, unknown>;
} | {
    loadType: 'empty';
    tracks: [];
    playlistInfo: null;
} | {
    loadType: 'error';
    tracks: [];
    playlistInfo: null;
    exception: TrackException;
};
declare function normalizeLoadResult(result: LoadResult): SearchResult;

interface VoiceUpdate {
    guildId: string;
    channelId: string | null;
    selfMute: boolean;
    selfDeaf: boolean;
}
interface VoiceAdapter {
    sendVoiceUpdate(update: VoiceUpdate): Promise<void>;
}
type DiscordVoicePacket = {
    t: 'VOICE_STATE_UPDATE';
    d: {
        guild_id: string;
        user_id: string;
        session_id: string;
        channel_id: string | null;
    };
} | {
    t: 'VOICE_SERVER_UPDATE';
    d: {
        guild_id: string;
        token: string;
        endpoint: string | null;
    };
};
declare class VoiceManager {
    private readonly client;
    private readonly states;
    constructor(client: LavalinkClient);
    connect(player: Player, channelId: string, selfDeaf?: boolean): Promise<void>;
    handle(packet: DiscordVoicePacket): Promise<void>;
    disconnect(player: Player): Promise<void>;
    forget(guildId: string): void;
    destroy(): void;
}

interface SearchOptions {
    nodeId?: string;
    source?: string;
    signal?: AbortSignal;
}
interface FallbackSearchOptions {
    nodeId?: string;
    signal?: AbortSignal;
    sources: readonly string[];
    fallbackOnError?: boolean;
}
interface SearchAttempt {
    source: string | null;
    loadType?: SearchResult['loadType'];
    errorCode?: string;
}
interface FallbackSearchResult {
    result: SearchResult;
    source: string | null;
    attempts: SearchAttempt[];
}

interface UnresolvedTrackOptions {
    title: string;
    author?: string;
    duration?: number;
    uri?: string;
    sources?: readonly string[];
    userData?: Record<string, unknown>;
}
interface UnresolvedTrackData extends TrackData {
    unresolved: UnresolvedTrackOptions;
}
declare class UnresolvedTrack extends Track {
    readonly unresolved: UnresolvedTrackOptions;
    constructor(options: UnresolvedTrackOptions, identity?: string);
    resolve(client: LavalinkClient, options?: SearchOptions): Promise<Track>;
    toJSON(): UnresolvedTrackData;
}
declare function deserializeTrack(data: TrackData | UnresolvedTrackData): Track;

type RepeatMode = 'off' | 'track' | 'queue';
interface QueueOptions {
    historyLimit?: number;
    maxSize?: number;
}
interface QueueQuery {
    text?: string;
    requester?: string;
    source?: string;
    minDuration?: number;
    maxDuration?: number;
}
interface SerializedQueue {
    version: 1;
    current: TrackData | null;
    upcoming: TrackData[];
    history: TrackData[];
    repeat: RepeatMode;
    autoplay: boolean;
}
declare class Queue implements Iterable<Track> {
    private items;
    private past;
    current: Track | null;
    repeat: RepeatMode;
    autoplay: boolean;
    readonly historyLimit: number;
    readonly maxSize: number;
    constructor(options?: number | QueueOptions);
    get upcoming(): readonly Track[];
    get history(): readonly Track[];
    get size(): number;
    add(tracks: Track | readonly Track[]): this;
    private capacity;
    find(query: QueueQuery): {
        index: number;
        track: Track;
    }[];
    deduplicate(key?: (track: Track) => string): number;
    fairShuffle(key?: (track: Track) => string): this;
    private index;
    remove(index: number): Track;
    clear(history?: boolean): void;
    shuffle(random?: () => number): this;
    reverse(): this;
    move(from: number, to: number): this;
    private remember;
    setCurrent(track: Track | null): void;
    next(force?: boolean, requeueCurrent?: boolean): Track | null;
    previous(): Track | null;
    jump(index: number): Track;
    snapshot(): {
        current: Track | null;
        upcoming: Track[];
        history: Track[];
    };
    restore(snapshot: ReturnType<Queue['snapshot']>): void;
    toJSON(): SerializedQueue;
    serialize(): string;
    deserialize(value: string | SerializedQueue): this;
    [Symbol.iterator](): Iterator<Track>;
}

interface PlayerSnapshot {
    version: 1;
    guildId: string;
    nodeId: string;
    voiceChannelId?: string;
    textChannelId?: string;
    position: number;
    volume: number;
    paused: boolean;
    endTime: number | null;
    filters: FilterData;
    queue: SerializedQueue;
    savedAt: number;
}
interface PlayerStore {
    keys(): Promise<string[]>;
    load(guildId: string): Promise<PlayerSnapshot | undefined>;
    save(snapshot: PlayerSnapshot): Promise<void>;
    delete(guildId: string): Promise<void>;
}
declare function validatePlayerSnapshot(value: PlayerSnapshot): PlayerSnapshot;

interface NodeOptions {
    id: string;
    host: string;
    port?: number;
    password: string;
    secure?: boolean;
    priority?: number;
}
interface RetryOptions {
    enabled?: boolean;
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    jitter?: number;
}
interface ReconnectOptions extends RetryOptions {
    heartbeatInterval?: number;
    heartbeatTimeout?: number;
    connectTimeout?: number;
}
interface PlayerOptions {
    guildId: string;
    voiceChannelId?: string;
    textChannelId?: string;
    nodeId?: string;
    volume?: number;
}
interface ClientOptions {
    nodes: NodeOptions[];
    userId?: string;
    clientName?: string;
    adapter?: VoiceAdapter;
    retry?: RetryOptions;
    reconnect?: ReconnectOptions;
    requestTimeout?: number;
    session?: {
        resuming?: boolean;
        timeout?: number;
    };
    logging?: {
        level?: LogLevel;
    };
    logger?: Logger;
    metrics?: boolean;
    cache?: {
        enabled?: boolean;
        ttl?: number;
        maxSize?: number;
    };
    player?: {
        autoResume?: boolean;
        autoDestroy?: boolean;
        historyLimit?: number;
        maxQueueSize?: number;
        maxPendingCommands?: number;
        failurePolicy?: {
            onStuck?: 'none' | 'skip' | 'stop';
            onException?: 'none' | 'skip' | 'stop';
            maxConsecutiveFailures?: number;
        };
        autoplay?: (player: Player) => Promise<Track | null>;
    };
    failover?: {
        enabled?: boolean;
        concurrency?: number;
        selectNode?: (player: Player, available: LavalinkNode[]) => LavalinkNode | undefined;
    };
    nodeSelection?: {
        strategy?: 'least-load' | 'least-players';
        select?: (nodes: LavalinkNode[]) => LavalinkNode | undefined;
    };
    validation?: {
        enabled?: boolean;
        sourceAliases?: Record<string, string>;
    };
    unresolved?: {
        resolve?: (track: UnresolvedTrack, options: SearchOptions) => Promise<Track>;
        durationTolerance?: number;
        minMatchScore?: number;
    };
    persistence?: {
        store: PlayerStore;
        interval?: number;
        restoreOnConnect?: boolean;
        restoreVoice?: boolean;
        maxAge?: number;
    };
}

interface MetricsSnapshot {
    nodes: number;
    players: number;
    connections: number;
    reconnects: number;
    requests: number;
    errors: number;
    latency: number;
}
declare class Metrics {
    readonly enabled: boolean;
    private readonly counts;
    private counters;
    constructor(enabled: boolean, counts: () => {
        nodes: number;
        players: number;
    });
    increment(key: 'connections' | 'reconnects' | 'requests' | 'errors'): void;
    observeLatency(ms: number): void;
    get(): Readonly<MetricsSnapshot>;
}

declare class V4Protocol {
    readonly websocketPath = "/v4/websocket";
    readonly apiPrefix = "/v4";
    decode(raw: string): NodeMessage | null;
}

interface RESTOptions {
    retry?: RetryOptions;
    timeout?: number;
    metrics?: Metrics;
    cache?: {
        enabled?: boolean;
        ttl?: number;
        maxSize?: number;
    };
    fetch?: typeof globalThis.fetch;
}
interface RESTRequestOptions {
    signal?: AbortSignal;
}
declare class RESTClient {
    private readonly nodeId;
    private readonly options;
    private readonly protocol;
    private readonly password;
    private readonly baseURL;
    private readonly cache?;
    private readonly abort;
    private readonly fetcher;
    private readonly pending;
    constructor(nodeId: string, config: NodeOptions, options?: RESTOptions, protocol?: V4Protocol);
    private request;
    private requestInternal;
    loadTracks(identifier: string, options?: RESTRequestOptions): Promise<LoadResult>;
    decodeTrack(encoded: string, options?: RESTRequestOptions): Promise<TrackData>;
    decodeTracks(encoded: readonly string[], options?: RESTRequestOptions): Promise<TrackData[]>;
    getInfo(options?: RESTRequestOptions): Promise<NodeInfo>;
    getVersion(options?: RESTRequestOptions): Promise<string>;
    getStats(options?: RESTRequestOptions): Promise<NodeStats>;
    getRoutePlannerStatus(options?: RESTRequestOptions): Promise<RoutePlannerStatus>;
    unmarkFailedAddress(address: string, options?: RESTRequestOptions): Promise<void>;
    unmarkAllFailedAddresses(options?: RESTRequestOptions): Promise<void>;
    private sessionPath;
    getPlayers(sessionId: string, options?: RESTRequestOptions): Promise<RemotePlayer[]>;
    getPlayer(sessionId: string, guildId: string, options?: RESTRequestOptions): Promise<RemotePlayer>;
    updatePlayer(sessionId: string, guildId: string, data: PlayerUpdate, noReplace?: boolean, options?: RESTRequestOptions): Promise<RemotePlayer>;
    destroyPlayer(sessionId: string, guildId: string, options?: RESTRequestOptions): Promise<void>;
    updateSession(sessionId: string, resuming: boolean, timeout: number, options?: RESTRequestOptions): Promise<{
        resuming: boolean;
        timeout: number;
    }>;
    clearCache(): void;
    private pluginPlayerPath;
    getSponsorBlockCategories(sessionId: string, guildId: string, options?: RESTRequestOptions): Promise<SponsorCategory[]>;
    setSponsorBlockCategories(sessionId: string, guildId: string, categories: readonly SponsorCategory[], options?: RESTRequestOptions): Promise<void>;
    deleteSponsorBlockCategories(sessionId: string, guildId: string, options?: RESTRequestOptions): Promise<void>;
    getTrackLyrics(encoded: string, skipTrackSource?: boolean, options?: RESTRequestOptions): Promise<Lyrics | undefined>;
    getCurrentLyrics(sessionId: string, guildId: string, skipTrackSource?: boolean, options?: RESTRequestOptions): Promise<Lyrics | undefined>;
    subscribeLyrics(sessionId: string, guildId: string, skipTrackSource?: boolean, options?: RESTRequestOptions): Promise<void>;
    unsubscribeLyrics(sessionId: string, guildId: string, options?: RESTRequestOptions): Promise<void>;
    destroy(): void;
    toJSON(): {
        node: string;
    };
}

declare class SessionManager {
    private readonly options;
    id?: string;
    resumed: boolean;
    constructor(options?: {
        resuming?: boolean;
        timeout?: number;
    });
    ready(sessionId: string, resumed: boolean, rest: RESTClient): Promise<void>;
    clear(): void;
}

interface ErrorContext {
    cause?: unknown;
    node?: string;
    guildId?: string;
    statusCode?: number;
}
declare class LavalinkError extends Error {
    readonly code: string;
    readonly node?: string;
    readonly guildId?: string;
    readonly statusCode?: number;
    constructor(code: string, message: string, context?: ErrorContext);
}
declare class NodeError extends LavalinkError {
}
declare class RESTError extends LavalinkError {
}
declare class WebSocketError extends LavalinkError {
}
declare class PlayerError extends LavalinkError {
}
declare class TrackError extends LavalinkError {
}
declare class VoiceError extends LavalinkError {
}
declare class TimeoutError extends LavalinkError {
}
declare class AuthenticationError extends LavalinkError {
}
declare class ConnectionError extends LavalinkError {
}

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'destroyed';
interface TransportCallbacks {
    message(message: NodeMessage): void;
    close(code: number): void;
    error(error: LavalinkError): void;
    reconnect(attempt: number): void;
}
declare class WebSocketTransport {
    private readonly config;
    private readonly options;
    private readonly identity;
    private readonly callbacks;
    private readonly protocol;
    state: ConnectionState;
    ping: number;
    private socket?;
    private heartbeat?;
    private retryTimer?;
    private timeout?;
    private attempt;
    private lastPing;
    private awaitingPong;
    private stopped;
    private pending?;
    private resolve?;
    private reject?;
    constructor(config: NodeOptions, options: ReconnectOptions, identity: () => {
        userId: string;
        clientName: string;
        sessionId?: string;
    }, callbacks: TransportCallbacks, protocol?: V4Protocol);
    connect(): Promise<void>;
    private open;
    private finishPending;
    private startHeartbeat;
    private clearTimers;
    reconnect(): void;
    disconnect(): void;
    destroy(): void;
    toJSON(): {
        node: string;
        state: ConnectionState;
        ping: number;
    };
}

interface CommandOptions {
    signal?: AbortSignal;
}

declare class NodeCapabilities {
    private readonly node;
    constructor(node: LavalinkNode);
    assertSource(source: string, options?: CommandOptions): Promise<void>;
    assertSearch(identifier: string, options?: CommandOptions): Promise<void>;
    assertFilters(filters: FilterData, options?: CommandOptions): Promise<void>;
    requirePlugin(name: 'sponsorblock' | 'lavalyrics', options?: CommandOptions): Promise<void>;
}

type NodeState = 'idle' | 'connecting' | 'ready' | 'unhealthy' | 'destroyed';
declare class LavalinkNode {
    readonly client: LavalinkClient;
    readonly capabilities: NodeCapabilities;
    readonly id: string;
    readonly priority: number;
    readonly rest: RESTClient;
    readonly session: SessionManager;
    readonly transport: WebSocketTransport;
    state: NodeState;
    stats?: NodeStats;
    private generation;
    private connection?;
    private readonly events;
    constructor(client: LavalinkClient, config: NodeOptions);
    get ready(): boolean;
    get ping(): number;
    get playerCount(): number;
    get penalty(): number;
    connect(): Promise<void>;
    private handle;
    checkHealth(): Promise<boolean>;
    private report;
    disconnect(): void;
    destroy(): Promise<void>;
    toJSON(): {
        id: string;
        state: NodeState;
        priority: number;
        players: number;
        ping: number;
    };
}

declare function validateFilters(filters: FilterData): void;
declare class Filters {
    private readonly update;
    private value;
    constructor(update: (filters: FilterData, options?: CommandOptions) => Promise<void>);
    get data(): FilterData;
    get playbackSpeed(): number;
    set(filters: FilterData, options?: CommandOptions): Promise<void>;
    clear(options?: CommandOptions): Promise<void>;
    synchronize(filters: FilterData): void;
}

declare class SponsorBlock {
    private readonly player;
    constructor(player: Player);
    getCategories(options?: CommandOptions): Promise<SponsorCategory[]>;
    setCategories(categories: readonly SponsorCategory[], options?: CommandOptions): Promise<void>;
    clear(options?: CommandOptions): Promise<void>;
}
declare class PlayerLyrics {
    private readonly player;
    constructor(player: Player);
    get(options?: CommandOptions & {
        skipTrackSource?: boolean;
        track?: Track;
    }): Promise<Lyrics | null>;
    subscribe(options?: CommandOptions & {
        skipTrackSource?: boolean;
    }): Promise<void>;
    unsubscribe(options?: CommandOptions): Promise<void>;
    currentLine(lyrics: Lyrics, position?: number): LyricsLine | null;
}

type PlayerLifecycle = 'idle' | 'playing' | 'paused' | 'disconnected' | 'destroyed';
interface PlayOptions extends CommandOptions {
    position?: number;
    endTime?: number | null;
    noReplace?: boolean;
}
declare class Player {
    readonly client: LavalinkClient;
    readonly sponsorBlock: SponsorBlock;
    readonly lyrics: PlayerLyrics;
    readonly guildId: string;
    voiceChannelId?: string;
    textChannelId?: string;
    readonly queue: Queue;
    readonly filters: Filters;
    node: LavalinkNode;
    volume: number;
    paused: boolean;
    state: PlayerLifecycle;
    private voice?;
    private updateTime;
    private basePosition;
    private sampledAt;
    private readonly executor;
    private destroying;
    private destroyWork?;
    private playbackId?;
    private endTime?;
    private readonly seen;
    private readonly retired;
    private lastTrack;
    private connectedToVoice;
    private consecutiveFailures;
    constructor(client: LavalinkClient, options: PlayerOptions, node: LavalinkNode);
    get currentTrack(): Track | null;
    get voiceConnected(): boolean;
    get pendingCommands(): number;
    exportState(): PlayerSnapshot;
    saveState(store?: PlayerStore): Promise<void>;
    restoreState(raw: PlayerSnapshot, options?: CommandOptions): Promise<void>;
    waitForVoice(timeout?: number, options?: CommandOptions): Promise<void>;
    executePlugin<T>(operation: (node: LavalinkNode) => Promise<T>, options?: CommandOptions): Promise<T>;
    get position(): number;
    private assertActive;
    private assertNode;
    private validateVolume;
    private validatePosition;
    private sample;
    private patch;
    private synchronize;
    private rememberEvent;
    private playInternal;
    play(track?: Track, options?: PlayOptions): Promise<void>;
    private update;
    pause(options?: CommandOptions): Promise<void>;
    resume(options?: CommandOptions): Promise<void>;
    stop(options?: CommandOptions): Promise<void>;
    skip(options?: CommandOptions): Promise<void>;
    seek(position: number, options?: CommandOptions): Promise<void>;
    setVolume(volume: number, options?: CommandOptions): Promise<void>;
    setEqualizer(equalizer: EqualizerBand[], options?: CommandOptions): Promise<void>;
    setFilters(filters: FilterData, options?: CommandOptions): Promise<void>;
    setVoice(voice: VoiceState): Promise<void>;
    clearVoice(): Promise<void>;
    connect(options?: {
        guildId?: string;
        channelId?: string;
        selfDeaf?: boolean;
    }): Promise<void>;
    freeze(): void;
    private snapshotUpdate;
    moveTo(target: LavalinkNode): Promise<void>;
    reconcile(node: LavalinkNode, resumed: boolean, remoteExists?: boolean): Promise<void>;
    cleanupAbandoned(node: LavalinkNode): Promise<void>;
    handle(node: LavalinkNode, message: Exclude<NodeMessage, {
        op: 'ready' | 'stats';
    }>): Promise<void>;
    private handlePluginEvent;
    private failure;
    private handleTrackEvent;
    destroy(options?: {
        preserveState?: boolean;
    }): Promise<void>;
    report(error: unknown): void;
    toJSON(): {
        guildId: string;
        node: string;
        state: PlayerLifecycle;
        position: number;
        volume: number;
        paused: boolean;
    };
}

interface RestoreOptions extends CommandOptions {
    connectVoice?: boolean;
    voiceTimeout?: number;
}
interface RestoreReport {
    restored: string[];
    failures: {
        guildId: string;
        code: string;
    }[];
}
declare class PlayerPersistence {
    private readonly client;
    readonly store: PlayerStore;
    private timer?;
    private saving?;
    private readonly restoring;
    constructor(client: LavalinkClient, store: PlayerStore);
    start(interval?: number): void;
    stop(): void;
    flush(): Promise<void>;
    saveAll(): Promise<void>;
    restore(guildId: string, options?: RestoreOptions): Promise<Player>;
    restoreSnapshot(raw: PlayerSnapshot, options?: RestoreOptions): Promise<Player>;
    private restoreSnapshotInternal;
    restoreAll(options?: RestoreOptions): Promise<RestoreReport>;
}

interface ClientEvents {
    ready: {
        client: LavalinkClient;
    };
    nodeConnect: {
        node: LavalinkNode;
        resumed: boolean;
    };
    nodeDisconnect: {
        node: LavalinkNode;
        code: number;
    };
    nodeReconnect: {
        node: LavalinkNode;
        attempt: number;
    };
    nodeError: {
        node: LavalinkNode;
        error: LavalinkError;
    };
    playerCreate: {
        player: Player;
    };
    playerDestroy: {
        player: Player;
    };
    playerMove: {
        player: Player;
        previousNode: LavalinkNode;
        node: LavalinkNode;
    };
    playerUpdate: {
        player: Player;
        state: PlayerState;
    };
    playerError: {
        player: Player;
        error: LavalinkError;
    };
    trackStart: {
        player: Player;
        track: Track;
    };
    trackEnd: {
        player: Player;
        track: Track;
        reason: TrackEndReason;
    };
    trackException: {
        player: Player;
        exception: TrackException;
    };
    trackStuck: {
        player: Player;
        threshold: number;
    };
    voiceClosed: {
        player: Player;
        code: number;
        reason: string;
        byRemote: boolean;
    };
    voiceReady: {
        player: Player;
    };
    queueEnd: {
        player: Player;
    };
    playbackFailureLimit: {
        player: Player;
        failures: number;
        limitReached: boolean;
    };
    playersRestored: RestoreReport;
    sponsorBlockSegmentsLoaded: {
        player: Player;
        segments: SponsorSegment[];
    };
    sponsorBlockSegmentSkipped: {
        player: Player;
        segment: SponsorSegment;
    };
    sponsorBlockChaptersLoaded: {
        player: Player;
        chapters: SponsorChapter[];
    };
    sponsorBlockChapterStarted: {
        player: Player;
        chapter: SponsorChapter;
    };
    lyricsFound: {
        player: Player;
        lyrics: Lyrics;
    };
    lyricsNotFound: {
        player: Player;
    };
    lyricsLine: {
        player: Player;
        lineIndex: number;
        line: LyricsLine;
        skipped: boolean;
    };
    clientError: {
        error: LavalinkError;
    };
}
type Listener<T> = (payload: T) => void | Promise<void>;
declare class EventManager<Events extends object> {
    private readonly listenerError;
    private listeners;
    constructor(listenerError?: (error: unknown, event: keyof Events) => void);
    on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this;
    once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this;
    off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this;
    emit<K extends keyof Events>(event: K, payload: Events[K]): void;
    listenerCount(event: keyof Events): number;
    removeAllListeners(): void;
}

declare class NodeManager {
    private readonly client;
    private readonly nodes;
    constructor(client: LavalinkClient);
    add(config: NodeOptions): LavalinkNode;
    get(id: string): LavalinkNode | undefined;
    all(): LavalinkNode[];
    get size(): number;
    best(exclude?: LavalinkNode): LavalinkNode;
    remove(id: string): Promise<boolean>;
    destroy(): Promise<void>;
}

declare class PlayerManager {
    private readonly client;
    private readonly players;
    private readonly creating;
    private readonly migrations;
    private readonly assignments;
    constructor(client: LavalinkClient);
    get size(): number;
    get(guildId: string): Player | undefined;
    all(): Player[];
    count(node: LavalinkNode): number;
    private assign;
    reassign(player: Player, previous: LavalinkNode): void;
    create(options: PlayerOptions): Promise<Player>;
    private createInternal;
    forget(player: Player): void;
    freeze(node: LavalinkNode): void;
    dispatch(node: LavalinkNode, message: Exclude<NodeMessage, {
        op: 'ready' | 'stats';
    }>): Promise<void>;
    recover(node: LavalinkNode, resumed: boolean): Promise<void>;
    purgeAbandoned(node: LavalinkNode): Promise<void>;
    private pool;
    failover(node: LavalinkNode): Promise<void>;
    rebalanceOrphans(): Promise<void>;
    destroy(): Promise<void>;
}

interface LavalinkPlugin {
    name: string;
    setup?(client: LavalinkClient): void | Promise<void>;
    onClientReady?(payload: ClientEvents['ready']): void | Promise<void>;
    onNodeConnect?(payload: ClientEvents['nodeConnect']): void | Promise<void>;
    onNodeDisconnect?(payload: ClientEvents['nodeDisconnect']): void | Promise<void>;
    onPlayerCreate?(payload: ClientEvents['playerCreate']): void | Promise<void>;
    onTrackStart?(payload: ClientEvents['trackStart']): void | Promise<void>;
    onTrackEnd?(payload: ClientEvents['trackEnd']): void | Promise<void>;
    destroy?(client: LavalinkClient): void | Promise<void>;
}

interface NodeDiagnostic {
    id: string;
    state: NodeState;
    ready: boolean;
    players: number;
    ping: number | null;
    version?: string;
    sources?: string[];
    filters?: string[];
    plugins?: {
        name: string;
        version: string;
    }[];
    errorCode?: string;
}
interface DiagnosticReport {
    state: ClientState;
    players: number;
    nodes: NodeDiagnostic[];
}

type ClientState = 'idle' | 'connecting' | 'ready' | 'destroying' | 'destroyed';
declare class LavalinkClient extends EventManager<ClientEvents> {
    readonly options: ClientOptions;
    readonly nodes: NodeManager;
    readonly players: PlayerManager;
    readonly voice: VoiceManager;
    readonly metrics: Metrics;
    readonly logger: SafeLogger;
    readonly persistence?: PlayerPersistence;
    state: ClientState;
    userId: string;
    private connection?;
    private destruction?;
    private healthTimer?;
    private healthRunning;
    private readonly plugins;
    private readonly setups;
    constructor(options: ClientOptions);
    get closing(): boolean;
    private validateOptions;
    connect(userId?: string): Promise<void>;
    private connectInternal;
    createPlayer(options: PlayerOptions): Promise<Player>;
    diagnose(): Promise<DiagnosticReport>;
    handleVoiceUpdate(packet: DiscordVoicePacket): Promise<void>;
    search(query: string, options?: SearchOptions): Promise<SearchResult>;
    searchWithFallback(query: string, options: FallbackSearchOptions): Promise<FallbackSearchResult>;
    resolve(query: string, options?: SearchOptions): Promise<Track>;
    use(plugin: LavalinkPlugin): this;
    report(error: unknown): void;
    destroy(): Promise<void>;
    private destroyInternal;
    toJSON(): {
        state: ClientState;
        nodes: number;
        players: number;
    };
}

declare class FilePlayerStore implements PlayerStore {
    private readonly directory;
    private readonly executor;
    constructor(directory: string);
    private path;
    keys(): Promise<string[]>;
    load(guildId: string): Promise<PlayerSnapshot | undefined>;
    save(snapshot: PlayerSnapshot): Promise<void>;
    delete(guildId: string): Promise<void>;
}

interface GatewayVoicePayload {
    op: 4;
    d: {
        guild_id: string;
        channel_id: string | null;
        self_mute: boolean;
        self_deaf: boolean;
    };
}
declare class DiscordJSAdapter implements VoiceAdapter {
    private readonly send;
    constructor(send: (guildId: string, payload: GatewayVoicePayload) => void | Promise<void>);
    sendVoiceUpdate(update: VoiceUpdate): Promise<void>;
}
declare class ErisAdapter implements VoiceAdapter {
    private readonly sendWS;
    constructor(sendWS: (guildId: string, op: 4, data: GatewayVoicePayload['d']) => void | Promise<void>);
    sendVoiceUpdate(update: VoiceUpdate): Promise<void>;
}

declare function backoff(attempt: number, options: RetryOptions): number;
declare function retryable(error: unknown): boolean;
declare function retry<T>(operation: () => Promise<T>, options?: RetryOptions, signal?: AbortSignal): Promise<T>;

export { AuthenticationError, type ClientEvents, type ClientOptions, type ClientState, type CommandOptions, ConnectionError, type ConnectionState, type DiagnosticReport, DiscordJSAdapter, type DiscordVoicePacket, type EqualizerBand, ErisAdapter, type ErrorContext, EventManager, type FallbackSearchOptions, type FallbackSearchResult, FilePlayerStore, type FilterData, Filters, type GatewayVoicePayload, LavalinkClient, LavalinkError, LavalinkNode, type LavalinkPlugin, type Listener, type LoadResult, type LogLevel, type Logger, type Lyrics, type LyricsLine, Metrics, type MetricsSnapshot, NodeCapabilities, type NodeDiagnostic, NodeError, type NodeInfo, NodeManager, type NodeMessage, type NodeOptions, type NodeState, type NodeStats, type PlayOptions, Player, PlayerError, type PlayerLifecycle, PlayerLyrics, PlayerManager, type PlayerOptions, PlayerPersistence, type PlayerSnapshot, type PlayerState, type PlayerStore, type PlayerUpdate, type PlaylistInfo, LavalinkClient as PowerLavalink, Queue, type QueueOptions, type QueueQuery, RESTClient, RESTError, type RESTOptions, type RESTRequestOptions, type ReconnectOptions, type RemotePlayer, type RepeatMode, type RestoreOptions, type RestoreReport, type RetryOptions, type RoutePlannerStatus, SafeLogger, type SearchAttempt, type SearchOptions, type SearchResult, type SerializedQueue, type ServerPluginEvent, SessionManager, SponsorBlock, type SponsorCategory, type SponsorChapter, type SponsorSegment, TimeoutError, Track, type TrackData, type TrackEndReason, TrackError, type TrackEvent, type TrackException, type TrackInfo, type TransportCallbacks, UnresolvedTrack, type UnresolvedTrackData, type UnresolvedTrackOptions, type UpdateTrack, V4Protocol, type VoiceAdapter, VoiceError, VoiceManager, type VoiceState, type VoiceUpdate, WebSocketError, WebSocketTransport, backoff, deserializeTrack, isServerPluginEvent, normalizeLoadResult, retry, retryable, sponsorCategories, validLyrics, validLyricsLine, validServerPluginEvent, validateFilters, validatePlayerSnapshot };
