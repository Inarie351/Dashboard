import CityTemperature from './weather/CityTemperature';
import CityTemperatureConfig from './weather/CityTemperatureConfig';
import SkyOverview from './weather/SkyOverview';
import SkyOverviewConfig from './weather/SkyOverviewConfig';
import PrecipitationForecast from './weather/PrecipitationForecast';
import PrecipitationForecastConfig from './weather/PrecipitationForecastConfig';
import RecentCommits from './github/RecentCommits';
import RecentCommitsConfig from './github/RecentCommitsConfig';
import SecurityAlerts from './github/SecurityAlerts';
import SecurityAlertsConfig from './github/SecurityAlertsConfig';
import RepoActivity from './github/RepoActivity';
import RepoActivityConfig from './github/RepoActivityConfig';
import UserRepositories from './github/UserRepositories';
import UserRepositoriesConfig from './github/UserRepositoriesConfig';
import RepoIssues from './github/RepoIssues';
import RepoIssuesConfig from './github/RepoIssuesConfig';
import UptimeCheck from './monitoring/UptimeCheck';
import UptimeCheckConfig from './monitoring/UptimeCheckConfig';
import ResponseTime from './monitoring/ResponseTime';
import ResponseTimeConfig from './monitoring/ResponseTimeConfig';
import ErrorRate from './monitoring/ErrorRate';
import ErrorRateConfig from './monitoring/ErrorRateConfig';
import LatencyTracker from './monitoring/LatencyTracker';
import LatencyTrackerConfig from './monitoring/LatencyTrackerConfig';
import LatestItems from './rss/LatestItems';
import LatestItemsConfig from './rss/LatestItemsConfig';
import KeywordFilter from './rss/KeywordFilter';
import KeywordFilterConfig from './rss/KeywordFilterConfig';
import FeedDigest from './rss/FeedDigest';
import FeedDigestConfig from './rss/FeedDigestConfig';
import Directions from './maps/Directions';
import DirectionsConfig from './maps/DirectionsConfig';
import CyclingRoute from './maps/CyclingRoute';
import CyclingRouteConfig from './maps/CyclingRouteConfig';
import PlaceLookup from './maps/PlaceLookup';
import PlaceLookupConfig from './maps/PlaceLookupConfig';
import ChannelStats from './youtube/ChannelStats';
import ChannelStatsConfig from './youtube/ChannelStatsConfig';
import LatestVideos from './youtube/LatestVideos';
import LatestVideosConfig from './youtube/LatestVideosConfig';
import YoutubeTopContent from './youtube/TopContent';
import YoutubeTopContentConfig from './youtube/TopContentConfig';
import WatchLater from './youtube/WatchLater';
import WatchLaterConfig from './youtube/WatchLaterConfig';
import SpotifyAccountStats from './spotify/AccountStats';
import SpotifyAccountStatsConfig from './spotify/AccountStatsConfig';
import SpotifyLatestReleases from './spotify/LatestReleases';
import SpotifyLatestReleasesConfig from './spotify/LatestReleasesConfig';
import SpotifyTopContent from './spotify/TopContent';
import SpotifyTopContentConfig from './spotify/TopContentConfig';
import NowPlaying from './spotify/NowPlaying';
import NowPlayingConfig from './spotify/NowPlayingConfig';
import SavedPins from './pinterest/SavedPins';
import SavedPinsConfig from './pinterest/SavedPinsConfig';
import BoardStats from './pinterest/BoardStats';
import BoardStatsConfig from './pinterest/BoardStatsConfig';
import SearchPins from './pinterest/SearchPins';
import SearchPinsConfig from './pinterest/SearchPinsConfig';
import StickyNote from './notes/StickyNote';
import StickyNoteConfig from './notes/StickyNoteConfig';
import Checklist from './notes/Checklist';
import ChecklistConfig from './notes/ChecklistConfig';
import MonthView from './calendar/MonthView';
import MonthViewConfig from './calendar/MonthViewConfig';
import Countdown from './calendar/Countdown';
import CountdownConfig from './calendar/CountdownConfig';
import DaysSince from './calendar/DaysSince';
import DaysSinceConfig from './calendar/DaysSinceConfig';
import DigitalClock from './clock/DigitalClock';
import DigitalClockConfig from './clock/DigitalClockConfig';
import AnalogClock from './clock/AnalogClock';
import AnalogClockConfig from './clock/AnalogClockConfig';
import SiteOverview from './website/SiteOverview';
import SiteOverviewConfig from './website/SiteOverviewConfig';
import KnowledgePanel from './website/KnowledgePanel';
import KnowledgePanelConfig from './website/KnowledgePanelConfig';
import DomainInfo from './website/DomainInfo';
import DomainInfoConfig from './website/DomainInfoConfig';
import Timer from './clock/Timer';
import TimerConfig from './clock/TimerConfig';

// Looked up by the dashboard as `${serviceName}:${widgetName}` (matching what the backend
// registers in GET /about.json) to render whichever widget a WidgetInstance points to.
const registry = {
  'weather:city_temperature': { Display: CityTemperature, Config: CityTemperatureConfig },
  'weather:sky_overview': { Display: SkyOverview, Config: SkyOverviewConfig },
  'weather:precipitation_forecast': {
    Display: PrecipitationForecast,
    Config: PrecipitationForecastConfig,
  },
  'github:recent_commits': { Display: RecentCommits, Config: RecentCommitsConfig },
  'github:security_alerts': { Display: SecurityAlerts, Config: SecurityAlertsConfig },
  'github:repo_activity': { Display: RepoActivity, Config: RepoActivityConfig },
  'github:user_repositories': { Display: UserRepositories, Config: UserRepositoriesConfig },
  'github:repo_issues': { Display: RepoIssues, Config: RepoIssuesConfig },
  'monitoring:uptime_check': { Display: UptimeCheck, Config: UptimeCheckConfig },
  'monitoring:response_time': { Display: ResponseTime, Config: ResponseTimeConfig },
  'monitoring:error_rate': { Display: ErrorRate, Config: ErrorRateConfig },
  'monitoring:latency_tracker': { Display: LatencyTracker, Config: LatencyTrackerConfig },
  'rss:article_list': { Display: LatestItems, Config: LatestItemsConfig },
  'rss:keyword_filter': { Display: KeywordFilter, Config: KeywordFilterConfig },
  'rss:feed_digest': { Display: FeedDigest, Config: FeedDigestConfig },
  'maps:directions': { Display: Directions, Config: DirectionsConfig },
  'maps:cycling_route': { Display: CyclingRoute, Config: CyclingRouteConfig },
  'maps:place_lookup': { Display: PlaceLookup, Config: PlaceLookupConfig },
  'youtube:channel_stats': { Display: ChannelStats, Config: ChannelStatsConfig },
  'youtube:latest_videos': { Display: LatestVideos, Config: LatestVideosConfig },
  'youtube:top_content': { Display: YoutubeTopContent, Config: YoutubeTopContentConfig },
  'youtube:watch_later': { Display: WatchLater, Config: WatchLaterConfig },
  'spotify:account_stats': { Display: SpotifyAccountStats, Config: SpotifyAccountStatsConfig },
  'spotify:latest_releases': {
    Display: SpotifyLatestReleases,
    Config: SpotifyLatestReleasesConfig,
  },
  'spotify:top_content': { Display: SpotifyTopContent, Config: SpotifyTopContentConfig },
  'spotify:now_playing': { Display: NowPlaying, Config: NowPlayingConfig },
  'pinterest:saved_pins': { Display: SavedPins, Config: SavedPinsConfig },
  'pinterest:board_stats': { Display: BoardStats, Config: BoardStatsConfig },
  'pinterest:search_pins': { Display: SearchPins, Config: SearchPinsConfig },
  'notes:sticky_note': { Display: StickyNote, Config: StickyNoteConfig },
  'notes:checklist': { Display: Checklist, Config: ChecklistConfig },
  'calendar:month_view': { Display: MonthView, Config: MonthViewConfig },
  'calendar:countdown': { Display: Countdown, Config: CountdownConfig },
  'calendar:days_since': { Display: DaysSince, Config: DaysSinceConfig },
  'clock:digital_clock': { Display: DigitalClock, Config: DigitalClockConfig },
  'clock:analog_clock': { Display: AnalogClock, Config: AnalogClockConfig },
  'website:site_overview': { Display: SiteOverview, Config: SiteOverviewConfig },
  'website:knowledge_panel': { Display: KnowledgePanel, Config: KnowledgePanelConfig },
  'website:domain_info': { Display: DomainInfo, Config: DomainInfoConfig },
  'clock:timer': { Display: Timer, Config: TimerConfig },
};

export function getWidgetComponents(serviceName, widgetName) {
  return registry[`${serviceName}:${widgetName}`];
}
