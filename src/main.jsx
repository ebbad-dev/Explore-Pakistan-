// Explore Pakistan — Travel Guide & Trip Planner
// Core Imports & App Constants
import {
  Children, cloneElement, Component, createContext, Fragment, useCallback,
  useContext, useEffect, useId, useMemo, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams,
} from 'react-router-dom';
import {
  AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform,
} from 'framer-motion';
import {
  AlertCircle, ArrowDown, ArrowRight, ArrowUp, Backpack, BadgeCheck, Bed, BookOpen, Bookmark,
  BookmarkCheck, Calendar, Camera, Car, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Coins, Compass, Copy, Crown, ExternalLink, Eye, EyeOff, Footprints, Gem, Heart, HelpCircle,
  Info, Landmark, LayoutGrid, Leaf, List, Lock, LogOut, Mail, Map as MapIcon, MapPin, MapPinned,
  Menu, Mountain, Navigation, Pause, Pencil, Play, Plus, Printer, Receipt, RotateCcw,
  Route as RouteIcon, Scale, Search, Send, Share2, Shield, SlidersHorizontal, Snowflake,
  Square, Sun, Ticket, Trash2, Trees, User, Users, Utensils, Volume2, VolumeX, Wallet, Waves, X,
} from 'lucide-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
// Reviewed, locally bundled destination photography.
import MEDIA from './data/destination-media.json';

// Snapshot check date
const PRICE_SNAPSHOT_DATE = '2026-10-27';
// Google Maps key
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
// Contact email
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'ebbadurehman538@gmail.com';
// WhatsApp contact number
const CONTACT_WHATSAPP_NUMBER = '923137813498';
const CONTACT_WHATSAPP_DISPLAY = '0313 7813498';
// localStorage namespace
const STORAGE_PREFIX = 'explorePakistan:v1:';


const REGIONS = [
  { id: 'gilgit-baltistan', name: 'Gilgit-Baltistan', short: 'GB' },
  { id: 'khyber-pakhtunkhwa', name: 'Khyber Pakhtunkhwa', short: 'KP' },
  { id: 'punjab', name: 'Punjab', short: 'PB' },
  { id: 'sindh', name: 'Sindh', short: 'SD' },
  { id: 'balochistan', name: 'Balochistan', short: 'BL' },
  { id: 'ajk', name: 'Azad Jammu & Kashmir', short: 'AJK' },
  { id: 'islamabad', name: 'Islamabad Capital Territory', short: 'ICT' },
];

const CATEGORIES = [
  { id: 'mountains', label: 'Mountains', icon: Mountain },
  { id: 'lakes', label: 'Lakes', icon: Waves },
  { id: 'valleys', label: 'Valleys', icon: Trees },
  { id: 'heritage', label: 'Heritage', icon: Landmark },
  { id: 'culture', label: 'Culture', icon: Users },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'city', label: 'City breaks', icon: MapPin },
  { id: 'trekking', label: 'Trekking', icon: Footprints },
  { id: 'desert', label: 'Desert', icon: Sun },
  { id: 'coast', label: 'Coast', icon: Waves },
  { id: 'wildlife', label: 'Wildlife', icon: Leaf },
  { id: 'road-trip', label: 'Road trips', icon: Car },
  { id: 'day-trip', label: 'Day trips', icon: Clock },
];

const SEASONS = [
  { id: 'spring', label: 'Spring', months: 'Mar–May', icon: Leaf },
  { id: 'summer', label: 'Summer', months: 'Jun–Aug', icon: Sun },
  { id: 'autumn', label: 'Autumn', months: 'Sep–Nov', icon: Trees },
  { id: 'winter', label: 'Winter', months: 'Dec–Feb', icon: Snowflake },
];

const BUDGETS = [
  { id: 'budget', label: 'Budget-friendly' },
  { id: 'mid', label: 'Mid-range' },
  { id: 'premium', label: 'Splurge-worthy' },
];
const STYLES = [
  { id: 'adventure', label: 'Adventure' },
  { id: 'relaxed', label: 'Slow & relaxed' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'scenic', label: 'Scenic' },
  { id: 'road-trip', label: 'Road trip' },
];
const COMPANIONS = [
  { id: 'solo', label: 'Solo' },
  { id: 'couple', label: 'Couple' },
  { id: 'family', label: 'Family' },
  { id: 'friends', label: 'Friends' },
];
const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'challenging', label: 'Challenging' },
];
const DURATIONS = [
  { id: 'short', label: '1–2 days', min: 1, max: 2 },
  { id: 'medium', label: '3–5 days', min: 3, max: 5 },
  { id: 'long', label: '6+ days', min: 6, max: 30 },
];

// Departure cities
const CITIES = [
  { id: 'islamabad', name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { id: 'lahore', name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { id: 'karachi', name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { id: 'peshawar', name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
  { id: 'multan', name: 'Multan', lat: 30.1575, lng: 71.5249 },
];

// Destination & Tour Data

const DESTINATIONS = [
  {
    id: 'hunza',
    name: 'Hunza Valley',
    region: 'gilgit-baltistan',
    area: 'Karimabad, Gojal & the Karakoram Highway',
    coords: { lat: 36.3236, lng: 74.6633 },
    categories: ['mountains', 'valleys', 'lakes', 'heritage', 'culture', 'road-trip'],
    seasons: ['spring', 'summer', 'autumn'],
    bestMonths: 'April to October; blossom in early spring, gold poplars in late autumn',
    durationDays: [5, 7],
    budget: 'mid',
    styles: ['scenic', 'cultural', 'road-trip'],
    companions: ['solo', 'couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'Forts, orchards and a turquoise lake under seven-thousand-metre peaks.',
    overview: [
      'Hunza sits along the Karakoram Highway, the old Silk Road corridor to China. Terraced orchards climb from the river to Baltit and Altit forts, and Rakaposhi and Ultar Sar fill the skyline above Karimabad.',
      'Upper Hunza, known locally as Gojal, changes tone: Attabad Lake, formed by a landslide in 2010, the serrated Passu Cones, and Wakhi villages on the road towards the Khunjerab Pass.',
    ],
    highlights: ['Baltit and Altit forts', 'Attabad Lake by boat', 'Passu Cones and Hussaini bridge', 'Eagle’s Nest at sunset', 'Khunjerab Pass on the China border'],
    culture: 'Burushaski and Wakhi are spoken here, and the valley has a strong tradition of community-run schools and heritage restoration.',
    food: 'Try chapshuro (meat-filled flatbread), apricot and walnut dishes, and herbal teas from family-run cafés.',
    prep: ['Carry your CNIC or passport — there are checkposts on the Karakoram Highway.', 'Altitude rises quickly above Passu; drink water and take the climb gently.', 'Card payments and ATMs are limited outside Aliabad and Karimabad.'],
    relatedIds: ['skardu', 'fairy-meadows', 'deosai'],
  },
  {
    id: 'skardu',
    name: 'Skardu & Shigar',
    region: 'gilgit-baltistan',
    area: 'Baltistan, on the upper Indus',
    coords: { lat: 35.2971, lng: 75.6337 },
    categories: ['mountains', 'lakes', 'heritage', 'desert', 'culture'],
    seasons: ['spring', 'summer', 'autumn'],
    bestMonths: 'April to October',
    durationDays: [5, 8],
    budget: 'mid',
    styles: ['scenic', 'cultural', 'adventure'],
    companions: ['solo', 'couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'A high-altitude basin of sand dunes, glacial lakes and restored Balti forts.',
    overview: [
      'Skardu is the gateway to Baltistan and the Karakoram’s great peaks. Around the town you will find the Katpana cold desert, the Kachura lakes, and the Indus braiding through a wide valley floor.',
      'An hour away, Shigar Fort has been carefully restored and now hosts guests, while Khaplu Palace shows the same Balti craftsmanship further east.',
    ],
    highlights: ['Katpana cold desert at dusk', 'Upper and Lower Kachura lakes', 'Shigar Fort', 'Khaplu Palace and Chaqchan Mosque', 'Manthal Buddha Rock'],
    culture: 'Balti culture shares roots with Ladakh and Tibet — look for carved wooden mosques, polo grounds and stone-built villages.',
    food: 'Butter tea, kisir (buckwheat pancakes) and fresh apricots in season.',
    prep: ['Flights from Islamabad are weather-dependent; keep a buffer day.', 'The road via Gilgit is long — break the journey rather than driving through.', 'Evenings are cold even in summer; bring a warm layer.'],
    relatedIds: ['deosai', 'hunza', 'fairy-meadows'],
  },
  {
    id: 'deosai',
    name: 'Deosai Plains',
    region: 'gilgit-baltistan',
    area: 'Deosai National Park, south of Skardu',
    coords: { lat: 34.9783, lng: 75.4119 },
    categories: ['wildlife', 'mountains', 'lakes', 'trekking', 'day-trip'],
    seasons: ['summer'],
    bestMonths: 'Roughly July to September, when the road is open and wildflowers bloom',
    durationDays: [1, 2],
    budget: 'mid',
    styles: ['adventure', 'scenic'],
    companions: ['solo', 'couple', 'friends'],
    difficulty: 'moderate',
    hiddenGem: true,
    tagline: 'One of the highest plateaus on earth, home to the Himalayan brown bear.',
    overview: [
      'Deosai is a vast rolling plateau above 4,000 metres, protected as a national park largely for the Himalayan brown bear. In high summer it turns green and is scattered with wildflowers.',
      'Most visitors cross by jeep from Skardu, stopping at Sheosar Lake and the clear streams that braid across the plains.',
    ],
    highlights: ['Sheosar Lake', 'Bara Pani stream crossing', 'Wildflower meadows in July', 'Wildlife watching at a respectful distance'],
    culture: 'There are no permanent villages on the plateau; seasonal herders pass through. Treat it as wilderness.',
    food: 'Facilities are minimal — pack food and water from Skardu.',
    prep: ['The plateau is only accessible in the summer months; confirm the road locally.', 'Weather changes fast at this altitude — carry rain and warm layers.', 'Keep well away from bears and never leave food out.'],
    relatedIds: ['skardu', 'hunza'],
  },
  {
    id: 'fairy-meadows',
    name: 'Fairy Meadows',
    region: 'gilgit-baltistan',
    area: 'Below Nanga Parbat, off the Karakoram Highway',
    coords: { lat: 35.385, lng: 74.5786 },
    categories: ['mountains', 'trekking', 'valleys'],
    seasons: ['summer', 'spring', 'autumn'],
    bestMonths: 'Late April to September',
    durationDays: [3, 4],
    budget: 'mid',
    styles: ['adventure', 'scenic'],
    companions: ['solo', 'couple', 'friends'],
    difficulty: 'moderate',
    hiddenGem: false,
    tagline: 'A forest meadow facing the north face of Nanga Parbat.',
    overview: [
      'Fairy Meadows is reached by a jeep track from Raikot Bridge on the Karakoram Highway, followed by a hike up through pine forest. The reward is an open meadow with an unbroken view of Nanga Parbat’s Raikot face.',
      'From the meadow, fit walkers continue to Beyal Camp and the Nanga Parbat base camp viewpoint as a full-day return trek.',
    ],
    highlights: ['Sunrise on Nanga Parbat', 'Hike to Beyal Camp', 'Base camp viewpoint day trek', 'Night sky away from city light'],
    culture: 'Local families from Tato village run the jeeps and many of the camps; booking locally keeps income in the valley.',
    food: 'Simple camp meals — daal, rice, parathas and plenty of tea.',
    prep: ['The jeep track is narrow and exposed; travel with local drivers.', 'The final approach is on foot — pack light or hire a porter.', 'Accommodation is basic wooden cabins or tents.'],
    relatedIds: ['hunza', 'naran-kaghan', 'skardu'],
  },
  {
    id: 'naran-kaghan',
    name: 'Naran & Kaghan',
    region: 'khyber-pakhtunkhwa',
    area: 'Kaghan Valley, Mansehra',
    coords: { lat: 34.9089, lng: 73.6508 },
    categories: ['valleys', 'lakes', 'mountains', 'road-trip'],
    seasons: ['summer'],
    bestMonths: 'Mid-May to September; upper roads close with snow',
    durationDays: [3, 5],
    budget: 'budget',
    styles: ['scenic', 'road-trip', 'relaxed'],
    companions: ['couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'Glacial lakes and a summer road over the Babusar Pass.',
    overview: [
      'The Kaghan Valley follows the Kunhar River north from Balakot to Naran, the main base for summer travellers. From Naran a jeep road climbs to Lake Saiful Muluk, set beneath Malika Parbat.',
      'Further up, Lulusar Lake and the Babusar Pass make a dramatic road trip and a summer link towards Chilas and the Karakoram Highway.',
    ],
    highlights: ['Lake Saiful Muluk', 'Lulusar Lake', 'Babusar Pass', 'Kunhar River trout'],
    culture: 'The lake is tied to the folk romance of Prince Saiful Muluk, retold in Mian Muhammad Bakhsh’s Punjabi verse.',
    food: 'River trout, chapli kebab and roadside pakoras on cool evenings.',
    prep: ['Weekends and Eid holidays are very crowded — travel midweek if you can.', 'The Babusar road is seasonal; confirm it is open before planning a crossing.', 'Help keep the lakes clean — carry your rubbish back to town.'],
    relatedIds: ['swat-kalam', 'fairy-meadows', 'murree-galiyat'],
  },
  {
    id: 'swat-kalam',
    name: 'Swat & Kalam',
    region: 'khyber-pakhtunkhwa',
    area: 'Upper Swat Valley',
    coords: { lat: 35.4892, lng: 72.5794 },
    categories: ['valleys', 'heritage', 'lakes', 'road-trip'],
    seasons: ['spring', 'summer', 'winter'],
    bestMonths: 'May to September for Kalam; winter for snow at Malam Jabba',
    durationDays: [3, 5],
    budget: 'budget',
    styles: ['scenic', 'relaxed', 'cultural'],
    companions: ['couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'River valleys, deodar forests and the traces of Gandhara.',
    overview: [
      'Lower Swat holds some of the richest Buddhist heritage of ancient Gandhara, with stupas, monasteries and rock carvings, and an excellent museum at Saidu Sharif.',
      'Upper Swat climbs to Kalam, where the Ushu forest and the lakes of Mahodand and Kundol draw summer visitors, while Malam Jabba becomes a ski slope in winter.',
    ],
    highlights: ['Swat Museum, Saidu Sharif', 'Jahanabad rock-carved Buddha', 'Ushu forest', 'Mahodand Lake', 'Malam Jabba in snow'],
    culture: 'Pashtun hospitality runs deep here; dress modestly and ask before photographing people.',
    food: 'Swati fish from the river, chapli kebab and namkeen gosht.',
    prep: ['The road above Bahrain can be slow; allow plenty of time.', 'Lakes beyond Kalam need a jeep.', 'Heavy rain can damage roads in monsoon; check conditions locally.'],
    relatedIds: ['kumrat', 'naran-kaghan', 'kalash'],
  },
  {
    id: 'kumrat',
    name: 'Kumrat Valley',
    region: 'khyber-pakhtunkhwa',
    area: 'Upper Dir, along the Panjkora River',
    coords: { lat: 35.53, lng: 72.22 },
    categories: ['valleys', 'trekking', 'lakes'],
    seasons: ['summer'],
    bestMonths: 'June to September',
    durationDays: [3, 5],
    budget: 'budget',
    styles: ['adventure', 'relaxed'],
    companions: ['solo', 'friends', 'couple'],
    difficulty: 'moderate',
    hiddenGem: true,
    tagline: 'Deodar forest, riverside camps and the meadow of Jahaz Banda.',
    overview: [
      'Kumrat is a forested valley on the upper Panjkora River, reached by jeep beyond the village of Thal. Tall deodar cedars line the river, and most visitors stay in simple riverside camps.',
      'Fit walkers continue to the high meadow of Jahaz Banda and on to Katora Lake, a glacial bowl at around 3,500 metres.',
    ],
    highlights: ['Riverside camping under deodars', 'Kala Chashma springs', 'Jahaz Banda meadow', 'Katora Lake trek'],
    culture: 'The upper Dir valleys are home to Kohistani-speaking communities; be respectful of village privacy.',
    food: 'Camp food and river trout; bring snacks for treks.',
    prep: ['Mobile signal is patchy or absent.', 'Jeeps are needed beyond Thal.', 'Camps are basic — bring a warm sleeping layer.'],
    relatedIds: ['swat-kalam', 'kalash'],
  },
  {
    id: 'kalash',
    name: 'Kalash Valleys',
    region: 'khyber-pakhtunkhwa',
    area: 'Bumburet, Rumbur & Birir, Chitral',
    coords: { lat: 35.733, lng: 71.722 },
    categories: ['culture', 'valleys', 'heritage'],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    bestMonths: 'May for the spring festival; summer and autumn for walking',
    durationDays: [3, 5],
    budget: 'mid',
    styles: ['cultural', 'scenic'],
    companions: ['solo', 'couple', 'friends'],
    difficulty: 'moderate',
    hiddenGem: true,
    tagline: 'Three small valleys with a living culture and seasonal festivals.',
    overview: [
      'The Kalasha people live in three valleys near Chitral, with their own language, religious practice and colourful festivals that mark the turning year.',
      'Bumburet is the largest valley and has the Kalasha Dur museum and cultural centre; Rumbur and Birir are smaller and quieter.',
    ],
    highlights: ['Kalasha Dur museum, Bumburet', 'Chilam Joshi spring festival in May', 'Walnut and mulberry orchards', 'Chitral Fort and Shahi Mosque on the way'],
    culture: 'You are a guest in a living community, not at an exhibit. Ask before photographing anyone, especially women, and follow local guidance at festivals.',
    food: 'Walnut bread, local cheese and seasonal fruit; Chitral town has more choice.',
    prep: ['Access is via Chitral and the Lowari Tunnel.', 'Check current visitor registration requirements before travelling.', 'Festivals are religious events — dates shift, so confirm locally.'],
    relatedIds: ['swat-kalam', 'kumrat'],
  },
  {
    id: 'neelum',
    name: 'Neelum Valley',
    region: 'ajk',
    area: 'Keran, Sharda & Kel',
    coords: { lat: 34.7936, lng: 74.1883 },
    categories: ['valleys', 'lakes', 'heritage', 'road-trip'],
    seasons: ['spring', 'summer', 'autumn'],
    bestMonths: 'April to October',
    durationDays: [3, 5],
    budget: 'budget',
    styles: ['scenic', 'relaxed', 'road-trip'],
    companions: ['couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'A long, green river valley ending in the meadows of Arang Kel.',
    overview: [
      'The Neelum River runs north-east from Muzaffarabad through a narrow, forested valley. Villages such as Keran and Sharda sit on its banks, with the ruins of the ancient Sharda Peeth learning centre above the river.',
      'At Kel, a cable car and a steep walk lead to Arang Kel, a hilltop village of wooden houses and wide meadows.',
    ],
    highlights: ['Keran riverside', 'Sharda Peeth ruins', 'Arang Kel meadows', 'Ratti Gali Lake (summer jeep trip)'],
    culture: 'Sharda Peeth was once a major centre of learning; treat the site with respect.',
    food: 'Trout, rajma and rice, and Kashmiri noon chai.',
    prep: ['The valley runs close to the Line of Control — check current advisories before you go.', 'Some upper areas need a jeep.', 'Carry cash; banking is limited beyond Athmuqam.'],
    relatedIds: ['murree-galiyat', 'naran-kaghan'],
  },
  {
    id: 'lahore',
    name: 'Lahore',
    region: 'punjab',
    area: 'Walled City, Fort Road & Gulberg',
    coords: { lat: 31.5881, lng: 74.3099 },
    categories: ['city', 'heritage', 'food', 'culture'],
    seasons: ['autumn', 'winter', 'spring'],
    bestMonths: 'October to March',
    durationDays: [2, 3],
    budget: 'mid',
    styles: ['cultural', 'relaxed'],
    companions: ['solo', 'couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'Mughal monuments by day, the city’s great food streets by night.',
    overview: [
      'Lahore was a Mughal capital, and it shows: the Lahore Fort and Shalimar Gardens are a UNESCO World Heritage Site, and the Badshahi Mosque remains one of the largest mosques in South Asia.',
      'Inside the Walled City, the tile-covered Wazir Khan Mosque and the restored Shahi Hammam reward slow walking — before dinner on Fort Road with the mosque lit up above you.',
    ],
    highlights: ['Badshahi Mosque', 'Lahore Fort and Sheesh Mahal', 'Wazir Khan Mosque', 'Walled City heritage walk from Delhi Gate', 'Shalimar Gardens'],
    culture: 'Lahore is the heart of Punjabi music, poetry and cinema; look for qawwali at Data Darbar on Thursday nights.',
    food: 'Nihari and paye for breakfast, halwa puri on weekends, and karahi, tikka and lassi on Fort Road.',
    prep: ['Summer is very hot; plan sightseeing early and late.', 'Dress modestly for mosques; women should carry a scarf.', 'Smog can be heavy from November; check air quality.'],
    relatedIds: ['derawar-cholistan', 'islamabad'],
  },
  {
    id: 'murree-galiyat',
    name: 'Murree & Galiyat',
    region: 'punjab',
    area: 'Murree (Punjab) and Nathia Gali (KP)',
    coords: { lat: 33.907, lng: 73.3943 },
    categories: ['mountains', 'trekking', 'day-trip'],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    bestMonths: 'All year; summer for walking, winter for snow',
    durationDays: [1, 3],
    budget: 'budget',
    styles: ['relaxed', 'scenic'],
    companions: ['couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'Pine-forest hill stations within easy reach of Islamabad.',
    overview: [
      'Murree has been a hill station since colonial times, with its busy Mall Road and pine ridges. A short drive on, the quieter Galiyat villages — Nathia Gali, Dunga Gali, Ayubia — have better walking.',
      'The pipeline track between Dunga Gali and Ayubia is an easy forest walk, and Mushkpuri offers a steeper climb with wide views.',
    ],
    highlights: ['Pipeline track, Dunga Gali to Ayubia', 'Mushkpuri summit hike', 'Nathia Gali forest', 'Patriata chairlift'],
    culture: 'Mall Road is the classic promenade; the Galiyat are slower and better for families who want to walk.',
    food: 'Corn on the cob, chai and pakoras along Mall Road.',
    prep: ['Heavy snowfall causes serious traffic jams — follow official advisories in winter.', 'Weekends and public holidays are very crowded.', 'Leopards live in these forests; stay on trails at dusk.'],
    relatedIds: ['islamabad', 'neelum'],
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    region: 'islamabad',
    area: 'Margalla Hills & the capital',
    coords: { lat: 33.7295, lng: 73.0372 },
    categories: ['city', 'trekking', 'culture', 'day-trip'],
    seasons: ['spring', 'autumn', 'winter'],
    bestMonths: 'October to April',
    durationDays: [1, 2],
    budget: 'mid',
    styles: ['relaxed', 'cultural'],
    companions: ['solo', 'couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'A green capital where forest trails start at the city’s edge.',
    overview: [
      'Islamabad sits against the Margalla Hills, and numbered trails lead from city sectors straight into forest. The Faisal Mosque, with its tent-like roof and four minarets, anchors the skyline.',
      'Lok Virsa’s heritage museum, the Pakistan Monument and the old village of Saidpur make an easy cultural day; Taxila’s Gandhara sites are within reach as a day trip.',
    ],
    highlights: ['Faisal Mosque', 'Margalla Trail 3 or Trail 5', 'Lok Virsa Heritage Museum', 'Pakistan Monument at dusk', 'Day trip to Taxila'],
    culture: 'As the capital, Islamabad draws people from every province — its museums are a good primer before heading north.',
    food: 'Saidpur village restaurants, Melody food street and Peshawari karahi.',
    prep: ['Trails can be hot by mid-morning in summer; start early.', 'Carry water on Margalla trails.', 'It is the usual base for flights to Gilgit and Skardu.'],
    relatedIds: ['murree-galiyat', 'lahore'],
  },
  {
    id: 'mohenjo-daro',
    name: 'Mohenjo-daro',
    region: 'sindh',
    area: 'Near Larkana, on the Indus plain',
    coords: { lat: 27.3292, lng: 68.1389 },
    categories: ['heritage', 'day-trip'],
    seasons: ['winter', 'autumn'],
    bestMonths: 'November to February',
    durationDays: [1, 2],
    budget: 'budget',
    styles: ['cultural'],
    companions: ['solo', 'couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: false,
    tagline: 'A planned city of the Indus civilisation, some 4,500 years old.',
    overview: [
      'Mohenjo-daro was one of the largest cities of the Indus Valley Civilisation. Its grid of streets, drains and brick houses — and the famous Great Bath — are a UNESCO World Heritage Site.',
      'The on-site museum gives context, and the stupa mound offers the best overview of the excavated city.',
    ],
    highlights: ['The Great Bath', 'Stupa mound viewpoint', 'Grid streets and drainage', 'Site museum'],
    culture: 'The site is fragile — stay on paths and do not climb walls.',
    food: 'Larkana and Sukkur have Sindhi biryani and sai bhaji.',
    prep: ['Summer temperatures are extreme; visit in winter.', 'Most visitors base themselves in Larkana or Sukkur.', 'Bring sun protection — there is little shade.'],
    relatedIds: ['makli-thatta', 'hingol'],
  },
  {
    id: 'makli-thatta',
    name: 'Makli & Thatta',
    region: 'sindh',
    area: 'About 100 km east of Karachi',
    coords: { lat: 24.75, lng: 67.9 },
    categories: ['heritage', 'day-trip'],
    seasons: ['winter', 'autumn', 'spring'],
    bestMonths: 'November to March',
    durationDays: [1, 1],
    budget: 'budget',
    styles: ['cultural'],
    companions: ['solo', 'couple', 'family', 'friends'],
    difficulty: 'easy',
    hiddenGem: true,
    tagline: 'A hillside necropolis of carved stone tombs spanning four centuries.',
    overview: [
      'Makli is one of the largest funerary sites in the world and a UNESCO World Heritage Site. Tombs from the 14th to 18th centuries show Sindhi, Persian and Mughal styles side by side, many with extraordinary stone carving.',
      'In nearby Thatta, the Shah Jahan Mosque is known for its glazed blue tilework and remarkable acoustics.',
    ],
    highlights: ['Tomb of Jam Nizamuddin II', 'Tomb of Isa Khan Tarkhan II', 'Shah Jahan Mosque, Thatta', 'Late-afternoon light on carved stone'],
    culture: 'This is still an active burial ground and place of reverence; visit quietly.',
    food: 'Pack snacks; Karachi has far more choice on return.',
    prep: ['Go early or late — midday sun on the hill is intense.', 'A local guide helps identify the most important tombs.', 'Wear sturdy shoes for uneven ground.'],
    relatedIds: ['mohenjo-daro', 'hingol'],
  },
  {
    id: 'hingol',
    name: 'Hingol & Kund Malir',
    region: 'balochistan',
    area: 'Makran Coastal Highway',
    coords: { lat: 25.395, lng: 65.476 },
    categories: ['coast', 'desert', 'road-trip', 'wildlife'],
    seasons: ['winter', 'autumn', 'spring'],
    bestMonths: 'October to March',
    durationDays: [1, 2],
    budget: 'budget',
    styles: ['adventure', 'road-trip', 'scenic'],
    companions: ['solo', 'couple', 'friends'],
    difficulty: 'moderate',
    hiddenGem: true,
    tagline: 'Wind-carved rock, mud volcanoes and an empty Arabian Sea beach.',
    overview: [
      'The Makran Coastal Highway runs west from Karachi through Hingol National Park, past eroded cliffs that locals call the Sphinx and the Princess of Hope.',
      'Kund Malir is a long, quiet beach where the desert meets the sea; the Chandragup mud volcanoes and the Hinglaj pilgrimage site are nearby.',
    ],
    highlights: ['Kund Malir beach', 'Princess of Hope rock formation', 'Balochistan Sphinx', 'Chandragup mud volcano'],
    culture: 'Hinglaj Mata is an important Hindu pilgrimage site; respect the shrine and its visitors.',
    food: 'Very limited — carry food and plenty of water.',
    prep: ['Fuel and water are scarce; fill up before leaving Karachi.', 'Swimming can be dangerous — currents are strong and there are no lifeguards.', 'Check current travel advisories for the coastal highway.'],
    relatedIds: ['makli-thatta', 'mohenjo-daro'],
  },
  {
    id: 'derawar-cholistan',
    name: 'Derawar Fort & Cholistan',
    region: 'punjab',
    area: 'Cholistan Desert, near Bahawalpur',
    coords: { lat: 28.7678, lng: 71.3339 },
    categories: ['desert', 'heritage', 'road-trip'],
    seasons: ['winter'],
    bestMonths: 'November to February; the desert jeep rally is usually in February',
    durationDays: [1, 2],
    budget: 'budget',
    styles: ['adventure', 'cultural', 'road-trip'],
    companions: ['solo', 'couple', 'friends', 'family'],
    difficulty: 'moderate',
    hiddenGem: true,
    tagline: 'Forty bastions rising out of the Cholistan sand.',
    overview: [
      'Derawar Fort’s walls and bastions can be seen for miles across the Cholistan Desert. The fort was rebuilt by the Abbasi nawabs of Bahawalpur in the 18th century.',
      'Bahawalpur itself has the Noor Mahal palace and the Central Library, and makes the natural base for a desert trip.',
    ],
    highlights: ['Derawar Fort walls at sunset', 'Abbasi Mosque beside the fort', 'Noor Mahal, Bahawalpur', 'Cholistan Desert Jeep Rally (seasonal)'],
    culture: 'Cholistani herding communities live around seasonal water tanks called tobas; ask before visiting settlements.',
    food: 'Sohan halwa from Multan on the way, and Bahawalpur’s local sweets.',
    prep: ['Access to the fort interior varies — check locally.', 'Desert tracks need a 4×4 and an experienced driver.', 'Daytime sun is strong even in winter; nights are cold.'],
    relatedIds: ['lahore', 'mohenjo-daro'],
  },
];

// Tour package snapshot
const TT_SOURCE = 'https://travelontoday.com/';
const TT_INCLUSIONS = [
  'AC bus transport from Lahore or Islamabad on a group departure',
  'Hotel accommodation',
  'Daily breakfast',
  'Local guide and the listed sightseeing itinerary',
];
const TT_EXCLUSIONS = [
  'Lunch, dinner and personal expenses unless the selected itinerary says otherwise',
  'Entry tickets, permits and optional activities unless explicitly listed as included',
];
const TT_CAVEATS = [
  'Advertised starting price per person on a group departure; the exact itinerary, hotel category, group size and departure date affect the final quote.',
  'Travelon Today says rates may change with fuel costs. Confirm the final price, itinerary, inclusions and availability with the operator before paying.',
];
const ttPackage = (id, title, destinationIds, pricePkr, durationLabel, durationDays, membershipEligibility = [], sourcePath) => ({
  id,
  title,
  destinationIds,
  operatorName: 'Travelon Today',
  sourceUrl: sourcePath ? `${TT_SOURCE}${sourcePath}` : TT_SOURCE,
  sourceCheckedAt: PRICE_SNAPSHOT_DATE,
  pricePkr,
  priceBasis: 'per-person',
  priceQualifier: 'starting-from',
  durationLabel,
  durationDays,
  departureContext: 'Lahore or Islamabad; advertised group departure by road',
  inclusions: TT_INCLUSIONS,
  exclusions: TT_EXCLUSIONS,
  caveats: TT_CAVEATS,
  membershipEligibility,
  availabilityStatus: 'not-verified',
});

const TOUR_PACKAGES = [
  ttPackage('tt-hunza', 'Hunza Valley tour', ['hunza'], 28500, '5–7 days', [5, 7], ['plus', 'trailblazer'], 'hunza-valley-tour-packages/'),
  ttPackage('tt-skardu', 'Skardu tour', ['skardu'], 32500, '6–8 days', [6, 8], ['plus', 'trailblazer'], 'skardu-tour-packages/'),
  ttPackage('tt-hunza-skardu', 'Hunza + Skardu tour', ['hunza', 'skardu'], 46500, '8–10 days', [8, 10], ['plus', 'trailblazer'], 'hunza-skardu-tour-packages/'),
  ttPackage('tt-fairy-meadows', 'Fairy Meadows tour', ['fairy-meadows'], 27500, '5–7 days', [5, 7], ['trailblazer'], 'fairy-meadows-tour-packages/'),
  ttPackage('tt-naran', 'Naran Kaghan tour', ['naran-kaghan'], 17500, '3–5 days', [3, 5], ['trailblazer'], 'naran-kaghan-tour-packages/'),
  ttPackage('tt-swat-kalam', 'Swat Kalam tour', ['swat-kalam'], 17500, '3–5 days', [3, 5], [], 'swat-kalam-tour-packages/'),
  ttPackage('tt-neelum', 'Neelum Valley tour', ['neelum'], 18500, '3–5 days', [3, 5], [], 'neelum-valley-tour-packages/'),
  ttPackage('tt-kumrat', 'Kumrat Valley tour', ['kumrat'], 19500, '3–5 days', [3, 5], [], 'kumrat-valley-tour-packages/'),
  ttPackage('tt-murree', 'Murree & Galiyat tour', ['murree-galiyat'], 12500, '2–4 days', [2, 4], [], 'murree-tour-packages/'),
  {
    id: 'ptt-lahore',
    title: 'Lahore guided city tour',
    destinationIds: ['lahore'],
    operatorName: 'Pakistan Tour N Travel',
    sourceUrl: 'https://pakistantourntravel.com/lahore-city-tour-packages/',
    sourceCheckedAt: PRICE_SNAPSHOT_DATE,
    pricePkr: 20000,
    priceBasis: 'per-person',
    priceQualifier: 'starting-from',
    durationLabel: '1 day (about 10 hours)',
    durationDays: [1, 1],
    departureContext: 'Private Lahore tour; PKR 20,000/person is the published 6–10-person tier',
    inclusions: ['Private AC transport', 'English/Urdu-speaking guide', 'Listed sightseeing and entry tickets for the selected itinerary', 'Water and listed local experience inclusions'],
    exclusions: ['Meals not stated in the selected itinerary', 'Personal shopping, tips and optional activities'],
    caveats: ['The operator lists PKR 30,000/person for 1–2 people, PKR 25,000/person for 3–5 people and PKR 20,000/person for 6–10 people for its 1-day tour.', 'Confirm the exact itinerary, group-size tier, inclusions and dates directly with the operator.'],
    membershipEligibility: [],
    availabilityStatus: 'not-verified',
  },
  {
    id: 'pac-swat',
    title: 'Swat Valley 5-day tour (economy, group of 5–6)',
    destinationIds: ['swat-kalam'],
    operatorName: 'Paramount Adventure Club',
    sourceUrl: 'https://www.paramount.pk/pc_tour/swat-valley-5d/',
    sourceCheckedAt: PRICE_SNAPSHOT_DATE,
    pricePkr: 22000,
    priceBasis: 'per-person',
    priceQualifier: 'fixed-published-rate',
    durationLabel: '5 days / 4 nights',
    durationDays: [5, 5],
    departureContext: 'Islamabad–Islamabad for a group of 5–6 using a BR-V; Lahore pickup adds PKR 3,000/person',
    inclusions: ['AC vehicle', 'Hotel accommodation', 'Jeep as specified in the itinerary', 'Breakfast', 'Fuel and toll tax', 'Driver food and accommodation'],
    exclusions: ['Lunch and dinner', 'Entry tickets and optional activities', 'Personal insurance, medical evacuation/rescue and personal expenses'],
    caveats: ['PKR 22,000/person is the economy option for a group of 5–6 departing Islamabad; the source adds PKR 3,000/person for Lahore pickup.', 'Other group sizes, vehicles and hotel tiers have different rates. Confirm the final amount and dates with the operator.'],
    membershipEligibility: [],
    availabilityStatus: 'not-verified',
  },
];

// Membership plans
const MEMBERSHIP_PLANS = [
  {
    id: 'explorer',
    name: 'Explorer',
    pricePkr: 0,
    period: 'free',
    discountRate: 0,
    limits: { trips: 3, collections: 2 },
    summary: 'Everything you need to discover and plan your first journeys.',
    benefits: ['Save unlimited favourites', 'Up to 3 trip plans', 'Up to 2 named collections', 'Quiz, concierge and comparison tools', 'Discovery passport'],
  },
  {
    id: 'plus',
    name: 'Explorer Plus',
    pricePkr: 1499,
    period: 'year',
    discountRate: 0.05,
    limits: { trips: Infinity, collections: Infinity },
    summary: 'For regular travellers who plan several trips a year.',
    benefits: ['Everything in Explorer', 'Unlimited trip plans and collections', 'Proposed 5% member saving on eligible packages', 'Plus badge on your passport'],
  },
  {
    id: 'trailblazer',
    name: 'Trailblazer',
    pricePkr: 3999,
    period: 'year',
    discountRate: 0.1,
    limits: { trips: Infinity, collections: Infinity },
    summary: 'For people who want to see every province.',
    benefits: ['Everything in Explorer Plus', 'Proposed 10% member saving on eligible packages', 'Eligibility on a wider set of packages', 'Regional passport challenges'],
  },
];

const STORIES = [
  {
    id: 'lahore-walled-city-after-dark',
    title: 'Lahore after dark: a walk through the Walled City',
    category: 'food',
    destinationIds: ['lahore'],
    dek: 'Start at Delhi Gate in late afternoon and end with dinner under the Badshahi Mosque.',
    sections: [
      { heading: 'Delhi Gate to Wazir Khan', body: 'Enter through Delhi Gate as the heat fades. The restored Shahi Hammam is just inside, its frescoed domes a quiet introduction to what follows. A few minutes on, the Wazir Khan Mosque bursts with glazed tile and painted plaster — some of the finest Mughal surface decoration anywhere.' },
      { heading: 'Through the bazaars', body: 'Keep walking west through Kashmiri Bazaar and the spice lanes of Akbari Mandi. The streets narrow, balconies lean in, and you will pass workshops that have practised the same trade for generations. Go slowly and let the lanes set the pace.' },
      { heading: 'Dinner with a view', body: 'By the time you reach Fort Road, the Badshahi Mosque is lit against the night. Rooftop restaurants face it directly. Order karahi or tikka, finish with kheer or lassi, and watch the domes change colour as the evening deepens.' },
    ],
    pullQuote: 'Go slowly and let the lanes set the pace.',
  },
  {
    id: 'reading-the-stones-of-makli',
    title: 'Reading the stones of Makli',
    category: 'heritage',
    destinationIds: ['makli-thatta'],
    dek: 'Four centuries of Sindhi history, carved into a single hillside.',
    sections: [
      { heading: 'A city of the dead', body: 'Makli Hill stretches for kilometres outside Thatta, covered with tombs of rulers, scholars and saints. The oldest date from the Samma dynasty, whose sandstone tombs are carved with dense geometric and floral patterns.' },
      { heading: 'How styles changed', body: 'Walk north and the language changes. Tarkhan and Mughal-era tombs bring domes, glazed tiles and Persian arches. The site works as an open-air timeline of the region’s rulers and the craftspeople who served them.' },
      { heading: 'Visiting well', body: 'Go early or late in the day, wear sturdy shoes, and consider a local guide. Makli is a place of reverence — move quietly, and leave the stones as you found them.' },
    ],
    pullQuote: 'An open-air timeline of the region’s rulers and craftspeople.',
  },
  {
    id: 'karakoram-highway-slowly',
    title: 'The Karakoram Highway, slowly',
    category: 'road-trips',
    destinationIds: ['fairy-meadows', 'hunza'],
    dek: 'Why the best way to travel north is to stop more often than you think.',
    sections: [
      { heading: 'Break the road', body: 'The highway from Islamabad to Hunza is long, and travelling it in one push wastes it. Split the journey with nights in the Kaghan Valley or near Chilas, and give the mountains time to arrive.' },
      { heading: 'Raikot Bridge and beyond', body: 'At Raikot Bridge, a side trip leads up to Fairy Meadows and Nanga Parbat. Back on the highway, the view point where three great ranges meet — the Himalaya, Karakoram and Hindu Kush — is worth a short stop.' },
      { heading: 'Into Hunza', body: 'Past Gilgit, the valley narrows and then opens into Hunza’s terraces. Arriving in late afternoon, when the light turns gold on Rakaposhi, makes the long road feel worth every hour.' },
    ],
    pullQuote: 'Give the mountains time to arrive.',
  },
  {
    id: 'spring-blossom-high-valleys',
    title: 'Blossom season in the high valleys',
    category: 'nature',
    destinationIds: ['hunza', 'skardu'],
    dek: 'For a few weeks each spring, apricot and cherry trees turn the north pink and white.',
    sections: [
      { heading: 'Timing it', body: 'Blossom usually arrives in Hunza and Skardu from late March into April, moving up the valley with altitude. Exact timing shifts each year with the weather, so keep plans flexible.' },
      { heading: 'Where to look', body: 'Karimabad’s terraces, the villages around Altit and the orchards of Shigar are reliable. Early morning brings soft light and quieter lanes.' },
      { heading: 'Travel lightly', body: 'Orchards are private land and a livelihood. Admire from paths, ask before entering, and never pick flowers or branches.' },
    ],
    pullQuote: 'Orchards are private land and a livelihood.',
  },
  {
    id: 'makran-coast-kund-malir',
    title: 'Kund Malir and the Makran coast',
    category: 'hidden-gems',
    destinationIds: ['hingol'],
    dek: 'A road trip where desert cliffs run straight into the Arabian Sea.',
    sections: [
      { heading: 'The road west', body: 'The Makran Coastal Highway leaves Karachi’s sprawl behind quickly. Within a few hours you are among wind-carved cliffs that look sculpted, and the road itself becomes the attraction.' },
      { heading: 'Rock and sea', body: 'Hingol National Park holds the Princess of Hope and the so-called Sphinx — natural formations that have become landmarks. Kund Malir’s long beach is usually close to empty.' },
      { heading: 'Go prepared', body: 'Services are sparse. Carry water, food and fuel, check current advisories, and do not swim in strong surf — there are no lifeguards.' },
    ],
    pullQuote: 'The road itself becomes the attraction.',
  },
  {
    id: 'guest-not-spectator-kalash',
    title: 'Guest, not spectator: visiting the Kalash valleys',
    category: 'festivals',
    destinationIds: ['kalash'],
    dek: 'Festivals here are living religious events. How to visit with respect.',
    sections: [
      { heading: 'A living culture', body: 'The Kalasha have their own language, beliefs and calendar of festivals, including Chilam Joshi in spring and Chaumos in winter. These are community occasions first.' },
      { heading: 'Photography and consent', body: 'Always ask before photographing people — and accept a no. Avoid filming ceremonies unless invited, and never pay or pressure anyone for a picture.' },
      { heading: 'Spend locally', body: 'Stay in locally run guesthouses, buy crafts directly from makers, and visit the Kalasha Dur cultural centre to learn the context behind what you see.' },
    ],
    pullQuote: 'These are community occasions first.',
  },
  {
    id: 'leave-no-trace-above-treeline',
    title: 'Leave no trace above the treeline',
    category: 'responsible',
    destinationIds: ['fairy-meadows', 'deosai', 'naran-kaghan'],
    dek: 'Popular lakes and meadows are under pressure. Small habits make a difference.',
    sections: [
      { heading: 'Carry it out', body: 'Mountain areas have little or no waste collection. Bring a bag for your rubbish and take it back to town — including wrappers, bottles and cigarette ends.' },
      { heading: 'Wildlife first', body: 'On Deosai and in the forests, keep your distance from animals, never feed them, and store food securely. A fed animal is often a doomed one.' },
      { heading: 'Water and noise', body: 'Do not wash with soap in streams or lakes. Keep music low; for many visitors, the silence is the point.' },
    ],
    pullQuote: 'For many visitors, the silence is the point.',
  },
  {
    id: 'light-at-deosai',
    title: 'Light at Deosai: a photographer’s day',
    category: 'photography',
    destinationIds: ['deosai', 'skardu'],
    dek: 'Plan around the sun and the weather on one of the world’s highest plateaus.',
    sections: [
      { heading: 'Leave early', body: 'Set off from Skardu before dawn to reach the plateau in soft light. The first hour shows the plains at their best, with low sun across the grass.' },
      { heading: 'Read the sky', body: 'Afternoon cloud often builds quickly. Use it — dramatic skies over Sheosar Lake can be better than clear blue — but keep warm layers ready.' },
      { heading: 'Wildlife ethics', body: 'Use a long lens and never approach animals for a shot. If an animal changes its behaviour because of you, you are too close.' },
    ],
    pullQuote: 'If an animal changes its behaviour because of you, you are too close.',
  },
  {
    id: 'what-to-eat-in-the-north',
    title: 'Apricots, chapshuro and butter tea',
    category: 'food',
    destinationIds: ['hunza', 'skardu'],
    dek: 'A short guide to eating well in Gilgit-Baltistan.',
    sections: [
      { heading: 'Hunza', body: 'Chapshuro — a flatbread filled with spiced meat — is the dish to look for. Apricots appear fresh in summer and dried the rest of the year, alongside walnuts, apricot-kernel oil and local herbal teas.' },
      { heading: 'Baltistan', body: 'In Skardu and Shigar, butter tea is part of daily life, and buckwheat appears in pancakes and breads. Hearty soups suit the cold evenings.' },
      { heading: 'Eat where people live', body: 'Small family cafés and homestays usually cook the most local food. Ask what is seasonal and you will eat better than from any menu.' },
    ],
    pullQuote: 'Ask what is seasonal and you will eat better than from any menu.',
  },
];

const STORY_CATEGORIES = [
  { id: 'heritage', label: 'Heritage & architecture' },
  { id: 'food', label: 'Food' },
  { id: 'festivals', label: 'Festivals & traditions' },
  { id: 'road-trips', label: 'Road trips' },
  { id: 'nature', label: 'Nature & outdoors' },
  { id: 'hidden-gems', label: 'Hidden gems' },
  { id: 'responsible', label: 'Responsible travel' },
  { id: 'photography', label: 'Photography' },
];

const QUIZ_QUESTIONS = [
  {
    id: 'vibe', title: 'What kind of trip are you dreaming of?', type: 'single',
    options: [
      { id: 'mountains', label: 'Big mountain views', icon: Mountain },
      { id: 'history', label: 'History and old cities', icon: Landmark },
      { id: 'calm', label: 'Somewhere calm and green', icon: Trees },
      { id: 'wild', label: 'Wild, empty landscapes', icon: Compass },
      { id: 'food', label: 'Food and city life', icon: Utensils },
    ],
  },
  {
    id: 'interests', title: 'Which of these would you enjoy?', hint: 'Choose any that apply.', type: 'multi', optional: true,
    options: [
      { id: 'lakes', label: 'Lakes' }, { id: 'trekking', label: 'Hiking' }, { id: 'heritage', label: 'Forts and ruins' },
      { id: 'culture', label: 'Local culture' }, { id: 'food', label: 'Food' }, { id: 'desert', label: 'Desert' },
      { id: 'coast', label: 'Coast' }, { id: 'wildlife', label: 'Wildlife' },
    ],
  },
  {
    id: 'days', title: 'How many days do you have?', type: 'single',
    options: [{ id: '2', label: 'A weekend (1–2)' }, { id: '4', label: '3–5 days' }, { id: '7', label: 'About a week' }, { id: '10', label: '8 days or more' }],
  },
  {
    id: 'season', title: 'When are you travelling?', type: 'single',
    options: [...SEASONS.map((s) => ({ id: s.id, label: `${s.label} (${s.months})`, icon: s.icon })), { id: 'any', label: 'Not sure yet' }],
  },
  {
    id: 'budget', title: 'What budget feels right?', type: 'single',
    options: [{ id: 'budget', label: 'Keep it lean' }, { id: 'mid', label: 'Comfortable' }, { id: 'premium', label: 'Treat ourselves' }],
  },
  {
    id: 'from', title: 'Where will you start from?', type: 'single',
    options: [...CITIES.map((c) => ({ id: c.id, label: c.name })), { id: 'other', label: 'Somewhere else' }],
  },
  {
    id: 'group', title: 'Who’s coming?', type: 'single',
    options: COMPANIONS.map((c) => ({ id: c.id, label: c.label })),
  },
  {
    id: 'effort', title: 'How much effort are you up for?', type: 'single',
    options: [
      { id: 'easy', label: 'Easy — short walks and good roads' },
      { id: 'moderate', label: 'Some jeep tracks and hikes' },
      { id: 'challenging', label: 'Long hikes and rough roads' },
    ],
  },
];

// Packing list rules
const PACKING_RULES = {
  base: ['CNIC or passport (and copies)', 'Phone charger and power bank', 'Reusable water bottle', 'Basic first-aid kit', 'Personal medication', 'Cash in small notes', 'Sunscreen and sunglasses', 'Hand sanitiser'],
  seasons: {
    winter: ['Insulated jacket', 'Thermal base layers', 'Warm hat and gloves', 'Waterproof boots'],
    summer: ['Light breathable clothes', 'Sun hat', 'Rain shell for the mountains'],
    spring: ['Warm mid-layer', 'Light rain jacket'],
    autumn: ['Warm mid-layer', 'Fleece for cold evenings'],
  },
  activities: {
    trekking: ['Broken-in hiking shoes', 'Daypack', 'Trekking poles', 'Blister plasters', 'Snacks for the trail'],
    culture: ['Modest clothing', 'Scarf for mosque and shrine visits', 'Small notebook'],
    desert: ['Wide-brim hat', 'Extra water', 'Scarf against dust'],
    coast: ['Sandals', 'Quick-dry towel', 'Rubbish bag'],
    city: ['Comfortable walking shoes', 'Mask for smog days'],
    camping: ['Warm sleeping layer', 'Head torch', 'Wet wipes'],
  },
  long: ['Laundry bag', 'Spare batteries', 'Travel-size detergent'],
};

const FAQ_ITEMS = [
  { id: 'prices', q: 'Where do the package prices come from?', a: 'Each price is a starting rate published by a named tour operator, with a link to the source page and the date we checked it. Rates change, so always confirm the final price, dates and inclusions with the operator before you pay.' },
  { id: 'booking', q: 'Can I book a tour here?', a: 'Not directly. Explore Pakistan helps you discover, compare and plan. When you are ready, use “View operator details” to contact the tour company yourself.' },
  { id: 'saved', q: 'Where are my trips and saved places stored?', a: 'In this browser on this device. They stay after a refresh, but they won’t appear on another device, and clearing your browser data removes them.' },
  { id: 'concierge', q: 'How does the travel concierge make recommendations?', a: 'It matches what you tell it — days, budget, season, interests and starting city — against our curated destination guides and sourced package rates. It does not check live weather, road status or availability.' },
  { id: 'membership', q: 'What does membership include?', a: 'Explorer is free. Explorer Plus and Trailblazer add unlimited trip plans and collections, plus proposed member savings on selected packages. Membership terms are Explore Pakistan’s own and are not offered by the tour operators.' },
  { id: 'payment', q: 'Do you take card payments?', a: 'No. Choosing a plan updates your profile on this device; we never ask for card details.' },
  { id: 'roads', q: 'Are mountain roads open all year?', a: 'No. Several passes and high plateaus — such as Babusar and Deosai — are only open in summer, and landslides can close roads at any time. Check with local authorities or your operator close to your travel dates.' },
  { id: 'foreigners', q: 'Do international visitors need permits?', a: 'Requirements differ by area and change over time, especially near borders. Check the latest official guidance and ask your tour operator before you travel.' },
  { id: 'map', q: 'Why does the map sometimes show a list instead?', a: 'If the interactive map can’t load, you still get every destination with a direct “Open in Google Maps” link, so you can keep planning.' },
];

/** Season guide copy and curated routes for the toolkit. */
const SEASON_GUIDE = {
  spring: { picks: ['hunza', 'skardu', 'islamabad', 'lahore'], note: 'Blossom in the north from late March; lower mountain roads reopen. Higher passes may still be closed.' },
  summer: { picks: ['deosai', 'fairy-meadows', 'naran-kaghan', 'kumrat', 'neelum'], note: 'The north is at its most accessible. Avoid the plains’ heat; monsoon rain can affect roads from July.' },
  autumn: { picks: ['hunza', 'skardu', 'kalash', 'lahore'], note: 'Golden poplars in the north through October–November, and comfortable city weather returns.' },
  winter: { picks: ['mohenjo-daro', 'makli-thatta', 'hingol', 'derawar-cholistan', 'lahore'], note: 'Best for Sindh, Balochistan’s coast and the Punjab desert. Northern roads and flights can be disrupted by snow.' },
};

const CURATED_ROUTES = [
  { id: 'kkh-north', title: 'Up the Karakoram Highway', days: '8–10 days', stops: ['islamabad', 'naran-kaghan', 'fairy-meadows', 'hunza'], note: 'A summer route via the Babusar Pass; outside summer, use the highway through Besham instead.' },
  { id: 'baltistan', title: 'Baltistan circuit', days: '6–8 days', stops: ['skardu', 'deosai'], note: 'Fly or drive to Skardu, then a Deosai crossing in July–September.' },
  { id: 'heritage-punjab-sindh', title: 'Indus heritage trail', days: '6–8 days', stops: ['lahore', 'derawar-cholistan', 'mohenjo-daro', 'makli-thatta'], note: 'A winter road trip down the plains, from Mughal Lahore to Indus-era Mohenjo-daro.' },
  { id: 'makran', title: 'Makran coast weekend', days: '2 days', stops: ['makli-thatta', 'hingol'], note: 'From Karachi: Makli one way, the coastal highway the other.' },
  { id: 'swat-dir', title: 'Swat and Dir forests', days: '5–7 days', stops: ['swat-kalam', 'kumrat'], note: 'Summer valleys, forest camps and Gandhara heritage.' },
];

// Hero media config
const HERO_MEDIA = {
  // Poster is a bundled local file; its author and licence live in the manifest and on /credits.
  poster: MEDIA.extras?.['home-hero']?.path || '',
  posterAlt: MEDIA.extras?.['home-hero']?.alt || 'Hunza Valley at golden hour, seen from Eagle’s Nest',
  // Pexels clip (Pexels licence: free to use, attribution not required). Source kept as an internal record.
  video: 'https://videos.pexels.com/video-files/29278952/12628629_3840_2160_30fps.mp4',
  videoSource: 'https://www.pexels.com/video/stunning-aerial-view-of-mountain-road-in-pakistan-29278952/',
  audio: '/audio/nature-peaceful.m4a',
  coords: '36.32° N · 74.66° E',
};

// Utility & Helper Functions

const pkrFormatter = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
/** formatPkr(28500) → "PKR 28,500" */
const formatPkr = (n) => (Number.isFinite(n) ? `PKR ${pkrFormatter.format(Math.round(n))}` : '—');
const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
const cx = (...parts) => parts.filter(Boolean).join(' ');
const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const toNumber = (v, fallback = 0) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : fallback;
};
const labelOf = (list, id) => list.find((x) => x.id === id)?.label || id;
const regionName = (id) => REGIONS.find((r) => r.id === id)?.name || id;
const formatCoords = ({ lat, lng }) => `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`;
const durationLabel = ([a, b]) => (a === b ? `${a} day${a > 1 ? 's' : ''}` : `${a}–${b} days`);

const PRICE_BASIS_LABEL = {
  'per-person': 'per person',
  'per-couple': 'per couple',
  'per-vehicle': 'per vehicle',
  'per-group': 'per group',
  'not-stated': 'basis not stated by operator',
};

// Storage parser
const storage = {
  available: (() => {
    try {
      const k = `${STORAGE_PREFIX}__probe`;
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  })(),
  read(key, fallback, validate = () => true) {
    if (!this.available) return fallback;
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
      if (raw == null) return fallback;
      const parsed = JSON.parse(raw);
      return validate(parsed) ? parsed : fallback;
    } catch {
      return fallback; // corrupted JSON → safe default
    }
  },
  write(key, value) {
    if (!this.available) return false;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false; // quota exceeded or blocked
    }
  },
};

const isStringArray = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const validTrips = (v) => Array.isArray(v) && v.every((t) => isObject(t) && typeof t.id === 'string' && Array.isArray(t.days));
const validCollections = (v) => Array.isArray(v) && v.every((c) => isObject(c) && typeof c.id === 'string' && isStringArray(c.destinationIds));

// Persistent state hook
function usePersistentState(key, fallback, validate) {
  const [value, setValue] = useState(() => storage.read(key, fallback, validate));
  useEffect(() => {
    storage.write(key, value);
  }, [key, value]);
  return [value, setValue];
}

// Recommendation & Planning Logic

const getDestination = (id) => DESTINATIONS.find((d) => d.id === id);
const getPackage = (id) => TOUR_PACKAGES.find((p) => p.id === id);
const getStory = (id) => STORIES.find((s) => s.id === id);
const getPlan = (id) => MEMBERSHIP_PLANS.find((p) => p.id === id) || MEMBERSHIP_PLANS[0];
const packagesFor = (destinationId) => TOUR_PACKAGES.filter((p) => p.destinationIds.includes(destinationId));
// Lowest price helper
const lowestPrice = (destinationId) => {
  const prices = packagesFor(destinationId).map((p) => p.pricePkr).filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : null;
};

/** Google Maps URLs (no key needed). */
const mapsSearchUrl = ({ lat, lng }) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
const mapsDirectionsUrl = (dest, origin) =>
  `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;
// Multi-stop route helper
const mapsRouteUrl = (originName, coordsList) => {
  if (!coordsList.length) return null;
  const last = coordsList[coordsList.length - 1];
  const waypoints = coordsList.slice(0, -1).slice(0, 9).map((c) => `${c.lat},${c.lng}`).join('|');
  return `https://www.google.com/maps/dir/?api=1${originName ? `&origin=${encodeURIComponent(`${originName}, Pakistan`)}` : ''}&destination=${last.lat},${last.lng}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}`;
};

// Straight-line distance
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ---------- Explore: filtering and sorting ---------- */
const EMPTY_FILTERS = { q: '', region: [], category: [], season: [], duration: [], budget: [], style: [], companions: [], difficulty: [], hidden: false };
const FILTER_KEYS = ['region', 'category', 'season', 'duration', 'budget', 'style', 'companions', 'difficulty'];

function matchesQuery(d, q) {
  if (!q) return true;
  const hay = [d.name, d.area, regionName(d.region), d.tagline, ...d.categories, ...d.highlights].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((term) => hay.includes(term));
}

function filterDestinations(list, f) {
  return list.filter((d) => {
    if (!matchesQuery(d, f.q)) return false;
    if (f.region.length && !f.region.includes(d.region)) return false;
    if (f.category.length && !f.category.some((c) => d.categories.includes(c))) return false;
    if (f.season.length && !f.season.some((s) => d.seasons.includes(s))) return false;
    if (f.duration.length && !f.duration.some((id) => {
      const r = DURATIONS.find((x) => x.id === id);
      return d.durationDays[0] <= r.max && d.durationDays[1] >= r.min;
    })) return false;
    if (f.budget.length && !f.budget.includes(d.budget)) return false;
    if (f.style.length && !f.style.some((s) => d.styles.includes(s))) return false;
    if (f.companions.length && !f.companions.some((c) => d.companions.includes(c))) return false;
    if (f.difficulty.length && !f.difficulty.includes(d.difficulty)) return false;
    if (f.hidden && !d.hiddenGem) return false;
    return true;
  });
}

function sortDestinations(list, sort) {
  const copy = [...list];
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'price') {
    // Destinations without a sourced price go last — they are never treated as PKR 0.
    return copy.sort((a, b) => {
      const pa = lowestPrice(a.id);
      const pb = lowestPrice(b.id);
      if (pa == null && pb == null) return a.name.localeCompare(b.name);
      if (pa == null) return 1;
      if (pb == null) return -1;
      return pa - pb;
    });
  }
  return copy; // "relevance" keeps the editorial order of DESTINATIONS
}

// Filters URL sync
function filtersFromParams(params) {
  const f = { ...EMPTY_FILTERS, q: params.get('q') || '', hidden: params.get('hidden') === '1' };
  FILTER_KEYS.forEach((k) => {
    const v = params.get(k);
    f[k] = v ? v.split(',').filter(Boolean) : [];
  });
  return f;
}
function filtersToParams(f, extra = {}) {
  const p = {};
  if (f.q) p.q = f.q;
  FILTER_KEYS.forEach((k) => { if (f[k].length) p[k] = f[k].join(','); });
  if (f.hidden) p.hidden = '1';
  Object.entries(extra).forEach(([k, v]) => { if (v) p[k] = v; });
  return p;
}

/* ---------- Global search index ---------- */
function buildSearchResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out = [];
  DESTINATIONS.forEach((d) => {
    if (matchesQuery(d, q)) out.push({ type: 'Destination', id: d.id, label: d.name, sub: regionName(d.region), to: `/destinations/${d.id}` });
  });
  REGIONS.forEach((r) => {
    if (r.name.toLowerCase().includes(q)) out.push({ type: 'Region', id: r.id, label: r.name, sub: `${DESTINATIONS.filter((d) => d.region === r.id).length} places`, to: `/explore?region=${r.id}` });
  });
  CATEGORIES.forEach((c) => {
    if (c.label.toLowerCase().includes(q) || c.id.includes(q)) out.push({ type: 'Category', id: c.id, label: c.label, sub: 'Browse places', to: `/explore?category=${c.id}` });
  });
  STORIES.forEach((s) => {
    if (`${s.title} ${s.dek} ${labelOf(STORY_CATEGORIES, s.category)}`.toLowerCase().includes(q)) out.push({ type: 'Story', id: s.id, label: s.title, sub: labelOf(STORY_CATEGORIES, s.category), to: `/stories/${s.id}` });
  });
  return out.slice(0, 12);
}

// Quiz scoring
const VIBE_MAP = {
  mountains: ['mountains', 'valleys', 'trekking'],
  history: ['heritage', 'culture'],
  calm: ['valleys', 'lakes'],
  wild: ['desert', 'coast', 'wildlife'],
  food: ['food', 'city'],
};

// rankDestinations
function rankDestinations(answers) {
  const days = toNumber(answers.days, 0);
  const from = CITIES.find((c) => c.id === answers.from);
  const effortOrder = { easy: 0, moderate: 1, challenging: 2 };
  const results = DESTINATIONS.map((d) => {
    let score = 0;
    const reasons = [];
    const vibeCats = VIBE_MAP[answers.vibe] || [];
    const vibeHit = vibeCats.filter((c) => d.categories.includes(c));
    if (vibeHit.length) { score += 3 + vibeHit.length; reasons.push(`Strong on ${vibeHit.map((c) => labelOf(CATEGORIES, c).toLowerCase()).join(' and ')}.`); }
    const interestHit = (answers.interests || []).filter((i) => d.categories.includes(i));
    if (interestHit.length) { score += interestHit.length * 2; reasons.push(`Matches your interest in ${interestHit.map((c) => labelOf(CATEGORIES, c).toLowerCase()).join(', ')}.`); }
    if (answers.season && answers.season !== 'any') {
      if (d.seasons.includes(answers.season)) { score += 3; reasons.push(`Good in ${labelOf(SEASONS, answers.season).toLowerCase()} (best: ${d.bestMonths.split(';')[0]}).`); }
      else score -= 6;
    }
    if (days) {
      if (days >= d.durationDays[0]) { score += 2; reasons.push(`Fits in ${days <= 2 ? 'a weekend' : `${days} days`} (suggested ${durationLabel(d.durationDays)}).`); }
      else score -= 4;
    }
    if (answers.budget) {
      if (answers.budget === d.budget) score += 2;
      else if (answers.budget === 'budget' && d.budget === 'premium') score -= 2;
    }
    if (answers.budgetPkr) {
      const p = lowestPrice(d.id);
      if (p != null && p <= answers.budgetPkr) {
        score += 4;
        reasons.push(`Has tour packages within your budget (from ${formatPkr(p)}).`);
      } else if (d.budget === 'budget') {
        score += 2;
        reasons.push('Budget-friendly destination.');
      } else if (p != null && p > answers.budgetPkr * 1.3) {
        score -= 3;
      }
    }
    if (answers.group && d.companions.includes(answers.group)) {
      score += answers.group === 'family' ? 3 : 2;
      if (answers.group === 'family') reasons.push('Works well for families with easy access.');
    }
    if (answers.effort) {
      const diff = effortOrder[d.difficulty] - effortOrder[answers.effort];
      if (diff > 0) score -= 4 * diff; else score += 1;
    }
    if (from) {
      const km = haversineKm(from, d.coords);
      if (km < 300) { score += days && days <= 2 ? 4 : 2; reasons.push(`Close to ${from.name} (about ${Math.round(km / 10) * 10} km straight-line).`); }
      else if (days && days <= 2 && km > 600) score -= 4;
    }
    return { destination: d, score, reasons: reasons.slice(0, 4) };
  });
  const sorted = results.sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score || 0;
  const isQuizDone = answers.from && answers.vibe && answers.season;
  const minScore = isQuizDone ? 8 : (topScore >= 6 ? 4 : (topScore > 0 ? Math.max(1, topScore - 2) : 0));
  const ranked = sorted.filter((r) => r.score >= minScore).slice(0, 5);
  const best = ranked[0]?.score || 0;
  return ranked.map((r) => ({
    ...r,
    fit: r.score >= 14 && r.score >= best - 1 ? 'Great fit' : r.score >= 11 ? 'Good fit' : 'Worth a look',
  }));
}

// Budget calculations
const DEFAULT_BUDGET = { travellers: 2, days: 4, nights: 3, rooms: 1, roomRate: 0, foodPerPersonPerDay: 0, transport: 0, activities: 0, packages: 0, other: 0, contingencyPct: 10 };

// calculateBudget
function calculateBudget(input) {
  const b = { ...DEFAULT_BUDGET, ...input };
  const travellers = Math.max(1, toNumber(b.travellers, 1));
  const accommodation = toNumber(b.roomRate) * Math.max(0, toNumber(b.nights)) * Math.max(0, toNumber(b.rooms));
  const food = toNumber(b.foodPerPersonPerDay) * travellers * Math.max(0, toNumber(b.days));
  const lines = [
    { id: 'transport', label: 'Transport', amount: toNumber(b.transport), icon: Car },
    { id: 'accommodation', label: 'Accommodation', amount: accommodation, icon: Bed },
    { id: 'food', label: 'Food', amount: food, icon: Utensils },
    { id: 'activities', label: 'Activities & entry', amount: toNumber(b.activities), icon: Ticket },
    { id: 'packages', label: 'Package fees (sourced rates)', amount: toNumber(b.packages), icon: Receipt },
    { id: 'other', label: 'Other', amount: toNumber(b.other), icon: Wallet },
  ];
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const contingency = Math.round(subtotal * (Math.max(0, toNumber(b.contingencyPct)) / 100));
  const total = subtotal + contingency;
  return { lines, subtotal, contingency, total, perPerson: Math.round(total / travellers), travellers };
}

// Member price calculation
function memberPrice(pkg, planId) {
  const plan = getPlan(planId);
  if (!Number.isFinite(pkg.pricePkr) || !plan.discountRate || !pkg.membershipEligibility.includes(plan.id)) return null;
  const discount = Math.round(pkg.pricePkr * plan.discountRate);
  return { base: pkg.pricePkr, discount, price: pkg.pricePkr - discount, rate: plan.discountRate, plan };
}

/* ---------- Trip helpers ---------- */
const newDay = () => ({ id: uid('day'), notes: '', stops: [] });
const newTrip = (overrides = {}) => ({
  id: uid('trip'),
  name: 'Untitled trip',
  startCity: 'Islamabad',
  startDate: '',
  season: '',
  groupSize: 2,
  budgetTarget: 0,
  style: '',
  interests: [],
  notes: '',
  days: [newDay(), newDay(), newDay()],
  costs: { roomRate: 0, rooms: 1, foodPerPersonPerDay: 0, transport: 0, activities: 0, other: 0, contingencyPct: 10 },
  packages: [], // [{ packageId, quantity }]
  createdAt: new Date().toISOString(),
  ...overrides,
});
const tripDestinationIds = (trip) => [...new Set(trip.days.flatMap((d) => d.stops.map((s) => s.destinationId)))];
function tripBudget(trip) {
  const packages = (trip.packages || []).reduce((sum, p) => {
    const pkg = getPackage(p.packageId);
    return sum + (pkg ? pkg.pricePkr * Math.max(0, toNumber(p.quantity, 1)) : 0);
  }, 0);
  const days = trip.days.length;
  return calculateBudget({ ...trip.costs, travellers: trip.groupSize, days, nights: Math.max(0, days - 1), packages });
}
/** Immutable array move used by itinerary reordering. */
const moveItem = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

/* ---------- Packing list ---------- */
function buildPackingList({ season, activities = [], days = 3 }) {
  const items = [...PACKING_RULES.base];
  if (season && PACKING_RULES.seasons[season]) items.push(...PACKING_RULES.seasons[season]);
  activities.forEach((a) => { if (PACKING_RULES.activities[a]) items.push(...PACKING_RULES.activities[a]); });
  if (toNumber(days) > 5) items.push(...PACKING_RULES.long);
  return [...new Set(items)].map((label) => ({ id: uid('item'), label, done: false, custom: false }));
}

// Travel Concierge engine
const MONTH_TO_SEASON = { jan: 'winter', feb: 'winter', mar: 'spring', apr: 'spring', may: 'spring', jun: 'summer', jul: 'summer', aug: 'summer', sep: 'autumn', oct: 'autumn', nov: 'autumn', dec: 'winter' };
const INTEREST_WORDS = {
  lakes: ['lake', 'lakes'], trekking: ['trek', 'hike', 'hiking', 'trail', 'walk'], heritage: ['history', 'historic', 'heritage', 'fort', 'ruins', 'ancient', 'archaeology'],
  culture: ['culture', 'cultural', 'festival', 'local'], food: ['food', 'eat', 'cuisine', 'foodie'], desert: ['desert', 'dunes', 'sand'],
  coast: ['beach', 'coast', 'sea'], wildlife: ['wildlife', 'bear', 'animals', 'birds'], mountains: ['mountain', 'mountains', 'peaks', 'snow', 'north', 'northern'],
  city: ['city', 'urban'], valleys: ['valley', 'green', 'forest'],
};
const LIVE_PATTERNS = /\b(weather|forecast|temperature|rain(ing)? (today|now)|road (status|open|closed)|is .* open|closed today|traffic|availability|available (on|dates)|seats|flight (status|times|schedule)|today'?s|right now|live)\b/i;

function parseConciergeMessage(text) {
  const t = text.toLowerCase();
  const found = {};
  const dayMatch = t.match(/(\d+)\s*(?:-|to)?\s*(?:\d+\s*)?(day|days|night|nights)/);
  if (dayMatch) found.days = Math.min(21, Math.max(1, parseInt(dayMatch[1], 10)));
  else if (/\bweekend\b/.test(t)) found.days = 2;
  else if (/\b(a|one) week\b/.test(t)) found.days = 7;
  const budgetMatch = t.match(/(?:pkr|rs\.?|under|below|budget of|budget|around|max|for|in)\s*([\d,.]+)\s*(k|thousand|lac|lakh)?/);
  if (budgetMatch) {
    let n = toNumber(budgetMatch[1]);
    if (/k|thousand/.test(budgetMatch[2] || '')) n *= 1000;
    if (/lac|lakh/.test(budgetMatch[2] || '')) n *= 100000;
    if (n >= 1000) found.budgetPkr = n;
  }
  if (!found.budgetPkr) {
    const numMatch = t.match(/\b([1-9]\d{3,6})\b/) || t.match(/\b(\d+)\s*k\b/);
    if (numMatch) {
      let n = parseInt(numMatch[1], 10);
      if (/k/.test(numMatch[0])) n *= 1000;
      if (n >= 1000) found.budgetPkr = n;
    }
  }
  Object.entries(MONTH_TO_SEASON).forEach(([m, s]) => { if (new RegExp(`\\b${m}[a-z]*\\b`).test(t)) found.season = s; });
  SEASONS.forEach((s) => { if (t.includes(s.id)) found.season = s.id; });
  if (/\bfall\b/.test(t)) found.season = 'autumn';
  const city = CITIES.find((c) => new RegExp(`\\bfrom ${c.id}\\b`).test(t));
  if (city) found.from = city.id;
  if (/\b(family|kids|children|parents)\b/.test(t)) found.group = 'family';
  else if (/\b(couple|honeymoon|partner|wife|husband)\b/.test(t)) found.group = 'couple';
  else if (/\b(friends|group)\b/.test(t)) found.group = 'friends';
  else if (/\b(solo|alone|myself)\b/.test(t)) found.group = 'solo';
  const groupSize = t.match(/(\d+)\s*(people|persons|travellers|travelers|of us|adults)/);
  if (groupSize) found.groupSize = parseInt(groupSize[1], 10);
  const interests = Object.entries(INTEREST_WORDS).filter(([, words]) => words.some((w) => new RegExp(`\\b${w}\\b`).test(t))).map(([k]) => k);
  if (interests.length) found.interests = interests;
  if (/\b(relaxed|slow|easy|gentle)\b/.test(t)) found.pace = 'easy';
  if (/\b(adventurous|challenging|tough|hard)\b/.test(t)) found.pace = 'challenging';
  // Ignore "from <city>" so a starting city isn't mistaken for a destination.
  const withoutOrigin = t.replace(/\bfrom\s+[a-z]+/g, ' ');
  const mentioned = DESTINATIONS.filter((d) => {
    const names = [d.name, d.id.replace(/-/g, ' '), d.name.split(' ')[0]].map((n) => n.toLowerCase());
    return names.some((n) => n.length > 3 && withoutOrigin.includes(n));
  }).map((d) => d.id);
  if (mentioned.length) found.mentioned = mentioned;
  return found;
}

function buildItinerary(destIds, totalDays, fromCityId) {
  const from = CITIES.find((c) => c.id === fromCityId);
  const days = [];
  const dests = destIds.map(getDestination).filter(Boolean);
  if (!dests.length) return days;
  const farNorth = from && dests.some((d) => d.region === 'gilgit-baltistan' && haversineKm(from, d.coords) > 250);
  let remaining = totalDays;
  if (farNorth && totalDays >= 4) { days.push({ title: `Travel north from ${from.name}`, destinationId: null, detail: 'A long road day or a weather-dependent flight. Break the drive overnight if you can.' }); remaining -= 1; }
  const returnDay = farNorth && totalDays >= 5;
  if (returnDay) remaining -= 1;
  const share = Math.max(1, Math.floor(remaining / dests.length));
  dests.forEach((d, i) => {
    const n = i === dests.length - 1 ? remaining - share * (dests.length - 1) : share;
    for (let k = 0; k < Math.max(1, n); k++) {
      const highlight = d.highlights[k % d.highlights.length];
      days.push({ title: `${d.name}: ${highlight}`, destinationId: d.id, detail: k === 0 ? d.tagline : `Continue exploring — ${d.highlights[(k + 1) % d.highlights.length]}.` });
    }
  });
  if (returnDay) days.push({ title: `Return to ${from.name}`, destinationId: null, detail: 'Leave early and keep a buffer in case of road or flight delays.' });
  return days.slice(0, Math.max(totalDays, 1));
}

function generateConciergeResponse(message, prevPrefs = {}) {
  const parsed = parseConciergeMessage(message);
  // A message with two or more fresh constraints and no named place is a new brief:
  // forget previously named places and interests instead of carrying them over.
  const freshConstraints = ['days', 'budgetPkr', 'season', 'from', 'group'].filter((k) => parsed[k] != null).length;
  const isNewBrief = freshConstraints >= 2 && !parsed.mentioned;
  const base = isNewBrief ? { ...prevPrefs, mentioned: undefined, interests: [] } : prevPrefs;
  const prefs = { ...base, ...parsed, interests: [...new Set([...(base.interests || []), ...(parsed.interests || [])])] };
  const lower = message.toLowerCase();

  // 1. Live / current questions: never invent an answer.
  if (LIVE_PATTERNS.test(message)) {
    const d = parsed.mentioned?.[0] && getDestination(parsed.mentioned[0]);
    return {
      prefs,
      reply: {
        kind: 'live',
        text: `I can’t check live conditions such as weather, road status, flights or availability. ${d ? `For ${d.name}, the usual best time is: ${d.bestMonths}. ` : ''}Please confirm current conditions with local authorities or the tour operator close to your dates.`,
        destinations: d ? [d.id] : [],
        tips: d ? d.prep.slice(0, 2) : [],
        followUps: ['What’s the best season for Hunza?', 'Plan 4 days in Northern Pakistan'],
      },
    };
  }

  // 2. Comparison requests: "compare Hunza and Skardu".
  if (/\b(compare|vs|versus|or)\b/.test(lower) && (parsed.mentioned || []).length >= 2) {
    const [a, b] = parsed.mentioned.slice(0, 2).map(getDestination);
    // A comparison is a one-off question; it shouldn't pin these places into later plans.
    const comparePrefs = { ...prevPrefs, ...parsed, mentioned: prevPrefs.mentioned, interests: prefs.interests };
    const pa = lowestPrice(a.id);
    const pb = lowestPrice(b.id);
    return {
      prefs: comparePrefs,
      reply: {
        kind: 'compare',
        text: `${a.name} and ${b.name} side by side:`,
        comparison: [
          { label: 'Region', a: regionName(a.region), b: regionName(b.region) },
          { label: 'Best time', a: a.bestMonths.split(';')[0], b: b.bestMonths.split(';')[0] },
          { label: 'Suggested stay', a: durationLabel(a.durationDays), b: durationLabel(b.durationDays) },
          { label: 'Effort', a: labelOf(DIFFICULTIES, a.difficulty), b: labelOf(DIFFICULTIES, b.difficulty) },
          { label: 'Sourced tours from', a: pa ? formatPkr(pa) : 'No sourced rate', b: pb ? formatPkr(pb) : 'No sourced rate' },
        ],
        destinations: [a.id, b.id],
        tips: [`${a.name}: ${a.tagline}`, `${b.name}: ${b.tagline}`],
        followUps: [`Plan ${a.durationDays[1]} days in ${a.name}`, `Plan ${b.durationDays[1]} days in ${b.name}`],
      },
    };
  }

  // 3. Not enough to go on yet: ask for the most useful missing constraint.
  const hasSignal = prefs.days || prefs.interests.length || prefs.mentioned?.length || prefs.budgetPkr || prefs.season;
  if (!hasSignal) {
    return {
      prefs,
      reply: {
        kind: 'ask',
        text: 'Happy to help plan. To shape suggestions, tell me roughly how many days you have, when you’re going, where you’ll start from, and what you enjoy — mountains, history, food, quiet valleys?',
        followUps: ['5 days in spring from Lahore', 'A weekend from Islamabad', 'I love culture and food', 'Family trip under PKR 40,000'],
      },
    };
  }

  // Recommend: rank destinations based on preferences and trip parameters
  const days = prefs.days || 5;
  const ranked = rankDestinations({
    vibe: prefs.interests.includes('mountains') ? 'mountains' : prefs.interests.includes('heritage') ? 'history' : prefs.interests.includes('food') ? 'food' : undefined,
    interests: prefs.interests,
    days,
    season: prefs.season || 'any',
    from: prefs.from,
    group: prefs.group,
    effort: prefs.pace,
    budgetPkr: prefs.budgetPkr,
  });
  let ids = prefs.mentioned?.length
    ? [...prefs.mentioned, ...ranked.map((r) => r.destination.id)]
    : ranked.map((r) => r.destination.id);
  if (prefs.budgetPkr) {
    const within = ids.filter((id) => { const p = lowestPrice(id); return p == null || p <= prefs.budgetPkr; });
    if (within.length) ids = within;
  }
  ids = [...new Set(ids)].slice(0, 3);
  let primary = ids.slice(0, days >= 8 ? 2 : 1);
  if (!primary.length) {
    const affordablePackages = TOUR_PACKAGES.filter((p) => p.pricePkr && p.pricePkr <= (prefs.budgetPkr || 45000));
    if (affordablePackages.length) {
      const suggestedDests = [...new Set(affordablePackages.flatMap((p) => p.destinations))].slice(0, 3);
      if (suggestedDests.length) {
        ids = suggestedDests;
        primary = suggestedDests.slice(0, days >= 8 ? 2 : 1);
      }
    }
    if (!primary.length) {
      const fallbackDests = DESTINATIONS.filter((d) => (prefs.group && d.companions.includes(prefs.group)) || d.budget === 'budget').map((d) => d.id).slice(0, 3);
      if (fallbackDests.length) {
        ids = fallbackDests;
        primary = fallbackDests.slice(0, days >= 8 ? 2 : 1);
      }
    }
  }
  if (!primary.length) {
    return {
      prefs,
      reply: {
        kind: 'none',
        text: 'I couldn’t find an exact match for that combination. Try browsing our recommended packages or relaxing constraints.',
        followUps: ['Show packages under PKR 40,000', 'Show me winter trips', 'What can I do in 3 days?', 'Start over'],
      },
    };
  }
  const itinerary = buildItinerary(primary, days, prefs.from);
  const pkgs = primary.flatMap((id) => packagesFor(id)).filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
  const fromName = CITIES.find((c) => c.id === prefs.from)?.name;
  const reasonsById = Object.fromEntries(ranked.map((r) => [r.destination.id, r.reasons]));
  const summaryBits = [`${days} day${days > 1 ? 's' : ''}`, prefs.season && `in ${prefs.season}`, fromName && `from ${fromName}`, prefs.group && `for ${prefs.group === 'solo' ? 'a solo traveller' : prefs.group === 'family' ? 'a family' : prefs.group === 'couple' ? 'a couple' : 'friends'}`].filter(Boolean).join(' ');
  return {
    prefs,
    reply: {
      kind: 'plan',
      text: `Here’s a plan for ${summaryBits}, centred on ${primary.map((id) => getDestination(id).name).join(' and ')}.`,
      destinations: ids,
      reasons: reasonsById,
      itinerary,
      costs: {
        packages: pkgs.map((p) => ({ id: p.id, title: p.title, price: p.pricePkr, basis: p.priceBasis, operator: p.operatorName, duration: p.durationLabel })),
        budgetPkr: prefs.budgetPkr || null,
        note: pkgs.length
          ? 'These are operators’ published starting rates, not quotes. Hotels, transport and food on a self-planned trip vary — add your own estimates in the trip planner.'
          : 'There’s no sourced package rate for this plan yet. Add your own cost estimates in the trip planner.',
      },
      tips: primary.flatMap((id) => getDestination(id).prep.slice(0, 2)),
      followUps: ['Make it more relaxed', 'Add a cultural stop', ids[1] ? `Compare ${getDestination(ids[0]).name} and ${getDestination(ids[1]).name}` : 'Show me winter trips', 'Start over'],
    },
  };
}

// Shared UI Components

// Media helpers
const MEDIA_DESTINATIONS = MEDIA.destinations || {};

// Destination media
function destinationMedia(id) {
  const entry = MEDIA_DESTINATIONS[id];
  const approved = (entry?.images || []).filter((img) => img.approved && img.path);
  const hero = approved.find((img) => img.id === entry?.hero) || approved[0] || null;
  const gallery = hero ? [hero, ...approved.filter((img) => img !== hero)].slice(0, 8) : [];
  return { hero, gallery };
}
const extraMedia = (key) => (MEDIA.extras?.[key]?.approved ? MEDIA.extras[key] : null);
/** Every approved photo, for the credits page. */
const allCreditedMedia = () => [
  ...Object.values(MEDIA.extras || {}).filter((x) => x.approved).map((img) => ({ img, place: 'Site-wide' })),
  ...DESTINATIONS.flatMap((d) => destinationMedia(d.id).gallery.map((img) => ({ img, place: d.name }))),
];
const hasLicenceUrl = (img) => Boolean(img?.licenseUrl);

// Motion tokens
const MOTION = {
  ease: [0.2, 0.75, 0.25, 1],
  fast: 0.16,
  base: 0.28,
  slow: 0.55,
};

// MediaImage component
function MediaImage({ image, alt, className, eager = false, label, sizes }) {
  const [state, setState] = useState(image ? 'loading' : 'missing');
  useEffect(() => { setState(image ? 'loading' : 'missing'); }, [image?.path]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!image || state === 'missing') {
    return (
      <div className={cx('media-img media-img--missing', className)} role={label ? 'img' : undefined} aria-label={label ? `${label} (photo not available)` : undefined}>
        {label && <span className="media-img__label">{label}</span>}
        {import.meta.env.DEV && <span className="media-img__dev">No approved local photo · run npm run photos:fetch</span>}
      </div>
    );
  }
  return (
    <div className={cx('media-img', state === 'loaded' && 'is-loaded', className)}>
      <img
        src={image.path}
        srcSet={image.thumb ? `${image.thumb} 640w, ${image.path} ${image.width || 1600}w` : undefined}
        sizes={image.thumb ? sizes || '(max-width: 768px) 100vw, 50vw' : undefined}
        width={image.width || undefined}
        height={image.height || undefined}
        alt={alt ?? image.alt ?? ''}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setState('loaded')}
        onError={() => {
          if (import.meta.env.DEV) console.warn(`[media] missing file ${image.path}`);
          setState('missing');
        }}
      />
    </div>
  );
}

// Media credit line
function MediaCredit({ image, compact }) {
  if (!image) return null;
  if (image.isGenerated || image.isIllustration) return <span className="media-credit">Digital illustration</span>;
  return (
    <span className={cx('media-credit', compact && 'media-credit--compact')}>
      <span>{image.author}</span>
      {' · '}
      {hasLicenceUrl(image) ? <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{image.license}</a> : <span>{image.license}</span>}
      {image.filePage && <>{' · '}<a href={image.filePage} target="_blank" rel="noopener noreferrer">Source</a></>}
    </span>
  );
}

// Scroll reveal
function Reveal({ children, delay = 0, className, as = 'div', y = 16 }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: MOTION.slow, delay, ease: MOTION.ease }}
    >
      {children}
    </Tag>
  );
}

// Topographic contours
function ContourArt({ className, tone = 'light' }) {
  return (
    <svg className={cx('contour-art', `contour-art--${tone}`, className)} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <path key={i} d={`M-20 ${60 + i * 24} C 80 ${20 + i * 26}, 140 ${120 + i * 18}, 220 ${70 + i * 24} S 360 ${30 + i * 28}, 420 ${80 + i * 22}`} fill="none" />
      ))}
      <circle cx="292" cy="96" r="38" fill="none" />
      <circle cx="292" cy="96" r="22" fill="none" />
      <circle cx="292" cy="96" r="8" fill="none" />
    </svg>
  );
}

/** A destination's hero (default) or nth gallery photo. */
function DestinationImage({ destination, className, eager, index, sizes }) {
  const { hero, gallery } = destinationMedia(destination.id);
  const image = index != null && gallery.length ? gallery[index % gallery.length] : hero;
  return <MediaImage image={image} className={className} eager={eager} label={destination.name} sizes={sizes} />;
}

/** External link helper with security attributes. */
function ExternalA({ href, children, className, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
      <ExternalLink size={14} aria-hidden="true" className="ext-icon" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

function Eyebrow({ children, tone }) {
  return <p className={cx('eyebrow', tone && `eyebrow--${tone}`)}>{children}</p>;
}

function SectionHeading({ eyebrow, title, lead, action, id, tone }) {
  return (
    <Reveal className="section-heading">
      <div>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2 id={id}>{title}</h2>
        {lead && <p className="section-heading__lead">{lead}</p>}
      </div>
      {action}
    </Reveal>
  );
}

function Chip({ children, icon: Icon, tone }) {
  return (
    <span className={cx('chip', tone && `chip--${tone}`)}>
      {Icon && <Icon size={14} aria-hidden="true" />}
      {children}
    </span>
  );
}

function ToggleChip({ pressed, onClick, children, icon: Icon }) {
  return (
    <button type="button" className={cx('toggle-chip', pressed && 'is-on')} aria-pressed={pressed} onClick={onClick}>
      {pressed ? <Check size={14} aria-hidden="true" /> : Icon ? <Icon size={14} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

function EmptyState({ icon: Icon = Compass, title, children, actions, level = 3 }) {
  const Heading = `h${level}`;
  return (
    <div className="empty-state">
      <ContourArt className="empty-state__contours" />
      <span className="empty-state__icon"><Icon size={26} aria-hidden="true" /></span>
      <Heading className="empty-state__title">{title}</Heading>
      {children && <p>{children}</p>}
      {actions && <div className="empty-state__actions">{actions}</div>}
    </div>
  );
}

// Price block
function PriceTag({ pkg, size = 'md' }) {
  if (!Number.isFinite(pkg?.pricePkr)) return null;
  return (
    <div className={cx('price-tag', `price-tag--${size}`)}>
      {pkg.priceQualifier === 'starting-from' && <span className="price-tag__from">From</span>}
      <strong>{formatPkr(pkg.pricePkr)}</strong>
      <span className="price-tag__basis">{PRICE_BASIS_LABEL[pkg.priceBasis]}</span>
    </div>
  );
}

// Dialog system
let scrollLocks = 0;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Modal({ open, onClose, title, children, variant = 'center', className, hideTitle = false, footer }) {
  const panelRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    scrollLocks += 1;
    document.body.classList.add('scroll-locked');
    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector('[data-autofocus]') || panelRef.current?.querySelector(FOCUSABLE);
      (first || panelRef.current)?.focus();
    }, 30);
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      scrollLocks -= 1;
      if (scrollLocks <= 0) { scrollLocks = 0; document.body.classList.remove('scroll-locked'); }
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [open, onClose]);

  const motionByVariant = {
    center: { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 } },
    side: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    sheet: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
    full: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  };
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cx('dialog-root', `dialog-root--${variant}`)}>
          <motion.div className="dialog-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cx('dialog-panel', `dialog-panel--${variant}`, className)}
            {...motionByVariant[variant]}
            transition={{ duration: 0.28, ease: [0.2, 0.75, 0.25, 1] }}
          >
            <div className={cx('dialog-head', hideTitle && 'dialog-head--bare')}>
              <h2 id={titleId} className={cx(hideTitle && 'visually-hidden')}>{title}</h2>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="dialog-body">{children}</div>
            {footer && <div className="dialog-foot">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Explore Pakistan` : 'Explore Pakistan — Discover, plan and prepare';
  }, [title]);
}

// Form field
function Field({ label, error, hint, children, id }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const child = Children.only(children);
  return (
    <div className={cx('field', error && 'has-error')}>
      <label htmlFor={fieldId}>{label}</label>
      {cloneElement(child, {
        id: fieldId,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined,
      })}
      {hint && !error && <p className="field__hint" id={`${fieldId}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${fieldId}-err`}><AlertCircle size={14} aria-hidden="true" /> {error}</p>}
    </div>
  );
}

function NumberInput({ value, onChange, min = 0, step = 1, ...rest }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      className="form-control"
      min={min}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? '' : Math.max(min, toNumber(e.target.value, min)))}
      {...rest}
    />
  );
}

/** Scroll to top on route change (respects anchors). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

// Global Shell & Layout

const DEFAULT_PROFILE = { signedIn: false, name: '', email: '', membership: 'explorer', joinedAt: null };
const DEFAULT_PREFERENCES = { homeCity: 'islamabad', interests: [], pace: 'moderate' };
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// App state provider
function AppProvider({ children }) {
  const [favoritesRaw, setFavorites] = usePersistentState('favorites', [], isStringArray);
  const [collections, setCollections] = usePersistentState('collections', [], validCollections);
  const [trips, setTrips] = usePersistentState('trips', [], validTrips);
  const [comparisonRaw, setComparison] = usePersistentState('comparison', [], (v) => isStringArray(v) && v.length <= 3);
  const [visitedRaw, setVisited] = usePersistentState('visited', [], isStringArray);
  const [recentRaw, setRecent] = usePersistentState('recent', [], isStringArray);
  const [profile, setProfile] = usePersistentState('profile', DEFAULT_PROFILE, (v) => isObject(v) && typeof v.membership === 'string');
  const [preferences, setPreferences] = usePersistentState('preferences', DEFAULT_PREFERENCES, isObject);
  const [packing, setPacking] = usePersistentState('packing', null, (v) => v === null || (isObject(v) && Array.isArray(v.items)));
  const [storyBookmarks, setStoryBookmarks] = usePersistentState('stories', [], isStringArray);
  const [toasts, setToasts] = useState([]);
  const [conversation, setConversation] = useState({ messages: [], prefs: {} });
  const [tripPicker, setTripPicker] = useState(null);
  const [collectionPicker, setCollectionPicker] = useState(null);
  const [conciergeOpen, setConciergeOpen] = useState(false);

  // Drop IDs that no longer exist in the catalogue (treat storage as untrusted).
  const known = (ids) => ids.filter((id) => getDestination(id));
  const favorites = useMemo(() => known(favoritesRaw), [favoritesRaw]);
  const comparison = useMemo(() => known(comparisonRaw), [comparisonRaw]);
  const visited = useMemo(() => known(visitedRaw), [visitedRaw]);
  const recent = useMemo(() => known(recentRaw), [recentRaw]);
  // Paid-plan benefits apply only while a local profile is signed in.
  const plan = getPlan(profile.signedIn ? profile.membership : 'explorer');

  const notify = useCallback((text, opts = {}) => {
    const id = uid('toast');
    setToasts((t) => [...t.slice(-2), { id, text, ...opts }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 4200);
  }, []);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // Toggles read the current state, update it, then notify (no side effects inside updaters).
  const toggleFavorite = useCallback((id) => {
    const d = getDestination(id);
    const on = favoritesRaw.includes(id);
    setFavorites((prev) => (on ? prev.filter((x) => x !== id) : [...prev.filter((x) => x !== id), id]));
    notify(on ? `Removed ${d.name} from favourites` : `Saved ${d.name} to favourites`, on ? {} : { action: { label: 'View saved', to: '/saved' } });
  }, [favoritesRaw, setFavorites, notify]);

  const toggleCompare = useCallback((id) => {
    const d = getDestination(id);
    if (comparisonRaw.includes(id)) {
      setComparison((prev) => prev.filter((x) => x !== id));
      notify(`Removed ${d.name} from comparison`);
    } else if (comparisonRaw.length >= 3) {
      notify('You can compare up to 3 places. Remove one to add another.', { tone: 'warn', action: { label: 'Open comparison', to: '/compare' } });
    } else {
      setComparison((prev) => [...prev.filter((x) => x !== id), id].slice(0, 3));
      notify(`Added ${d.name} to comparison`, { action: { label: 'Compare now', to: '/compare' } });
    }
  }, [comparisonRaw, setComparison, notify]);

  const toggleVisited = useCallback((id) => {
    const d = getDestination(id);
    const on = visitedRaw.includes(id);
    setVisited((prev) => (on ? prev.filter((x) => x !== id) : [...prev.filter((x) => x !== id), id]));
    notify(on ? `${d.name} unmarked as visited` : `Stamped ${d.name} in your passport`, on ? {} : { action: { label: 'View passport', to: '/saved#passport' } });
  }, [visitedRaw, setVisited, notify]);

  const recordView = useCallback((id) => setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)), [setRecent]);

  // Trip actions
  const canCreateTrip = trips.length < plan.limits.trips;
  const createTrip = useCallback((overrides = {}) => {
    if (trips.length >= plan.limits.trips) {
      notify(`${plan.name} includes up to ${plan.limits.trips} trip plans. Delete one or upgrade for unlimited plans.`, { tone: 'warn', action: { label: 'See plans', to: '/membership' } });
      return null;
    }
    const trip = newTrip(overrides);
    setTrips((prev) => [trip, ...prev]);
    return trip;
  }, [trips.length, plan, setTrips, notify]);
  const updateTrip = useCallback((id, updater) => setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...(typeof updater === 'function' ? updater(t) : updater) } : t))), [setTrips]);
  const deleteTrip = useCallback((id) => setTrips((prev) => prev.filter((t) => t.id !== id)), [setTrips]);
  const duplicateTrip = useCallback((id) => {
    const src = trips.find((t) => t.id === id);
    if (!src) return null;
    return createTrip({
      ...JSON.parse(JSON.stringify(src)),
      id: uid('trip'),
      name: `${src.name} (copy)`,
      days: src.days.map((d) => ({ ...d, id: uid('day'), stops: d.stops.map((s) => ({ ...s, id: uid('stop') })) })),
      createdAt: new Date().toISOString(),
    });
  }, [trips, createTrip]);
  const addStops = useCallback((tripId, dayIndex, destinationIds) => {
    updateTrip(tripId, (t) => {
      const days = t.days.length ? [...t.days] : [newDay()];
      const idx = Math.min(Math.max(0, dayIndex), days.length - 1);
      days[idx] = { ...days[idx], stops: [...days[idx].stops, ...destinationIds.map((destinationId) => ({ id: uid('stop'), destinationId, note: '' }))] };
      return { days };
    });
  }, [updateTrip]);
  const requestAddToTrip = useCallback((destinationIds) => setTripPicker({ destinationIds: [].concat(destinationIds) }), []);

  /* Collections */
  const createCollection = useCallback((name, destinationIds = []) => {
    if (collections.length >= plan.limits.collections) {
      notify(`${plan.name} includes up to ${plan.limits.collections} collections. Upgrade for unlimited collections.`, { tone: 'warn', action: { label: 'See plans', to: '/membership' } });
      return null;
    }
    const col = { id: uid('col'), name: name.trim() || 'New collection', destinationIds };
    setCollections((prev) => [...prev, col]);
    return col;
  }, [collections.length, plan, setCollections, notify]);
  const renameCollection = useCallback((id, name) => setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c))), [setCollections]);
  const deleteCollection = useCallback((id) => setCollections((prev) => prev.filter((c) => c.id !== id)), [setCollections]);
  const toggleInCollection = useCallback((colId, destId) => setCollections((prev) => prev.map((c) => (c.id !== colId ? c : {
    ...c, destinationIds: c.destinationIds.includes(destId) ? c.destinationIds.filter((x) => x !== destId) : [...c.destinationIds, destId],
  }))), [setCollections]);

  const toggleStoryBookmark = useCallback((id) => {
    const on = storyBookmarks.includes(id);
    setStoryBookmarks((prev) => (on ? prev.filter((x) => x !== id) : [...prev.filter((x) => x !== id), id]));
    notify(on ? 'Story removed from your reading list' : 'Story saved to your reading list', on ? {} : { action: { label: 'View saved', to: '/saved' } });
  }, [storyBookmarks, setStoryBookmarks, notify]);

  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const ambientAudioRef = useRef(null);
  const toggleAmbient = useCallback(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio(HERO_MEDIA.audio || '/audio/nature-peaceful.m4a');
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.7;
    }
    if (ambientPlaying) {
      ambientAudioRef.current.pause();
      setAmbientPlaying(false);
    } else {
      ambientAudioRef.current.play().then(() => setAmbientPlaying(true)).catch(() => setAmbientPlaying(false));
    }
  }, [ambientPlaying]);

  useEffect(() => {
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
    };
  }, []);

  const value = {
    favorites, toggleFavorite, comparison, toggleCompare, setComparison, visited, toggleVisited, recent, recordView,
    trips, canCreateTrip, createTrip, updateTrip, deleteTrip, duplicateTrip, addStops, requestAddToTrip,
    collections, createCollection, renameCollection, deleteCollection, toggleInCollection, setCollectionPicker,
    profile, setProfile, preferences, setPreferences, plan, packing, setPacking, storyBookmarks, toggleStoryBookmark,
    conversation, setConversation, conciergeOpen, setConciergeOpen, ambientPlaying, toggleAmbient, notify, storageAvailable: storage.available,
  };
  return (
    <AppContext.Provider value={value}>
      {children}
      <TripPickerDialog picker={tripPicker} onClose={() => setTripPicker(null)} />
      <CollectionPickerDialog destinationId={collectionPicker} onClose={() => setCollectionPicker(null)} />
      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
}

function ToastRegion({ toasts, onDismiss }) {
  const navigate = useNavigate();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className={cx('toast-card', t.tone && `toast-card--${t.tone}`)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}>
            {t.tone === 'warn' ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
            <span>{t.text}</span>
            {t.action && <button type="button" className="toast-card__action" onClick={() => { onDismiss(t.id); navigate(t.action.to); }}>{t.action.label}</button>}
            <button type="button" className="icon-btn icon-btn--sm" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification"><X size={16} aria-hidden="true" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Trip picker
function TripPickerDialog({ picker, onClose }) {
  const { trips, createTrip, addStops, notify } = useApp();
  const navigate = useNavigate();
  const [tripId, setTripId] = useState('');
  const [dayIndex, setDayIndex] = useState(0);
  useEffect(() => { if (picker) { setTripId(trips[0]?.id || ''); setDayIndex(0); } }, [picker]); // eslint-disable-line react-hooks/exhaustive-deps
  const names = (picker?.destinationIds || []).map((id) => getDestination(id)?.name).filter(Boolean).join(', ');
  const trip = trips.find((t) => t.id === tripId);

  const confirm = () => {
    if (!trip) return;
    addStops(trip.id, dayIndex, picker.destinationIds);
    notify(`Added ${names} to ${trip.name}, day ${dayIndex + 1}`, { action: { label: 'Open trip', to: `/plan/${trip.id}` } });
    onClose();
  };
  const startNew = () => {
    const ids = picker.destinationIds;
    const first = getDestination(ids[0]);
    const created = createTrip({
      name: ids.length === 1 ? `${first.name} trip` : 'My Pakistan trip',
      days: Array.from({ length: Math.max(ids.length, first?.durationDays[0] || 3) }, (_, i) => ({ id: uid('day'), notes: '', stops: ids[i] ? [{ id: uid('stop'), destinationId: ids[i], note: '' }] : [] })),
    });
    if (created) { notify(`Created “${created.name}”`); onClose(); navigate(`/plan/${created.id}`); }
  };

  return (
    <Modal open={Boolean(picker)} onClose={onClose} title="Add to a trip" footer={
      <>
        <button type="button" className="btn btn-ghost" onClick={startNew}><Plus size={16} aria-hidden="true" /> Start a new trip</button>
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={!trip}>Add to trip</button>
      </>
    }>
      <p className="muted">Adding <strong>{names}</strong>.</p>
      {trips.length ? (
        <div className="row g-3">
          <div className="col-sm-7">
            <Field label="Trip">
              <select className="form-select" value={tripId} onChange={(e) => { setTripId(e.target.value); setDayIndex(0); }} data-autofocus>
                {trips.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
          </div>
          <div className="col-sm-5">
            <Field label="Day">
              <select className="form-select" value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))}>
                {(trip?.days || []).map((d, i) => <option key={d.id} value={i}>Day {i + 1}</option>)}
              </select>
            </Field>
          </div>
        </div>
      ) : (
        <p>You don’t have any trips yet. Start one with this place and keep adding as you explore.</p>
      )}
    </Modal>
  );
}

function CollectionPickerDialog({ destinationId, onClose }) {
  const { collections, toggleInCollection, createCollection, notify } = useApp();
  const [name, setName] = useState('');
  const d = destinationId && getDestination(destinationId);
  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const col = createCollection(name, [destinationId]);
    if (col) { notify(`Created “${col.name}” with ${d.name}`); setName(''); }
  };
  return (
    <Modal open={Boolean(d)} onClose={onClose} title={d ? `Save ${d.name} to a collection` : 'Save to a collection'}>
      {collections.length > 0 && (
        <ul className="check-list">
          {collections.map((c) => (
            <li key={c.id}>
              <label className="check-row">
                <input type="checkbox" className="form-check-input" checked={c.destinationIds.includes(destinationId)} onChange={() => toggleInCollection(c.id, destinationId)} />
                <span>{c.name}</span>
                <span className="muted small ms-auto">{c.destinationIds.length} places</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={create} className="inline-form">
        <Field label="New collection name">
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spring 2027 ideas" maxLength={60} data-autofocus={!collections.length || undefined} />
        </Field>
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Create</button>
      </form>
    </Modal>
  );
}

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/map', label: 'Map' },
  { to: '/stories', label: 'Stories' },
  { to: '/membership', label: 'Membership' },
  { to: '/contact', label: 'Contact' },
];

// WhatsAppMark defined above

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

function Wordmark() {
  return (
    <Link to="/" className="wordmark" aria-label="Explore Pakistan home">
      <svg viewBox="0 0 40 28" width="34" height="24" aria-hidden="true" focusable="false">
        <path d="M2 26 14 6l7 11 4-6 13 15Z" fill="currentColor" opacity=".9" />
        <circle cx="31" cy="6" r="3.2" className="wordmark__sun" />
      </svg>
      <span>Explore <em>Pakistan</em></span>
    </Link>
  );
}

function SiteHeader({ onSearch }) {
  const { pathname } = useLocation();
  const { profile, comparison, ambientPlaying, toggleAmbient } = useApp();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const overHero = pathname === '/' && !scrolled;
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <header className={cx('site-header', overHero ? 'site-header--over' : 'site-header--solid')}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="site-header__inner">
        <Wordmark />
        <nav className="site-nav" aria-label="Main">
          {NAV_LINKS.map((l) => <NavLink key={l.to} to={l.to} className="site-nav__link">{l.label}</NavLink>)}
        </nav>
        <div className="site-header__actions">
          <button type="button" className="icon-btn" onClick={onSearch} aria-label="Search destinations and stories" title="Search ( / )"><Search size={20} aria-hidden="true" /></button>
          {comparison.length > 0 && (
            <Link to="/compare" className="icon-btn icon-btn--badge d-none d-md-inline-flex" aria-label={`Compare ${comparison.length} places`}>
              <Scale size={20} aria-hidden="true" /><span className="badge-dot">{comparison.length}</span>
            </Link>
          )}
          <Link to="/account" className="icon-btn d-none d-md-inline-flex" aria-label={profile.signedIn ? `Account: ${profile.name}` : 'Sign in or create a profile'}>
            {profile.signedIn ? <span className="avatar-initial">{(profile.name || '?').slice(0, 1).toUpperCase()}</span> : <User size={20} aria-hidden="true" />}
          </Link>
          <button
            type="button"
            className={cx('icon-btn', 'site-header__sound-btn', ambientPlaying && 'is-playing')}
            onClick={toggleAmbient}
            aria-label={ambientPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
            title={ambientPlaying ? 'Mute sound' : 'Play sound'}
          >
            {ambientPlaying ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
            {ambientPlaying && <span className="sound-pulse-dot" aria-hidden="true" />}
          </button>
          <Link to="/plan" className="btn btn-accent d-none d-lg-inline-flex">Plan a trip</Link>
          <button type="button" className="icon-btn d-lg-none" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}><Menu size={22} aria-hidden="true" /></button>
        </div>
      </div>
      <Modal open={menuOpen} onClose={closeMenu} title="Menu" variant="side" className="mobile-menu">
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {[{ to: '/', label: 'Home' }, ...NAV_LINKS, { to: '/plan', label: 'Plan a trip' }, { to: '/concierge', label: 'Travel concierge' }, { to: '/quiz', label: 'Quiz me' }, { to: '/saved', label: 'Saved & passport' }, { to: '/toolkit', label: 'Travel toolkit' }, { to: '/compare', label: `Compare${comparison.length ? ` (${comparison.length})` : ''}` }, { to: '/account', label: profile.signedIn ? 'Your account' : 'Sign in' }].map((l) => (
              <li key={l.to}><NavLink to={l.to} end={l.to === '/'} onClick={closeMenu}>{l.label}<ChevronRight size={18} aria-hidden="true" /></NavLink></li>
            ))}
          </ul>
        </nav>
        <ContourArt className="mobile-menu__contours" />
      </Modal>
    </header>
  );
}

// Search dialog
function SearchDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open]);
  const results = useMemo(() => buildSearchResults(query), [query]);
  const suggestions = [
    ...['hunza', 'lahore', 'fairy-meadows', 'makli-thatta'].map((id) => ({ type: 'Popular', id, label: getDestination(id).name, sub: regionName(getDestination(id).region), to: `/destinations/${id}` })),
    { type: 'Category', id: 'hidden', label: 'Hidden gems', sub: 'Lesser-known places', to: '/explore?hidden=1' },
    { type: 'Category', id: 'heritage', label: 'Heritage', sub: 'Forts, mosques and ancient cities', to: '/explore?category=heritage' },
  ];
  const items = query.trim() ? results : suggestions;
  const go = (item) => { onClose(); navigate(item.to); };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[active]) go(items[active]);
      else if (query.trim()) { onClose(); navigate(`/explore?q=${encodeURIComponent(query.trim())}`); }
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Search" variant="full" className="search-dialog" hideTitle>
      <div className="search-dialog__box">
        <Search size={22} aria-hidden="true" />
        <input
          data-autofocus
          type="search"
          className="search-dialog__input"
          placeholder="Search places, regions, activities or stories"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={items.length > 0}
          aria-controls={listId}
          aria-activedescendant={items[active] ? `${listId}-${active}` : undefined}
          aria-label="Search"
        />
      </div>
      <p className="search-dialog__meta">{query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Try “lake”, “heritage” or “Sindh”'}</p>
      <ul className="search-results" id={listId} role="listbox" aria-label="Search results">
        {items.map((item, i) => (
          <li key={`${item.type}-${item.id}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
            <button type="button" className={cx('search-result', i === active && 'is-active')} onMouseEnter={() => setActive(i)} onClick={() => go(item)} tabIndex={-1}>
              <span className="search-result__type">{item.type}</span>
              <span className="search-result__label">{item.label}</span>
              <span className="search-result__sub">{item.sub}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      {query.trim() && !results.length && (
        <EmptyState icon={Search} title="Nothing matches that yet" actions={<Link className="btn btn-primary" to="/explore" onClick={onClose}>Browse all places</Link>}>
          Try a region such as “Punjab”, an activity like “trekking”, or a broader word.
        </EmptyState>
      )}
    </Modal>
  );
}

// Footer observer
function useFooterInView() {
  const [inView, setInView] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const footer = document.querySelector('.site-footer');
    if (!footer || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '0px 0px -40px 0px', threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);
  return inView;
}

function ConciergeLauncher({ tucked }) {
  const { pathname } = useLocation();
  const { conciergeOpen, setConciergeOpen } = useApp();
  // Hidden on the concierge page itself and on form-focused pages, where it would cover fields on phones.
  if (['/concierge', '/account', '/contact'].some((p) => pathname.startsWith(p))) return null;
  return (
    <>
      <button type="button" className={cx('concierge-launcher', tucked && 'is-tucked')} onClick={() => setConciergeOpen(true)} aria-label="Open the travel concierge" tabIndex={tucked ? -1 : 0} aria-hidden={tucked || undefined}>
        <Compass size={22} aria-hidden="true" />
        <span className="concierge-launcher__tip" aria-hidden="true">Ask the concierge</span>
      </button>
      <Modal open={conciergeOpen} onClose={() => setConciergeOpen(false)} title="Travel concierge" variant="side" className="concierge-drawer">
        <ConciergeChat compact onNavigate={() => setConciergeOpen(false)} />
      </Modal>
    </>
  );
}

function CompareTray({ tucked }) {
  const { comparison } = useApp();
  const { pathname } = useLocation();
  if (!comparison.length || pathname === '/compare') return null;
  return (
    <Link to="/compare" className={cx('compare-tray', tucked && 'is-tucked')} tabIndex={tucked ? -1 : undefined} aria-hidden={tucked || undefined}>
      <Scale size={18} aria-hidden="true" />
      <span>Compare <strong>{comparison.length}</strong>/3</span>
      <span className="compare-tray__thumbs" aria-hidden="true">
        {comparison.map((id) => <DestinationImage key={id} destination={getDestination(id)} className="compare-tray__thumb" />)}
      </span>
    </Link>
  );
}

function FloatingWhatsApp({ tucked }) {
  const { pathname } = useLocation();
  if (['/concierge'].some((p) => pathname.startsWith(p))) return null;
  return (
    <a
      href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Explore Pakistan! I would like to inquire about planning a trip.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cx('whatsapp-float', tucked && 'is-tucked')}
      aria-label="Chat with Explore Pakistan on WhatsApp (0313 7813498)"
      title={`WhatsApp: ${CONTACT_WHATSAPP_DISPLAY}`}
    >
      <WhatsAppMark size={24} />
      <span className="whatsapp-float__tip" aria-hidden="true">WhatsApp: ${CONTACT_WHATSAPP_DISPLAY}</span>
    </a>
  );
}

function SiteFooter() {
  const whatsappHref = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Explore Pakistan! I would like to inquire about planning a trip.')}`;
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Explore Pakistan Inquiry')}`;

  return (
    <footer className="site-footer">
      <ContourArt className="site-footer__contours" tone="dark" />
      <div className="container-wide">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-4">
            <Wordmark />
            <p className="site-footer__lead">A travel guide and planner for Pakistan — from the Karakoram to the Makran coast.</p>
            <p className="site-footer__note">Package prices are operators’ published starting rates, checked {formatDate(PRICE_SNAPSHOT_DATE)}. Always confirm the final price and availability with the operator.</p>
            <div className="site-footer__contact-direct">
              <span className="site-footer__contact-label">Explore Pakistan Support:</span>
              <div className="site-footer__contact-links">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="site-footer__contact-pill site-footer__contact-pill--whatsapp" title={`WhatsApp: ${CONTACT_WHATSAPP_DISPLAY}`}>
                  <WhatsAppMark size={16} /> <span>${CONTACT_WHATSAPP_DISPLAY}</span>
                </a>
                <a href={mailtoHref} className="site-footer__contact-pill site-footer__contact-pill--email" title={`Email: ${CONTACT_EMAIL}`}>
                  <Mail size={16} /> <span>${CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <h3>Discover</h3>
            <ul>
              <li><Link to="/explore">All destinations</Link></li>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/stories">Stories</Link></li>
              <li><Link to="/quiz">Quiz me</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <h3>Plan</h3>
            <ul>
              <li><Link to="/plan">Trip planner</Link></li>
              <li><Link to="/concierge">Travel concierge</Link></li>
              <li><Link to="/toolkit">Budget & packing</Link></li>
              <li><Link to="/packages">Tour rates</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <h3>You</h3>
            <ul>
              <li><Link to="/saved">Saved & passport</Link></li>
              <li><Link to="/compare">Compare</Link></li>
              <li><Link to="/membership">Membership</Link></li>
              <li><Link to="/account">Account</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <h3>Contact Us</h3>
            <ul>
              <li><Link to="/contact">Contact form</Link></li>
              <li><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="footer-contact-link"><WhatsAppMark size={15} /> WhatsApp</a></li>
              <li><a href={mailtoHref} className="footer-contact-link"><Mail size={15} /> Email</a></li>
              <li><Link to="/about">About & travel</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__base">
          <span>© {new Date().getFullYear()} Explore Pakistan</span>
          <div className="site-footer__base-links">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="footer-contact-link"><WhatsAppMark size={14} /> ${CONTACT_WHATSAPP_DISPLAY}</a>
            <span aria-hidden="true">•</span>
            <a href={mailtoHref} className="footer-contact-link"><Mail size={14} /> ${CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Layout: header, routed page, footer, and global floating UI. */
function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const footerInView = useFooterInView();
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (e.key === '/' && !['input', 'textarea', 'select'].includes(tag) && !e.target.isContentEditable) { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <ScrollToTop />
      <SiteHeader onSearch={() => setSearchOpen(true)} />
      <main id="main" tabIndex={-1}>
        {/* Each route fades in with a short rise; no exit animation, so an outgoing page never blocks clicks. */}
        <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: MOTION.base, ease: MOTION.ease }}>
          {children}
        </motion.div>
      </main>
      <SiteFooter />
      <CompareTray tucked={footerInView} />
      <FloatingWhatsApp tucked={footerInView} />
      <ConciergeLauncher tucked={footerInView} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}

// Home & Discovery Views

// Destination card
function DestinationCard({ destination: d, variant = 'grid', index, eager, extra }) {
  const { favorites, toggleFavorite, comparison, toggleCompare, requestAddToTrip, visited } = useApp();
  const fav = favorites.includes(d.id);
  const inCompare = comparison.includes(d.id);
  const price = lowestPrice(d.id);
  return (
    <article className={cx('dest-card', `dest-card--${variant}`)}>
      <div className="dest-card__media">
        <DestinationImage destination={d} eager={eager} />
        {index != null && <span className="dest-card__index" aria-hidden="true">{String(index).padStart(2, '0')}</span>}
        {d.hiddenGem && <span className="dest-card__flag"><Gem size={13} aria-hidden="true" /> Hidden gem</span>}
        {visited.includes(d.id) && <span className="dest-card__stamp" title="Visited"><BadgeCheck size={14} aria-hidden="true" /> Visited</span>}
      </div>
      <div className="dest-card__body">
        <p className="dest-card__meta">{regionName(d.region)} <span aria-hidden="true">/</span> <span className="coord">{formatCoords(d.coords)}</span></p>
        <h3 className="dest-card__title"><Link to={`/destinations/${d.id}`} className="stretched">{d.name}</Link></h3>
        <p className="dest-card__tagline">{d.tagline}</p>
        <div className="dest-card__chips">
          <Chip icon={Calendar}>{d.seasons.map((s) => labelOf(SEASONS, s)).join(', ')}</Chip>
          <Chip icon={Clock}>{durationLabel(d.durationDays)}</Chip>
        </div>
        {extra}
        <div className="dest-card__foot">
          {price != null ? (
            <p className="dest-card__price"><span>Tours from</span> <strong>{formatPkr(price)}</strong></p>
          ) : (
            <p className="dest-card__price dest-card__price--none">Self-planned</p>
          )}
          <div className="dest-card__actions">
            <button type="button" className={cx('icon-btn icon-btn--card', fav && 'is-on')} aria-pressed={fav} aria-label={fav ? `Remove ${d.name} from favourites` : `Save ${d.name} to favourites`} onClick={() => toggleFavorite(d.id)}>
              <Heart size={18} aria-hidden="true" fill={fav ? 'currentColor' : 'none'} />
            </button>
            <button type="button" className={cx('icon-btn icon-btn--card', inCompare && 'is-on')} aria-pressed={inCompare} aria-label={inCompare ? `Remove ${d.name} from comparison` : `Compare ${d.name}`} onClick={() => toggleCompare(d.id)}>
              <Scale size={18} aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn icon-btn--card" aria-label={`Add ${d.name} to a trip`} onClick={() => requestAddToTrip(d.id)}>
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Package card with a source disclosure drawer. */
function PackageCard({ pkg, compact }) {
  const { plan } = useApp();
  const [open, setOpen] = useState(false);
  const member = memberPrice(pkg, plan.id);
  const dests = pkg.destinationIds.map(getDestination).filter(Boolean);
  return (
    <article className={cx('pkg-card', compact && 'pkg-card--compact')}>
      <div className="pkg-card__top">
        <p className="pkg-card__operator">{pkg.operatorName}</p>
        <h3 className="pkg-card__title">{pkg.title}</h3>
        <p className="pkg-card__dests">{dests.map((d, i) => <Fragment key={d.id}>{i > 0 && ' + '}<Link to={`/destinations/${d.id}`}>{d.name}</Link></Fragment>)}</p>
      </div>
      <PriceTag pkg={pkg} />
      {member && (
        <p className="pkg-card__member"><Crown size={14} aria-hidden="true" /> {member.plan.name}: <s>{formatPkr(member.base)}</s> <strong>{formatPkr(member.price)}</strong> <span className="muted">(proposed member saving)</span></p>
      )}
      <dl className="pkg-card__facts">
        <div><dt><Clock size={14} aria-hidden="true" /> Duration</dt><dd>{pkg.durationLabel}</dd></div>
        <div><dt><Navigation size={14} aria-hidden="true" /> Departure</dt><dd>{pkg.departureContext}</dd></div>
      </dl>
      <p className="pkg-card__checked">Rate checked {formatDate(pkg.sourceCheckedAt)}. Confirm dates and availability with the operator.</p>
      <div className="pkg-card__actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}><Info size={16} aria-hidden="true" /> Price details</button>
        <ExternalA href={pkg.sourceUrl} className="btn btn-primary btn-sm">View operator details</ExternalA>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Price source and details" variant="side">
        <PackageDetails pkg={pkg} />
      </Modal>
    </article>
  );
}

function PackageDetails({ pkg }) {
  const { plan } = useApp();
  const member = memberPrice(pkg, plan.id);
  const eligible = pkg.membershipEligibility.map((id) => getPlan(id).name);
  return (
    <div className="pkg-details">
      <p className="eyebrow">{pkg.operatorName}</p>
      <h3>{pkg.title}</h3>
      <PriceTag pkg={pkg} size="lg" />
      <dl className="detail-list">
        <div><dt>Price type</dt><dd>{pkg.priceQualifier === 'starting-from' ? 'Advertised starting rate' : pkg.priceQualifier === 'fixed-published-rate' ? 'Published rate for the stated option' : 'Quote required'}</dd></div>
        <div><dt>Price basis</dt><dd>{PRICE_BASIS_LABEL[pkg.priceBasis]}</dd></div>
        <div><dt>Duration</dt><dd>{pkg.durationLabel}</dd></div>
        <div><dt>Departure</dt><dd>{pkg.departureContext}</dd></div>
        <div><dt>Source</dt><dd><ExternalA href={pkg.sourceUrl}>{pkg.sourceUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</ExternalA></dd></div>
        <div><dt>Checked</dt><dd>{formatDate(pkg.sourceCheckedAt)}</dd></div>
        <div><dt>Inclusions</dt><dd>{pkg.inclusions.length ? pkg.inclusions.join(', ') : 'Not listed with the rate — see the operator page.'}</dd></div>
        <div><dt>Exclusions</dt><dd>{pkg.exclusions.length ? pkg.exclusions.join(', ') : 'Not listed with the rate — ask the operator.'}</dd></div>
      </dl>
      <h4>Before you rely on this price</h4>
      <ul className="tick-list">{pkg.caveats.map((c) => <li key={c}>{c}</li>)}</ul>
      <div className="callout">
        <Crown size={18} aria-hidden="true" />
        <div>
          <strong>Membership</strong>
          {eligible.length ? (
            <p>Under Explore Pakistan’s proposed membership terms, {eligible.join(' and ')} members would receive a saving on this starting rate.{member ? ` For your ${member.plan.name} plan: ${formatPkr(member.base)} − ${Math.round(member.rate * 100)}% (${formatPkr(member.discount)}) = ${formatPkr(member.price)}.` : ''} This is our programme, not an operator discount.</p>
          ) : <p>This package is not part of the proposed member savings.</p>}
        </div>
      </div>
      <div className="d-flex gap-2 flex-wrap mt-3">
        <ExternalA href={pkg.sourceUrl} className="btn btn-primary">View operator details</ExternalA>
        <Link to={`/plan?from=${pkg.destinationIds.join(',')}`} className="btn btn-ghost">Plan a similar trip</Link>
      </div>
    </div>
  );
}

// Hero media
function HeroMedia() {
  const reduce = useReducedMotion();
  const [videoOk, setVideoOk] = useState(false);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 90]);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const saveData = navigator.connection?.saveData;
    setVideoOk(Boolean(HERO_MEDIA.video) && wide && !saveData && !reduce);
  }, [reduce]);
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  return (
    <div className="hero__media">
      <motion.div className="hero__parallax" style={{ y }}>
        {HERO_MEDIA.poster && <img src={HERO_MEDIA.poster} alt={HERO_MEDIA.posterAlt} className="hero__poster" fetchpriority="high" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
        {videoOk && <video ref={videoRef} className="hero__video" src={HERO_MEDIA.video} poster={HERO_MEDIA.poster || undefined} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setVideoOk(false)} />}
      </motion.div>
      {videoOk && (
        <button type="button" className="hero__video-toggle" onClick={toggle} aria-label={playing ? 'Pause background video' : 'Play background video'}>
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
      )}
      <ContourArt className="hero__contours" tone="dark" />
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  const { setConciergeOpen } = useApp();
  const [q, setQ] = useState('');
  const scrolled = useScrolled(80);
  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : '/explore');
  };
  const quick = [
    { label: 'Hunza in spring', to: '/destinations/hunza' },
    { label: 'Lahore food', to: '/stories/lahore-walled-city-after-dark' },
    { label: 'Hidden gems', to: '/explore?hidden=1' },
    { label: 'Winter in Sindh', to: '/explore?region=sindh&season=winter' },
  ];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroMedia />
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__content container-wide">
        <motion.p className="hero__coords" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <MapPin size={14} aria-hidden="true" /> Hunza Valley, Gilgit-Baltistan <span className="coord">{HERO_MEDIA.coords}</span>
        </motion.p>
        <motion.h1 id="hero-title" className="hero__title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.2, 0.75, 0.25, 1] }}>
          Pakistan, beyond the expected.
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.55 }}>
          <p className="hero__lead">Glacial lakes, Mughal cities, desert forts and an empty coastline. Find the right place, see what tours really cost, and plan the journey.</p>
          <form className="hero-search" role="search" onSubmit={submit}>
            <label htmlFor="hero-q" className="visually-hidden">Search destinations</label>
            <Search size={20} aria-hidden="true" />
            <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Where to? Try “lakes” or “Lahore”" autoComplete="off" />
            <button type="submit" className="btn btn-accent">Explore</button>
          </form>
          <ul className="hero__quick" aria-label="Popular searches">
            {quick.map((x) => <li key={x.label}><Link to={x.to}>{x.label}</Link></li>)}
          </ul>
          <div className="hero__ctas">
            <Link to="/explore" className="btn btn-light-solid">Explore destinations</Link>
            <button type="button" className="btn btn-outline-light-soft" onClick={() => setConciergeOpen(true)}><Compass size={16} aria-hidden="true" /> Plan with the concierge</button>
          </div>
        </motion.div>
      </div>
      <a href="#featured" className={cx('hero__scroll', scrolled && 'is-hidden')} aria-label="Scroll to featured destinations">
        <ArrowDown size={18} aria-hidden="true" />
      </a>
      <Link to="/credits" className="hero__credit">Image credits</Link>
    </section>
  );
}

// Schematic dot map
function SchematicMap({ highlight }) {
  const bounds = { minLat: 24, maxLat: 37, minLng: 61, maxLng: 77.5 };
  const pos = ({ lat, lng }) => ({
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100,
    y: ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100,
  });
  return (
    <div className="schematic-map">
      <ContourArt className="schematic-map__contours" tone="dark" />
      {DESTINATIONS.map((d) => {
        const p = pos(d.coords);
        return (
          <Link key={d.id} to={`/destinations/${d.id}`} className={cx('schematic-map__dot', highlight === d.id && 'is-on')} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <span className="visually-hidden">{d.name}</span>
            <span className="schematic-map__label" aria-hidden="true">{d.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

function HomePage() {
  useDocumentTitle('');
  const featured = ['hunza', 'fairy-meadows', 'lahore', 'makli-thatta', 'deosai'].map(getDestination);
  const [season, setSeason] = useState('autumn');
  const homePackages = ['tt-hunza', 'tt-skardu', 'tt-naran', 'ptt-lahore'].map(getPackage);
  const homeStories = [STORIES[0], STORIES[2], STORIES[5]];
  return (
    <>
      <Hero />

      <section className="value-line container-wide" aria-label="What Explore Pakistan offers">
        <p><Compass size={18} aria-hidden="true" /> {DESTINATIONS.length} curated guides across all {REGIONS.length} provinces and territories</p>
        <p><Receipt size={18} aria-hidden="true" /> Tour rates linked to the operator’s own page</p>
        <p><Bookmark size={18} aria-hidden="true" /> Trips and saved places kept in your browser</p>
      </section>

      <section id="featured" className="section container-wide" aria-labelledby="featured-title">
        <SectionHeading id="featured-title" eyebrow="Start here" title="Five places that change how you see Pakistan" action={<Link to="/explore" className="link-arrow">All destinations <ArrowRight size={16} aria-hidden="true" /></Link>} />
        <div className="featured-grid">
          {featured.map((d, i) => <Reveal key={d.id} className="featured-cell" delay={i * 0.06}><DestinationCard destination={d} variant={i === 0 ? 'feature' : 'grid'} index={i + 1} eager={i === 0} /></Reveal>)}
        </div>
      </section>

      <section className="section section--stone" aria-labelledby="regions-title">
        <div className="container-wide">
          <SectionHeading id="regions-title" eyebrow="By region" title="Seven regions, very different journeys" />
          <ul className="region-list">
            {REGIONS.map((r) => {
              const list = DESTINATIONS.filter((d) => d.region === r.id);
              return (
                <li key={r.id}>
                  <Link to={`/explore?region=${r.id}`} className="region-row">
                    <span className="region-row__short">{r.short}</span>
                    <span className="region-row__name">{r.name}</span>
                    <span className="region-row__places">{list.map((d) => d.name).join(', ')}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--ink promo-quiz" aria-labelledby="quiz-promo-title">
        <ContourArt className="promo-quiz__contours" tone="dark" />
        <div className="container-wide promo-quiz__inner">
          <div>
            <Eyebrow tone="saffron">Not sure where to go?</Eyebrow>
            <h2 id="quiz-promo-title">Answer eight quick questions. Get a shortlist that explains itself.</h2>
            <p className="lead-soft">Tell us your days, season, budget, starting city and how much effort you’re up for. Each suggestion comes with the reasons it fits.</p>
            <Link to="/quiz" className="btn btn-accent">Quiz me</Link>
          </div>
          <ol className="quiz-preview" aria-label="Quiz steps">
            {QUIZ_QUESTIONS.slice(0, 4).map((q, i) => <li key={q.id}><span>{String(i + 1).padStart(2, '0')}</span>{q.title}</li>)}
            <li className="quiz-preview__more"><span>…</span>and four more</li>
          </ol>
        </div>
      </section>

      <section className="section container-wide promo-plan" aria-labelledby="plan-promo-title">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-5">
            <Eyebrow>Build your journey</Eyebrow>
            <h2 id="plan-promo-title">A day-by-day plan you can reorder, budget and print.</h2>
            <p>Drop places onto days, move them around, add notes and your own cost estimates. Sourced package rates sit beside your figures — never blended in.</p>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/plan" className="btn btn-primary">Start a trip plan</Link>
              <Link to="/toolkit" className="btn btn-ghost">Budget calculator</Link>
            </div>
          </div>
          <div className="col-lg-7">
            <ol className="journey-line" aria-label="Example itinerary">
              {[['islamabad', 'Start in the capital'], ['naran-kaghan', 'Lakes of the Kaghan Valley'], ['fairy-meadows', 'Under Nanga Parbat'], ['hunza', 'Forts and orchards']].map(([id, note], i) => (
                <li key={id}>
                  <span className="journey-line__day">Day {i * 2 + 1}</span>
                  <Link to={`/destinations/${id}`}>{getDestination(id).name}</Link>
                  <span className="muted">{note}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section section--stone" aria-labelledby="season-title">
        <div className="container-wide">
          <SectionHeading id="season-title" eyebrow="When to go" title="Pick a season, see where it shines" />
          <div className="season-tabs" role="tablist" aria-label="Seasons">
            {SEASONS.map((s) => (
              <button key={s.id} type="button" role="tab" id={`tab-${s.id}`} aria-selected={season === s.id} aria-controls="season-panel" className={cx('season-tab', season === s.id && 'is-on')} onClick={() => setSeason(s.id)}>
                <s.icon size={16} aria-hidden="true" /> {s.label} <span className="muted">{s.months}</span>
              </button>
            ))}
          </div>
          <div id="season-panel" role="tabpanel" aria-labelledby={`tab-${season}`}>
            <p className="season-note">{SEASON_GUIDE[season].note}</p>
            <div className="rail">
              {SEASON_GUIDE[season].picks.map((id) => <DestinationCard key={id} destination={getDestination(id)} variant="compact" />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section container-wide" aria-labelledby="pkg-title">
        <SectionHeading id="pkg-title" eyebrow="Published tour rates" title="What organised tours start from" lead={`Starting rates from named operators, each linked to its source and checked ${formatDate(PRICE_SNAPSHOT_DATE)}.`} action={<Link to="/packages" className="link-arrow">All rates <ArrowRight size={16} aria-hidden="true" /></Link>} />
        <div className="pkg-grid">{homePackages.map((p) => <PackageCard key={p.id} pkg={p} compact />)}</div>
      </section>

      <section className="section section--paper" aria-labelledby="stories-title">
        <div className="container-wide">
          <SectionHeading id="stories-title" eyebrow="Stories" title="Culture, food and the road between" action={<Link to="/stories" className="link-arrow">All stories <ArrowRight size={16} aria-hidden="true" /></Link>} />
          <div className="story-mosaic">{homeStories.map((s, i) => <StoryCard key={s.id} story={s} variant={i === 0 ? 'tall' : 'wide'} />)}</div>
        </div>
      </section>

      <section className="section section--ink" aria-labelledby="map-teaser-title">
        <div className="container-wide">
          <div className="row g-4 g-lg-5 align-items-center">
            <div className="col-lg-4">
              <Eyebrow tone="saffron">The atlas</Eyebrow>
              <h2 id="map-teaser-title">Every place, from 24° to 37° north.</h2>
              <p className="lead-soft">See where each destination sits, open directions in Google Maps, and send stops straight to your trip.</p>
              <Link to="/map" className="btn btn-accent"><MapIcon size={16} aria-hidden="true" /> Open the map</Link>
            </div>
            <div className="col-lg-8"><SchematicMap /></div>
          </div>
        </div>
      </section>

      <section className="section container-wide" aria-labelledby="member-title">
        <SectionHeading id="member-title" eyebrow="Membership" title="Free to explore. More room to plan." lead="Explorer is free. Paid plans lift the limits on trips and collections and add proposed savings on selected packages." action={<Link to="/membership" className="link-arrow">Compare plans <ArrowRight size={16} aria-hidden="true" /></Link>} />
        <div className="plan-strip">
          {MEMBERSHIP_PLANS.map((p) => (
            <Link key={p.id} to="/membership" className={cx('plan-strip__item', `plan-strip__item--${p.id}`)}>
              <span className="plan-strip__name">{p.name}</span>
              <span className="plan-strip__price">{p.pricePkr ? `${formatPkr(p.pricePkr)} / year` : 'Free'}</span>
              <span className="muted">{p.summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--paper home-contact-section" id="contact-us" aria-labelledby="home-contact-title">
        <div className="container-wide">
          <SectionHeading
            id="home-contact-title"
            eyebrow="Contact us"
            title="Have questions or need help planning?"
            lead="Get in touch with the Explore Pakistan team directly. We are available via WhatsApp and email to help you discover destinations, suggest routes, and answer your travel questions."
          />
          <div className="contact-methods home-contact-methods">
            <a
              className="contact-method contact-method--whatsapp"
              href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Explore Pakistan! I would like to inquire about planning a trip.')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with Explore Pakistan on WhatsApp (${CONTACT_WHATSAPP_DISPLAY})`}
            >
              <span className="contact-method__icon"><WhatsAppMark size={24} /></span>
              <span className="contact-method__copy">
                <strong>Explore Pakistan on WhatsApp</strong>
                <span>${CONTACT_WHATSAPP_DISPLAY}</span>
                <small>Usually the quickest way to reach us</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="contact-method__arrow" />
            </a>

            <a
              className="contact-method contact-method--email"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Explore Pakistan Inquiry')}`}
              aria-label={`Send an email to ${CONTACT_EMAIL}`}
            >
              <span className="contact-method__icon"><Mail size={22} aria-hidden="true" /></span>
              <span className="contact-method__copy">
                <strong>Email Us Directly</strong>
                <span>${CONTACT_EMAIL}</span>
                <small>For detailed inquiries, corrections, and feedback</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="contact-method__arrow" />
            </a>
          </div>
          <div className="home-contact-form-callout">
            <p className="muted mb-0">
              Prefer writing a message? <Link to="/contact" className="link-arrow">Open our contact message form <ArrowRight size={14} aria-hidden="true" /></Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Explore ---------- */
function FilterGroup({ legend, options, selected, onToggle }) {
  return (
    <fieldset className="filter-group">
      <legend>{legend}</legend>
      <div className="filter-group__chips">
        {options.map((o) => <ToggleChip key={o.id} pressed={selected.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label || o.name}</ToggleChip>)}
      </div>
    </fieldset>
  );
}

function FilterPanel({ filters, setFilters, resultCount }) {
  const toggle = (key) => (id) => setFilters((f) => ({ ...f, [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id] }));
  return (
    <div className="filter-panel">
      <FilterGroup legend="Region" options={REGIONS} selected={filters.region} onToggle={toggle('region')} />
      <FilterGroup legend="Category" options={CATEGORIES} selected={filters.category} onToggle={toggle('category')} />
      <FilterGroup legend="Season" options={SEASONS} selected={filters.season} onToggle={toggle('season')} />
      <FilterGroup legend="Trip length" options={DURATIONS} selected={filters.duration} onToggle={toggle('duration')} />
      <FilterGroup legend="Budget" options={BUDGETS} selected={filters.budget} onToggle={toggle('budget')} />
      <FilterGroup legend="Travel style" options={STYLES} selected={filters.style} onToggle={toggle('style')} />
      <FilterGroup legend="Travelling as" options={COMPANIONS} selected={filters.companions} onToggle={toggle('companions')} />
      <FilterGroup legend="Effort" options={DIFFICULTIES} selected={filters.difficulty} onToggle={toggle('difficulty')} />
      <fieldset className="filter-group">
        <legend>Discovery</legend>
        <ToggleChip pressed={filters.hidden} onClick={() => setFilters((f) => ({ ...f, hidden: !f.hidden }))} icon={Gem}>Hidden gems only</ToggleChip>
      </fieldset>
      <p className="filter-panel__count" aria-live="polite">{resultCount} place{resultCount === 1 ? '' : 's'} match</p>
    </div>
  );
}

function activeFilterChips(filters) {
  const chips = [];
  const lookup = { region: REGIONS, category: CATEGORIES, season: SEASONS, duration: DURATIONS, budget: BUDGETS, style: STYLES, companions: COMPANIONS, difficulty: DIFFICULTIES };
  FILTER_KEYS.forEach((k) => filters[k].forEach((id) => {
    const item = lookup[k].find((x) => x.id === id);
    chips.push({ key: k, id, label: item?.label || item?.name || id });
  }));
  if (filters.hidden) chips.push({ key: 'hidden', id: 'hidden', label: 'Hidden gems' });
  if (filters.q) chips.push({ key: 'q', id: 'q', label: `“${filters.q}”` });
  return chips;
}

// Search suggestions
function DestinationAutocomplete({ value, onChange, onPick }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const suggestions = value.trim() ? DESTINATIONS.filter((d) => matchesQuery(d, value)).slice(0, 6) : [];
  const show = open && suggestions.length > 0;
  return (
    <div className="autocomplete">
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        className="form-control"
        placeholder="Search by place, region or activity"
        value={value}
        aria-label="Search destinations"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={show && active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (!show) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(suggestions.length - 1, a + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
          if (e.key === 'Enter' && active >= 0) { e.preventDefault(); onPick(suggestions[active]); setOpen(false); }
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      {show && (
        <ul className="autocomplete__list" id={listId} role="listbox">
          {suggestions.map((d, i) => (
            <li key={d.id} id={`${listId}-${i}`} role="option" aria-selected={i === active} className={cx(i === active && 'is-active')} onMouseDown={(e) => { e.preventDefault(); onPick(d); setOpen(false); }}>
              <strong>{d.name}</strong> <span className="muted">{regionName(d.region)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExplorePage() {
  useDocumentTitle('Explore destinations');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const sort = params.get('sort') || 'relevance';
  const view = params.get('view') || 'grid';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Filters live in the URL so results can be bookmarked and shared.
  const setFilters = useCallback((updater) => {
    const next = typeof updater === 'function' ? updater(filtersFromParams(params)) : updater;
    setParams(filtersToParams(next, { sort: sort !== 'relevance' && sort, view: view !== 'grid' && view }), { replace: true });
  }, [params, setParams, sort, view]);
  const setOption = (key, value) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value); else p.delete(key);
    setParams(p, { replace: true });
  };

  const results = useMemo(() => sortDestinations(filterDestinations(DESTINATIONS, filters), sort), [filters, sort]);
  const chips = activeFilterChips(filters);
  const removeChip = (c) => setFilters((f) => {
    if (c.key === 'hidden') return { ...f, hidden: false };
    if (c.key === 'q') return { ...f, q: '' };
    return { ...f, [c.key]: f[c.key].filter((x) => x !== c.id) };
  });
  const clearAll = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="page page--explore">
      <header className="page-head container-wide">
        <Eyebrow>Explore</Eyebrow>
        <h1>Find your place in Pakistan</h1>
        <div className="explore-search">
          <DestinationAutocomplete value={filters.q} onChange={(q) => setFilters((f) => ({ ...f, q }))} onPick={(d) => navigate(`/destinations/${d.id}`)} />
        </div>
      </header>
      <div className="container-wide explore-layout">
        <aside className="explore-sidebar d-none d-lg-block" aria-label="Filters">
          <div className="explore-sidebar__head">
            <h2 className="h-sm">Filters</h2>
            {chips.length > 0 && <button type="button" className="btn-link-plain" onClick={clearAll}>Clear all</button>}
          </div>
          <FilterPanel filters={filters} setFilters={setFilters} resultCount={results.length} />
        </aside>
        <section className="explore-results" aria-label="Results">
          <div className="toolbar">
            <button type="button" className="btn btn-ghost d-lg-none" onClick={() => setDrawerOpen(true)}>
              <SlidersHorizontal size={16} aria-hidden="true" /> Filters{chips.length ? ` (${chips.length})` : ''}
            </button>
            <p className="toolbar__count" aria-live="polite"><strong>{results.length}</strong> of {DESTINATIONS.length} places</p>
            <label className="toolbar__sort">
              <span className="visually-hidden">Sort by</span>
              <select className="form-select form-select-sm" value={sort} onChange={(e) => setOption('sort', e.target.value === 'relevance' ? '' : e.target.value)}>
                <option value="relevance">Sort: Recommended</option>
                <option value="price">Sort: Lowest tour rate</option>
                <option value="name">Sort: Name A–Z</option>
              </select>
            </label>
            <div className="segmented" role="group" aria-label="View">
              {[{ id: 'grid', icon: LayoutGrid, label: 'Grid view' }, { id: 'list', icon: List, label: 'List view' }, { id: 'map', icon: MapIcon, label: 'Map and list view' }].map((v) => (
                <button key={v.id} type="button" aria-pressed={view === v.id} className={cx(view === v.id && 'is-on')} onClick={() => setOption('view', v.id === 'grid' ? '' : v.id)} aria-label={v.label}>
                  <v.icon size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          {chips.length > 0 && (
            <div className="active-chips" aria-label="Active filters">
              {chips.map((c) => (
                <button key={`${c.key}-${c.id}`} type="button" className="active-chip" onClick={() => removeChip(c)} aria-label={`Remove filter ${c.label}`}>
                  {c.label} <X size={14} aria-hidden="true" />
                </button>
              ))}
              <button type="button" className="btn-link-plain" onClick={clearAll}>Clear all</button>
            </div>
          )}
          {sort === 'price' && <p className="note"><Info size={14} aria-hidden="true" /> Sorted by the lowest sourced tour rate. Places without a sourced rate are listed last.</p>}
          {results.length === 0 ? (
            <EmptyState icon={Compass} title="No places match all of those filters" actions={
              <>
                <button type="button" className="btn btn-primary" onClick={clearAll}>Clear filters</button>
                <Link to="/quiz" className="btn btn-ghost">Take the quiz instead</Link>
              </>
            }>
              Try removing a filter — for example the season or trip length — or browse a broader category like {['Heritage', 'Valleys', 'Lakes'].join(', ')}.
            </EmptyState>
          ) : view === 'map' ? (
            <div className="split-view">
              <ul className="split-view__list">
                {results.map((d) => (
                  <li key={d.id}>
                    <button type="button" className={cx('split-item', selected === d.id && 'is-on')} onClick={() => setSelected(d.id)} aria-pressed={selected === d.id}>
                      <DestinationImage destination={d} className="split-item__img" />
                      <span><strong>{d.name}</strong><span className="muted">{regionName(d.region)}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
              <MapPanel destinations={results} selectedId={selected} onSelect={setSelected} />
            </div>
          ) : (
            <div className={cx(view === 'list' ? 'result-list' : 'result-grid')}>
              {results.map((d) => <DestinationCard key={d.id} destination={d} variant={view === 'list' ? 'list' : 'grid'} />)}
            </div>
          )}
        </section>
      </div>
      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" variant="sheet" className="filter-sheet" footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={clearAll}>Clear</button>
          <button type="button" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>Show {results.length} place{results.length === 1 ? '' : 's'}</button>
        </>
      }>
        <FilterPanel filters={filters} setFilters={setFilters} resultCount={results.length} />
      </Modal>
    </div>
  );
}

// Destination & Package Views

// Destination gallery
const useGallery = (d) => (d ? destinationMedia(d.id).gallery : []);

function Lightbox({ images, index, onClose, onIndex, title }) {
  const open = index != null;
  const img = open ? images[index] : null;
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, images.length, onIndex]);
  return (
    <Modal open={open} onClose={onClose} title={`${title} — photo ${index != null ? index + 1 : ''} of ${images.length}`} variant="full" className="lightbox">
      <AnimatePresence mode="wait">
        {img && (
          <motion.figure key={img.id} className="lightbox__figure" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: MOTION.base, ease: MOTION.ease }}>
            <MediaImage image={img} className="lightbox__img" eager sizes="100vw" />
            <figcaption>
              <span className="lightbox__caption">{img.caption || img.title}{(img.isIllustration || img.isGenerated) && <span className="tag-illustration">Illustration</span>}</span>
              <MediaCredit image={img} />
            </figcaption>
          </motion.figure>
        )}
      </AnimatePresence>
      {images.length > 1 && (
        <div className="lightbox__nav">
          <button type="button" className="icon-btn icon-btn--lg" onClick={() => onIndex((index - 1 + images.length) % images.length)} aria-label="Previous photo"><ChevronLeft size={24} aria-hidden="true" /></button>
          <button type="button" className="icon-btn icon-btn--lg" onClick={() => onIndex((index + 1) % images.length)} aria-label="Next photo"><ChevronRight size={24} aria-hidden="true" /></button>
        </div>
      )}
    </Modal>
  );
}

async function shareOrCopy(title, url, notify) {
  try {
    if (navigator.share) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url);
    notify('Link copied to your clipboard');
  } catch (err) {
    if (err?.name !== 'AbortError') notify('Couldn’t share automatically — copy the address from your browser bar.', { tone: 'warn' });
  }
}

// Voice narration
function Narration({ id, title, text }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const { notify } = useApp();
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [id, supported]);
  useEffect(() => { setSpeaking(false); }, [id]);
  if (!supported) return null;
  const start = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = (e) => {
      setSpeaking(false);
      // "interrupted"/"canceled" are our own Stop; anything else means the device has no usable voice.
      if (!['interrupted', 'canceled'].includes(e.error)) notify('Your device couldn’t read this aloud. The full text is on this page.', { tone: 'warn' });
    };
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };
  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  return (
    <>
      <button type="button" className={cx('btn btn-ghost', speaking && 'is-on')} aria-pressed={speaking} onClick={speaking ? stop : start}>
        {speaking ? <Square size={15} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />} {speaking ? 'Stop reading' : 'Listen'}
      </button>
      <AnimatePresence>
        {speaking && (
          <motion.div className="narration" role="region" aria-label={`Transcript: ${title}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: MOTION.base }}>
            <p className="narration__note"><Volume2 size={14} aria-hidden="true" /> Reading aloud with your device’s voice</p>
            <p className="narration__text">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DestinationPage() {
  const { id } = useParams();
  const d = getDestination(id);
  const app = useApp();
  const { recordView } = app;
  const gallery = useGallery(d);
  const [lightbox, setLightbox] = useState(null);
  useDocumentTitle(d ? d.name : 'Destination not found');
  useEffect(() => { if (d) recordView(d.id); }, [d, recordView]);
  if (!d) return <NotFoundPage />;

  const pkgs = packagesFor(d.id);
  const related = d.relatedIds.map(getDestination).filter(Boolean);
  const stories = STORIES.filter((s) => s.destinationIds.includes(d.id));
  const routes = CURATED_ROUTES.filter((r) => r.stops.includes(d.id));
  const fav = app.favorites.includes(d.id);
  const inCompare = app.comparison.includes(d.id);
  const visited = app.visited.includes(d.id);

  return (
    <article className="page page--detail">
      <header className="detail-hero">
        <DestinationImage destination={d} className="detail-hero__img" eager />
        <div className="detail-hero__shade" aria-hidden="true" />
        <div className="container-wide detail-hero__content">
          <nav aria-label="Breadcrumb" className="breadcrumb-trail">
            <Link to="/explore">Explore</Link> <ChevronRight size={14} aria-hidden="true" />
            <Link to={`/explore?region=${d.region}`}>{regionName(d.region)}</Link> <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{d.name}</span>
          </nav>
          <p className="detail-hero__coords"><MapPin size={14} aria-hidden="true" /> {d.area} <span className="coord">{formatCoords(d.coords)}</span></p>
          <h1>{d.name}</h1>
          <p className="detail-hero__tagline">{d.tagline}</p>
          {destinationMedia(d.id).hero && <p className="detail-hero__credit"><MediaCredit image={destinationMedia(d.id).hero} compact /></p>}
        </div>
      </header>

      <div className="detail-actions container-wide no-print" role="toolbar" aria-label="Destination actions">
        <button type="button" className={cx('btn btn-ghost', fav && 'is-on')} aria-pressed={fav} onClick={() => app.toggleFavorite(d.id)}><Heart size={16} aria-hidden="true" fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save'}</button>
        <button type="button" className="btn btn-ghost" onClick={() => app.setCollectionPicker(d.id)}><Bookmark size={16} aria-hidden="true" /> Add to collection</button>
        <button type="button" className={cx('btn btn-ghost', inCompare && 'is-on')} aria-pressed={inCompare} onClick={() => app.toggleCompare(d.id)}><Scale size={16} aria-hidden="true" /> {inCompare ? 'In comparison' : 'Compare'}</button>
        <button type="button" className={cx('btn btn-ghost', visited && 'is-on')} aria-pressed={visited} onClick={() => app.toggleVisited(d.id)}><BadgeCheck size={16} aria-hidden="true" /> {visited ? 'Visited' : 'Mark visited'}</button>
        <button type="button" className="btn btn-ghost" onClick={() => shareOrCopy(d.name, window.location.href, app.notify)}><Share2 size={16} aria-hidden="true" /> Share</button>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print</button>
        <Narration id={d.id} title={d.name} text={[d.name, d.tagline, ...d.overview].join(' ')} />
        <button type="button" className="btn btn-primary ms-lg-auto" onClick={() => app.requestAddToTrip(d.id)}><Plus size={16} aria-hidden="true" /> Add to trip</button>
      </div>

      <div className="container-wide detail-grid">
        <div className="detail-main">
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="h-section">Overview</h2>
            {d.overview.map((p) => <p key={p.slice(0, 24)} className="detail-lead">{p}</p>)}
          </section>

          {gallery.length === 0 && import.meta.env.DEV && (
            <p className="dev-note">Development note: {d.name} has no approved local photos yet. Run <code>npm run photos:fetch</code>, review in media-review.html, then <code>npm run photos:validate</code>.</p>
          )}
          {gallery.length > 0 && (
            <section aria-labelledby="gallery-title" className="no-print">
              <h2 id="gallery-title" className="h-section">Gallery</h2>
              <ul className="gallery">
                {gallery.map((img, i) => (
                  <li key={img.id} className={cx(i === 0 && 'gallery__wide')}>
                    <button type="button" className="gallery__btn" onClick={() => setLightbox(i)} aria-label={`Open photo: ${img.alt}`}>
                      <MediaImage image={img} sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'} />
                    </button>
                  </li>
                ))}
              </ul>
              <Lightbox images={gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} title={d.name} />
            </section>
          )}

          <section aria-labelledby="highlights-title">
            <h2 id="highlights-title" className="h-section">Highlights</h2>
            <ul className="marker-list">{d.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          </section>

          <div className="row g-4">
            <section className="col-md-6" aria-labelledby="culture-title">
              <h2 id="culture-title" className="h-sub"><Users size={18} aria-hidden="true" /> Culture</h2>
              <p>{d.culture}</p>
            </section>
            <section className="col-md-6" aria-labelledby="food-title">
              <h2 id="food-title" className="h-sub"><Utensils size={18} aria-hidden="true" /> Food</h2>
              <p>{d.food}</p>
            </section>
          </div>

          <section aria-labelledby="prep-title" className="prep-box">
            <h2 id="prep-title" className="h-sub"><Shield size={18} aria-hidden="true" /> Before you go</h2>
            <ul className="tick-list">{d.prep.map((p) => <li key={p}>{p}</li>)}</ul>
            <p className="muted small">Road and weather conditions change. Check with local authorities or your operator close to your dates.</p>
          </section>

          <section aria-labelledby="pkgs-title">
            <h2 id="pkgs-title" className="h-section">Tours and published rates</h2>
            {pkgs.length ? (
              <div className="pkg-grid pkg-grid--two">{pkgs.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
            ) : (
              <div className="callout callout--plain">
                <Info size={18} aria-hidden="true" />
                <div>
                  <strong>No sourced tour rate yet</strong>
                  <p>We only show prices we can link to an operator’s own page. Plan this one yourself and add your own cost estimates in the trip planner.</p>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => app.requestAddToTrip(d.id)}>Plan it myself</button>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="detail-side" aria-label="Key facts">
          <div className="fact-card">
            <dl>
              <div><dt><Calendar size={16} aria-hidden="true" /> Best time</dt><dd>{d.bestMonths}</dd></div>
              <div><dt><Clock size={16} aria-hidden="true" /> Suggested stay</dt><dd>{durationLabel(d.durationDays)}</dd></div>
              <div><dt><Footprints size={16} aria-hidden="true" /> Effort</dt><dd>{labelOf(DIFFICULTIES, d.difficulty)}</dd></div>
              <div><dt><Wallet size={16} aria-hidden="true" /> Budget feel</dt><dd>{labelOf(BUDGETS, d.budget)}</dd></div>
              <div><dt><Users size={16} aria-hidden="true" /> Good for</dt><dd>{d.companions.map((c) => labelOf(COMPANIONS, c)).join(', ')}</dd></div>
              <div><dt><Compass size={16} aria-hidden="true" /> Style</dt><dd>{d.styles.map((s) => labelOf(STYLES, s)).join(', ')}</dd></div>
            </dl>
            <div className="fact-card__chips">{d.categories.map((c) => <Link key={c} to={`/explore?category=${c}`} className="chip chip--link">{labelOf(CATEGORIES, c)}</Link>)}</div>
            <div className="fact-card__map">
              <ExternalA href={mapsSearchUrl(d.coords)} className="btn btn-ghost btn-sm w-100">Open in Google Maps</ExternalA>
              <ExternalA href={mapsDirectionsUrl(d.coords)} className="btn btn-ghost btn-sm w-100">Get directions</ExternalA>
              <Link to={`/map?focus=${d.id}`} className="btn btn-ghost btn-sm w-100"><MapIcon size={16} aria-hidden="true" /> See on our map</Link>
            </div>
          </div>
          {routes.length > 0 && (
            <div className="side-block">
              <h2 className="h-sub"><RouteIcon size={18} aria-hidden="true" /> On these routes</h2>
              <ul className="plain-list">{routes.map((r) => <li key={r.id}><Link to="/toolkit#routes">{r.title}</Link> <span className="muted small">{r.days}</span></li>)}</ul>
            </div>
          )}
        </aside>
      </div>

      {stories.length > 0 && (
        <section className="section section--paper no-print" aria-labelledby="dest-stories">
          <div className="container-wide">
            <SectionHeading id="dest-stories" eyebrow="Read" title={`Stories from ${d.name}`} />
            <div className="story-row">{stories.map((s) => <StoryCard key={s.id} story={s} />)}</div>
          </div>
        </section>
      )}

      <section className="section container-wide no-print" aria-labelledby="related-title">
        <SectionHeading id="related-title" eyebrow="Nearby and related" title="Pair it with" />
        <div className="result-grid">{related.map((r) => <DestinationCard key={r.id} destination={r} />)}</div>
      </section>
    </article>
  );
}

function PackagesPage() {
  useDocumentTitle('Published tour rates');
  const [region, setRegion] = useState('');
  const list = TOUR_PACKAGES.filter((p) => !region || p.destinationIds.some((id) => getDestination(id)?.region === region));
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Tour rates</Eyebrow>
        <h1>Published starting rates</h1>
        <p className="page-lead">Each rate comes from a named operator’s own website, checked on {formatDate(PRICE_SNAPSHOT_DATE)}. They are starting points for comparison — not quotes, and not a guarantee of availability.</p>
      </header>
      <div className="callout callout--plain mb-4">
        <Info size={18} aria-hidden="true" />
        <div>
          <strong>How to read these prices</strong>
          <p>“From” means an advertised starting rate. We show the price basis exactly as the operator states it — and say so when it isn’t stated. Inclusions, dates and final prices are set by the operator.</p>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by region">
        <ToggleChip pressed={!region} onClick={() => setRegion('')}>All regions</ToggleChip>
        {REGIONS.filter((r) => TOUR_PACKAGES.some((p) => p.destinationIds.some((id) => getDestination(id)?.region === r.id))).map((r) => (
          <ToggleChip key={r.id} pressed={region === r.id} onClick={() => setRegion(r.id)}>{r.name}</ToggleChip>
        ))}
      </div>
      <div className="pkg-grid">{list.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
    </div>
  );
}

// Map & Trip Planner Views

// Google Maps loader
let mapsPromise = null;
let mapsAuthFailed = false;
function loadGoogleMaps(key) {
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('timeout')), 12000);
    window.__explorePakistanMapsReady = () => { window.clearTimeout(timer); resolve(window.google.maps); };
    // Google calls this global when the key is invalid or not authorised for this site.
    window.gm_authFailure = () => {
      mapsAuthFailed = true;
      window.clearTimeout(timer);
      reject(new Error('auth'));
      window.dispatchEvent(new Event('explore-pakistan-maps-auth'));
    };
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&callback=__explorePakistanMapsReady`;
    script.async = true;
    script.onerror = () => { window.clearTimeout(timer); reject(new Error('network')); };
    document.head.appendChild(script);
  }).catch((err) => { mapsPromise = null; throw err; });
  return mapsPromise;
}

function useGoogleMaps() {
  const [state, setState] = useState(() => (!MAPS_KEY ? 'unavailable' : mapsAuthFailed ? 'error' : window.google?.maps?.Map ? 'ready' : 'loading'));
  useEffect(() => {
    if (!MAPS_KEY) {
      if (import.meta.env.DEV) console.info('[Explore Pakistan] Set VITE_GOOGLE_MAPS_API_KEY in .env.local to enable the interactive map.');
      return undefined;
    }
    let alive = true;
    loadGoogleMaps(MAPS_KEY).then(() => alive && !mapsAuthFailed && setState('ready')).catch(() => alive && setState('error'));
    const onAuth = () => alive && setState('error');
    window.addEventListener('explore-pakistan-maps-auth', onAuth);
    return () => { alive = false; window.removeEventListener('explore-pakistan-maps-auth', onAuth); };
  }, []);
  return state;
}

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#efe7d6' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a5a5c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b9dcd8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

// Map fallback
function MapFallback({ destinations, state }) {
  return (
    <div className="map-fallback" role="region" aria-label="Map unavailable — destination list">
      <div className="map-fallback__head">
        <MapPinned size={22} aria-hidden="true" />
        <div>
          <strong>{state === 'loading' ? 'Loading the map…' : 'The interactive map isn’t available right now.'}</strong>
          <p>{state === 'loading' ? 'This usually takes a moment.' : 'Every place below still opens directly in Google Maps, with directions from where you are.'}</p>
        </div>
      </div>
      {state !== 'loading' && (
        <ul className="map-fallback__list">
          {destinations.map((d) => (
            <li key={d.id}>
              <span><Link to={`/destinations/${d.id}`}>{d.name}</Link><span className="muted small">{regionName(d.region)} · {formatCoords(d.coords)}</span></span>
              <span className="map-fallback__links">
                <ExternalA href={mapsSearchUrl(d.coords)}>Open in Google Maps</ExternalA>
                <ExternalA href={mapsDirectionsUrl(d.coords)}>Directions</ExternalA>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Google Maps panel
function MapPanel({ destinations, selectedId, onSelect, ordered = false, className }) {
  const state = useGoogleMaps();
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const { requestAddToTrip } = useApp();

  useEffect(() => {
    if (state !== 'ready' || !elRef.current || mapRef.current) return;
    const g = window.google.maps;
    mapRef.current = new g.Map(elRef.current, {
      center: { lat: 30.4, lng: 69.3 }, zoom: 5, styles: MAP_STYLES,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: true, clickableIcons: false,
    });
  }, [state]);

  const icon = useCallback((selected, label) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: selected ? 11 : label ? 10 : 7,
    fillColor: selected ? '#EAAF56' : '#1F817E',
    fillOpacity: 1,
    strokeColor: '#101B20',
    strokeWeight: selected ? 3 : 2,
  }), []);

  const ids = destinations.map((d) => d.id).join(',');
  useEffect(() => {
    if (state !== 'ready' || !mapRef.current) return undefined;
    const g = window.google.maps;
    const markers = markersRef.current;
    markers.forEach((m) => { g.event.clearInstanceListeners(m); m.setMap(null); });
    markers.clear();
    const bounds = new g.LatLngBounds();
    destinations.forEach((d, i) => {
      const label = ordered ? { text: String(i + 1), color: '#ffffff', fontSize: '11px', fontWeight: '700' } : undefined;
      const m = new g.Marker({ position: d.coords, map: mapRef.current, title: d.name, icon: icon(d.id === selectedId, label), label });
      m.addListener('click', () => onSelect?.(d.id));
      markers.set(d.id, m);
      bounds.extend(d.coords);
    });
    if (destinations.length > 1) mapRef.current.fitBounds(bounds, 48);
    else if (destinations.length === 1) { mapRef.current.setCenter(destinations[0].coords); mapRef.current.setZoom(9); }
    return () => {
      markers.forEach((m) => { g.event.clearInstanceListeners(m); m.setMap(null); });
      markers.clear();
    };
  }, [state, ids, ordered]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state !== 'ready') return;
    markersRef.current.forEach((m, id) => m.setIcon(icon(id === selectedId, ordered ? m.getLabel() : undefined)));
    const sel = getDestination(selectedId);
    if (sel && mapRef.current) mapRef.current.panTo(sel.coords);
  }, [selectedId, state, icon, ordered]);

  const fitAll = () => {
    if (!mapRef.current || !destinations.length) return;
    const b = new window.google.maps.LatLngBounds();
    destinations.forEach((d) => b.extend(d.coords));
    mapRef.current.fitBounds(b, 48);
  };

  const selected = getDestination(selectedId);
  if (state !== 'ready') return <div className={cx('map-panel', className)}><MapFallback destinations={destinations} state={state} /></div>;
  return (
    <div className={cx('map-panel', className)}>
      <div ref={elRef} className="map-panel__canvas" role="region" aria-label="Interactive map of destinations" />
      <button type="button" className="btn btn-light-solid btn-sm map-panel__fit" onClick={fitAll}><MapIcon size={14} aria-hidden="true" /> Fit all</button>
      {selected && (
        <div className="map-preview">
          <DestinationImage destination={selected} className="map-preview__img" />
          <div className="map-preview__body">
            <p className="muted small">{regionName(selected.region)}</p>
            <h3>{selected.name}</h3>
            <p className="small">{selected.tagline}</p>
            <div className="map-preview__actions">
              <Link to={`/destinations/${selected.id}`} className="btn btn-primary btn-sm">View</Link>
              <ExternalA href={mapsDirectionsUrl(selected.coords)} className="btn btn-ghost btn-sm">Directions</ExternalA>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => requestAddToTrip(selected.id)}><Plus size={14} aria-hidden="true" /> Trip</button>
            </div>
          </div>
          <button type="button" className="icon-btn icon-btn--sm map-preview__close" onClick={() => onSelect?.(null)} aria-label="Close preview"><X size={16} aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}

function MapPage() {
  useDocumentTitle('Map');
  const [params] = useSearchParams();
  const [region, setRegion] = useState('');
  const [selected, setSelected] = useState(params.get('focus') || null);
  const [mode, setMode] = useState('map');
  const list = DESTINATIONS.filter((d) => !region || d.region === region);
  return (
    <div className="page page--map">
      <header className="page-head container-wide">
        <Eyebrow>The atlas</Eyebrow>
        <h1>Every destination on the map</h1>
        <div className="map-controls">
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filter by region">
            <ToggleChip pressed={!region} onClick={() => setRegion('')}>All</ToggleChip>
            {REGIONS.map((r) => <ToggleChip key={r.id} pressed={region === r.id} onClick={() => setRegion(r.id)}>{r.name}</ToggleChip>)}
          </div>
          <div className="segmented d-lg-none" role="group" aria-label="Show">
            <button type="button" aria-pressed={mode === 'map'} className={cx(mode === 'map' && 'is-on')} onClick={() => setMode('map')}><MapIcon size={16} aria-hidden="true" /> Map</button>
            <button type="button" aria-pressed={mode === 'list'} className={cx(mode === 'list' && 'is-on')} onClick={() => setMode('list')}><List size={16} aria-hidden="true" /> List</button>
          </div>
        </div>
      </header>
      <div className="container-wide map-layout">
        <ol className={cx('map-list', mode === 'map' && 'd-none d-lg-block')} aria-label="Destinations">
          {list.map((d) => (
            <li key={d.id}>
              <button type="button" className={cx('map-list__item', selected === d.id && 'is-on')} aria-pressed={selected === d.id} onClick={() => { setSelected(d.id); setMode('map'); }}>
                <span className="map-list__name">{d.name}</span>
                <span className="muted small">{regionName(d.region)}</span>
              </button>
              <span className="map-list__links">
                <Link to={`/destinations/${d.id}`}>Details</Link>
                <ExternalA href={mapsDirectionsUrl(d.coords)}>Directions</ExternalA>
              </span>
            </li>
          ))}
        </ol>
        <MapPanel destinations={list} selectedId={selected} onSelect={setSelected} className={cx(mode === 'list' && 'd-none d-lg-block')} />
      </div>
    </div>
  );
}

// Trip planner
function PlannerPage() {
  const { tripId } = useParams();
  return tripId ? <TripEditor tripId={tripId} /> : <TripList />;
}

function TripList() {
  useDocumentTitle('Trip planner');
  const { trips, createTrip, plan, notify } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [name, setName] = useState('');
  const [startCity, setStartCity] = useState('Islamabad');
  const fromIds = (params.get('from') || '').split(',').filter((id) => getDestination(id));
  const create = (e, overrides = {}) => {
    e?.preventDefault();
    const t = createTrip({ name: name.trim() || 'My Pakistan trip', startCity, ...overrides });
    if (t) { notify(`Created “${t.name}”`); navigate(`/plan/${t.id}`); }
  };
  const createFromIds = () => create(null, {
    name: `${fromIds.map((id) => getDestination(id).name).join(' + ')} trip`,
    days: fromIds.flatMap((id) => {
      const d = getDestination(id);
      return Array.from({ length: d.durationDays[0] }, (_, i) => ({ id: uid('day'), notes: '', stops: i === 0 ? [{ id: uid('stop'), destinationId: id, note: '' }] : [] }));
    }),
  });
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Trip planner</Eyebrow>
        <h1>Your trips</h1>
        <p className="page-lead">Plans are saved in this browser. {Number.isFinite(plan.limits.trips) ? `Your ${plan.name} plan includes up to ${plan.limits.trips} trips.` : `Your ${plan.name} plan includes unlimited trips.`}</p>
      </header>
      {fromIds.length > 0 && (
        <div className="callout mb-4">
          <RouteIcon size={18} aria-hidden="true" />
          <div>
            <strong>Start a trip with {fromIds.map((id) => getDestination(id).name).join(' and ')}?</strong>
            <p>We’ll add a day for each suggested night. You can rearrange everything afterwards.</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={createFromIds}>Create this trip</button>
          </div>
        </div>
      )}
      <div className="row g-4">
        <div className="col-lg-4">
          <form className="panel" onSubmit={create}>
            <h2 className="h-sub">New trip</h2>
            <Field label="Trip name"><input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hunza in April" maxLength={80} /></Field>
            <Field label="Starting city">
              <select className="form-select" value={startCity} onChange={(e) => setStartCity(e.target.value)}>
                {CITIES.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <button type="submit" className="btn btn-primary w-100"><Plus size={16} aria-hidden="true" /> Create trip</button>
            <p className="muted small mt-3">Or let the <Link to="/concierge">concierge</Link> draft one for you.</p>
          </form>
        </div>
        <div className="col-lg-8">
          {trips.length === 0 ? (
            <EmptyState icon={RouteIcon} title="No trips yet" actions={<><Link to="/quiz" className="btn btn-ghost">Find a destination</Link><Link to="/concierge" className="btn btn-primary">Ask the concierge</Link></>}>
              Create a trip on the left, or add places from any destination page with “Add to trip”.
            </EmptyState>
          ) : (
            <ul className="trip-cards">
              {trips.map((t) => {
                const ids = tripDestinationIds(t);
                const budget = tripBudget(t);
                return (
                  <li key={t.id}>
                    <Link to={`/plan/${t.id}`} className="trip-card">
                      <span className="trip-card__thumbs" aria-hidden="true">
                        {ids.slice(0, 3).map((id) => <DestinationImage key={id} destination={getDestination(id)} />)}
                        {!ids.length && <ContourArt />}
                      </span>
                      <span className="trip-card__body">
                        <strong>{t.name}</strong>
                        <span className="muted small">{t.days.length} days · from {t.startCity} · {ids.length} place{ids.length === 1 ? '' : 's'}</span>
                        <span className="small">{ids.map((id) => getDestination(id).name).join(' → ') || 'No stops yet'}</span>
                        {budget.total > 0 && <span className="small">Estimated {formatPkr(budget.total)}</span>}
                      </span>
                      <ChevronRight size={20} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function AddStopDialog({ open, onClose, onAdd, dayLabel }) {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  useEffect(() => { if (open) { setQ(''); setRegion(''); } }, [open]);
  const list = DESTINATIONS.filter((d) => matchesQuery(d, q) && (!region || d.region === region));
  return (
    <Modal open={open} onClose={onClose} title={`Add a stop to ${dayLabel}`} variant="side">
      <div className="row g-2 mb-3">
        <div className="col-7"><Field label="Search"><input className="form-control" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Place or activity" data-autofocus /></Field></div>
        <div className="col-5"><Field label="Region"><select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All</option>{REGIONS.map((r) => <option key={r.id} value={r.id}>{r.short}</option>)}</select></Field></div>
      </div>
      {list.length === 0 && <p className="muted">No places match. Try another word.</p>}
      <ul className="pick-list">
        {list.map((d) => (
          <li key={d.id}>
            <DestinationImage destination={d} className="pick-list__img" />
            <span><strong>{d.name}</strong><span className="muted small">{regionName(d.region)} · {durationLabel(d.durationDays)}</span></span>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onAdd(d.id)}>Add</button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onClose, danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title} footer={
      <>
        <button type="button" className="btn btn-ghost" onClick={onClose} data-autofocus>Cancel</button>
        <button type="button" className={cx('btn', danger ? 'btn-danger-soft' : 'btn-primary')} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </>
    }>
      <p>{children}</p>
    </Modal>
  );
}

// Trip editor
function TripEditor({ tripId }) {
  const app = useApp();
  const navigate = useNavigate();
  const trip = app.trips.find((t) => t.id === tripId);
  const [addTo, setAddTo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  useDocumentTitle(trip ? trip.name : 'Trip not found');
  if (!trip) {
    return (
      <div className="page container-wide">
        <EmptyState level={1} icon={RouteIcon} title="We couldn’t find that trip" actions={<Link className="btn btn-primary" to="/plan">See your trips</Link>}>
          It may have been deleted, or it was created in a different browser.
        </EmptyState>
      </div>
    );
  }
  const update = (patch) => app.updateTrip(trip.id, patch);
  const setDays = (fn) => app.updateTrip(trip.id, (t) => ({ days: fn(t.days) }));
  const setCost = (key, value) => app.updateTrip(trip.id, (t) => ({ costs: { ...t.costs, [key]: value } }));
  const budget = tripBudget(trip);
  const ids = tripDestinationIds(trip);
  const orderedStops = trip.days.flatMap((d) => d.stops.map((s) => getDestination(s.destinationId))).filter(Boolean);
  const uniqueOrdered = orderedStops.filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i);
  const routeUrl = mapsRouteUrl(trip.startCity, uniqueOrdered.map((d) => d.coords));
  const target = toNumber(trip.budgetTarget);
  const suggestedPkgs = TOUR_PACKAGES.filter((p) => p.destinationIds.some((id) => ids.includes(id)));
  const otherPkgs = TOUR_PACKAGES.filter((p) => !suggestedPkgs.includes(p));

  const moveStop = (dayIdx, stopIdx, delta) => setDays((days) => days.map((d, i) => (i === dayIdx ? { ...d, stops: moveItem(d.stops, stopIdx, stopIdx + delta) } : d)));
  const moveStopToDay = (dayIdx, stopIdx, toDay) => setDays((days) => {
    const stop = days[dayIdx].stops[stopIdx];
    return days.map((d, i) => {
      if (i === dayIdx) return { ...d, stops: d.stops.filter((_, j) => j !== stopIdx) };
      if (i === toDay) return { ...d, stops: [...d.stops, stop] };
      return d;
    });
  });
  const removeStop = (dayIdx, stopIdx) => {
    const name = getDestination(trip.days[dayIdx].stops[stopIdx].destinationId)?.name;
    setDays((days) => days.map((d, i) => (i === dayIdx ? { ...d, stops: d.stops.filter((_, j) => j !== stopIdx) } : d)));
    app.notify(`Removed ${name} from day ${dayIdx + 1}`);
  };
  const updateStopNote = (dayIdx, stopIdx, note) => setDays((days) => days.map((d, i) => (i === dayIdx ? { ...d, stops: d.stops.map((s, j) => (j === stopIdx ? { ...s, note } : s)) } : d)));
  const addPackage = (packageId) => {
    if (!packageId || trip.packages.some((p) => p.packageId === packageId)) return;
    update((t) => ({ packages: [...t.packages, { packageId, quantity: t.groupSize || 1 }] }));
  };

  return (
    <div className="page container-wide trip-editor">
      <div className="no-print">
        <nav aria-label="Breadcrumb" className="breadcrumb-trail breadcrumb-trail--dark"><Link to="/plan">Your trips</Link> <ChevronRight size={14} aria-hidden="true" /> <span aria-current="page">{trip.name}</span></nav>
        <header className="trip-head">
          <div className="trip-head__title">
            <label htmlFor="trip-name" className="visually-hidden">Trip name</label>
            <input id="trip-name" className="trip-name-input" value={trip.name} onChange={(e) => update({ name: e.target.value })} maxLength={80} />
            <p className="muted">{trip.days.length} days · from {trip.startCity} · {trip.groupSize} traveller{trip.groupSize === 1 ? '' : 's'}{target > 0 && <> · target {formatPkr(target)} <span className={cx('status-pill', budget.total > target ? 'status-pill--over' : 'status-pill--ok')}>{budget.total > target ? `Over by ${formatPkr(budget.total - target)}` : 'Within target'}</span></>}</p>
          </div>
          <div className="trip-head__actions">
            {routeUrl && <ExternalA href={routeUrl} className="btn btn-ghost btn-sm">Route in Google Maps</ExternalA>}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { const c = app.duplicateTrip(trip.id); if (c) { app.notify(`Duplicated as “${c.name}”`); navigate(`/plan/${c.id}`); } }}><Copy size={16} aria-hidden="true" /> Duplicate</button>
            <button type="button" className="btn btn-ghost btn-sm text-danger-soft" onClick={() => setConfirmDelete(true)}><Trash2 size={16} aria-hidden="true" /> Delete</button>
          </div>
        </header>

        <details className="panel trip-details" open={!trip.days.some((d) => d.stops.length)}>
          <summary><Pencil size={16} aria-hidden="true" /> Trip details</summary>
          <div className="row g-3 mt-1">
            <div className="col-sm-6 col-lg-3"><Field label="Starting city"><select className="form-select" value={trip.startCity} onChange={(e) => update({ startCity: e.target.value })}>{CITIES.map((c) => <option key={c.id}>{c.name}</option>)}</select></Field></div>
            <div className="col-sm-6 col-lg-3"><Field label="Start date (optional)"><input type="date" className="form-control" value={trip.startDate} onChange={(e) => update({ startDate: e.target.value })} /></Field></div>
            <div className="col-sm-6 col-lg-3"><Field label="Season"><select className="form-select" value={trip.season} onChange={(e) => update({ season: e.target.value })}><option value="">Not set</option>{SEASONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></Field></div>
            <div className="col-sm-6 col-lg-3"><Field label="Travellers"><NumberInput min={1} value={trip.groupSize} onChange={(v) => update({ groupSize: v === '' ? 1 : v })} /></Field></div>
            <div className="col-sm-6 col-lg-3"><Field label="Budget target (PKR)" hint="Optional"><NumberInput step={500} value={trip.budgetTarget || ''} onChange={(v) => update({ budgetTarget: v })} /></Field></div>
            <div className="col-sm-6 col-lg-3"><Field label="Travel style"><select className="form-select" value={trip.style} onChange={(e) => update({ style: e.target.value })}><option value="">Not set</option>{STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></Field></div>
            <div className="col-lg-6">
              <fieldset className="filter-group"><legend>Interests</legend><div className="filter-group__chips">
                {CATEGORIES.slice(0, 9).map((c) => <ToggleChip key={c.id} pressed={trip.interests.includes(c.id)} onClick={() => update((t) => ({ interests: t.interests.includes(c.id) ? t.interests.filter((x) => x !== c.id) : [...t.interests, c.id] }))}>{c.label}</ToggleChip>)}
              </div></fieldset>
            </div>
            <div className="col-12"><Field label="Trip notes"><textarea className="form-control" rows={2} value={trip.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Ideas, contacts, things to book…" /></Field></div>
          </div>
        </details>

        <div className="trip-grid">
          <section aria-labelledby="itinerary-title">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h2 id="itinerary-title" className="h-section mb-0">Itinerary</h2>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDays((days) => [...days, newDay()])}><Plus size={16} aria-hidden="true" /> Add day</button>
            </div>
            <p className="muted small">Route order is a suggestion. It doesn’t account for live traffic, weather or road closures.</p>
            <ol className="day-timeline">
              <AnimatePresence initial={false}>
                {trip.days.map((day, di) => (
                  <motion.li key={day.id} className="day" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
                    <div className="day__marker" aria-hidden="true">{String(di + 1).padStart(2, '0')}</div>
                    <div className="day__body">
                      <div className="day__head">
                        <h3>Day {di + 1}{trip.startDate && <span className="muted small"> · {formatDate(new Date(new Date(`${trip.startDate}T00:00:00`).getTime() + di * 86400000).toISOString().slice(0, 10))}</span>}</h3>
                        <div className="day__tools">
                          <button type="button" className="icon-btn icon-btn--sm" onClick={() => setDays((d) => moveItem(d, di, di - 1))} disabled={di === 0} aria-label={`Move day ${di + 1} earlier`}><ArrowUp size={16} aria-hidden="true" /></button>
                          <button type="button" className="icon-btn icon-btn--sm" onClick={() => setDays((d) => moveItem(d, di, di + 1))} disabled={di === trip.days.length - 1} aria-label={`Move day ${di + 1} later`}><ArrowDown size={16} aria-hidden="true" /></button>
                          <button type="button" className="icon-btn icon-btn--sm" onClick={() => { setDays((d) => d.filter((_, i) => i !== di)); app.notify(`Removed day ${di + 1}`); }} disabled={trip.days.length === 1} aria-label={`Remove day ${di + 1}`}><Trash2 size={16} aria-hidden="true" /></button>
                        </div>
                      </div>
                      {day.stops.length === 0 && <p className="day__empty">Free day — add a place or leave it for rest and travel.</p>}
                      <ul className="stops">
                        <AnimatePresence initial={false}>
                          {day.stops.map((stop, si) => {
                            const d = getDestination(stop.destinationId);
                            if (!d) return null;
                            return (
                              <motion.li key={stop.id} layout className={cx('stop', selectedStop === d.id && 'is-on')} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }}>
                                <DestinationImage destination={d} className="stop__img" />
                                <div className="stop__body">
                                  <button type="button" className="stop__name" onClick={() => setSelectedStop(d.id)}>{d.name}</button>
                                  <label className="visually-hidden" htmlFor={`note-${stop.id}`}>Note for {d.name}</label>
                                  <input id={`note-${stop.id}`} className="form-control form-control-sm" value={stop.note} onChange={(e) => updateStopNote(di, si, e.target.value)} placeholder="Add a note" maxLength={160} />
                                </div>
                                <div className="stop__tools">
                                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => moveStop(di, si, -1)} disabled={si === 0} aria-label={`Move ${d.name} up`}><ArrowUp size={15} aria-hidden="true" /></button>
                                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => moveStop(di, si, 1)} disabled={si === day.stops.length - 1} aria-label={`Move ${d.name} down`}><ArrowDown size={15} aria-hidden="true" /></button>
                                  <label className="visually-hidden" htmlFor={`move-${stop.id}`}>Move {d.name} to another day</label>
                                  <select id={`move-${stop.id}`} className="form-select form-select-sm stop__day" value={di} onChange={(e) => moveStopToDay(di, si, Number(e.target.value))}>
                                    {trip.days.map((x, i) => <option key={x.id} value={i}>Day {i + 1}</option>)}
                                  </select>
                                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => removeStop(di, si)} aria-label={`Remove ${d.name}`}><X size={16} aria-hidden="true" /></button>
                                </div>
                              </motion.li>
                            );
                          })}
                        </AnimatePresence>
                      </ul>
                      <div className="day__foot">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAddTo(di)}><Plus size={15} aria-hidden="true" /> Add stop</button>
                        <label className="visually-hidden" htmlFor={`daynote-${day.id}`}>Notes for day {di + 1}</label>
                        <textarea id={`daynote-${day.id}`} className="form-control form-control-sm day__notes" rows={1} value={day.notes} onChange={(e) => setDays((days) => days.map((x, i) => (i === di ? { ...x, notes: e.target.value } : x)))} placeholder="Day notes" />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </section>

          <aside className="trip-side" aria-label="Budget and map">
            <section className="panel" aria-labelledby="budget-title">
              <h2 id="budget-title" className="h-sub"><Wallet size={18} aria-hidden="true" /> Budget</h2>
              <p className="muted small">Your estimates are labelled <em>estimate</em>. Package fees use operators’ published starting rates.</p>
              <div className="row g-2">
                <div className="col-6"><Field label="Room per night (estimate)"><NumberInput step={500} value={trip.costs.roomRate} onChange={(v) => setCost('roomRate', v)} /></Field></div>
                <div className="col-6"><Field label="Rooms"><NumberInput min={0} value={trip.costs.rooms} onChange={(v) => setCost('rooms', v)} /></Field></div>
                <div className="col-6"><Field label="Food / person / day (estimate)"><NumberInput step={100} value={trip.costs.foodPerPersonPerDay} onChange={(v) => setCost('foodPerPersonPerDay', v)} /></Field></div>
                <div className="col-6"><Field label="Transport total (estimate)"><NumberInput step={500} value={trip.costs.transport} onChange={(v) => setCost('transport', v)} /></Field></div>
                <div className="col-6"><Field label="Activities (estimate)"><NumberInput step={500} value={trip.costs.activities} onChange={(v) => setCost('activities', v)} /></Field></div>
                <div className="col-6"><Field label="Other (estimate)"><NumberInput step={500} value={trip.costs.other} onChange={(v) => setCost('other', v)} /></Field></div>
                <div className="col-6"><Field label="Contingency %"><NumberInput min={0} value={trip.costs.contingencyPct} onChange={(v) => setCost('contingencyPct', v)} /></Field></div>
              </div>
              <h3 className="h-xs mt-3">Sourced package rates</h3>
              {trip.packages.length === 0 && <p className="muted small">None added. Add one below if you’re considering an organised tour.</p>}
              <ul className="pkg-lines">
                {trip.packages.map((p) => {
                  const pkg = getPackage(p.packageId);
                  if (!pkg) return null;
                  return (
                    <li key={p.packageId}>
                      <div>
                        <strong>{pkg.title}</strong>
                        <span className="muted small">{pkg.operatorName} · From {formatPkr(pkg.pricePkr)} {PRICE_BASIS_LABEL[pkg.priceBasis]} · <a href={pkg.sourceUrl} target="_blank" rel="noopener noreferrer">source</a></span>
                      </div>
                      <label className="visually-hidden" htmlFor={`qty-${p.packageId}`}>Quantity for {pkg.title}</label>
                      <NumberInput id={`qty-${p.packageId}`} min={0} value={p.quantity} onChange={(v) => update((t) => ({ packages: t.packages.map((x) => (x.packageId === p.packageId ? { ...x, quantity: v } : x)) }))} style={{ maxWidth: 76 }} />
                      <button type="button" className="icon-btn icon-btn--sm" onClick={() => update((t) => ({ packages: t.packages.filter((x) => x.packageId !== p.packageId) }))} aria-label={`Remove ${pkg.title}`}><X size={15} aria-hidden="true" /></button>
                    </li>
                  );
                })}
              </ul>
              <label className="visually-hidden" htmlFor="add-pkg">Add a sourced package</label>
              <select id="add-pkg" className="form-select form-select-sm" value="" onChange={(e) => addPackage(e.target.value)}>
                <option value="">+ Add a sourced package rate</option>
                {suggestedPkgs.length > 0 && <optgroup label="For places in this trip">{suggestedPkgs.map((p) => <option key={p.id} value={p.id}>{p.title} — from {formatPkr(p.pricePkr)}</option>)}</optgroup>}
                <optgroup label="Other packages">{otherPkgs.map((p) => <option key={p.id} value={p.id}>{p.title} — from {formatPkr(p.pricePkr)}</option>)}</optgroup>
              </select>
              {trip.packages.some((p) => getPackage(p.packageId)?.priceBasis === 'not-stated') && <p className="note small mt-2"><Info size={14} aria-hidden="true" /> Some operators don’t say whether their rate is per person. Set the quantity to match what they confirm.</p>}
              <BudgetSummary result={budget} />
            </section>
            <section className="panel panel--flush" aria-label="Trip map">
              <MapPanel destinations={uniqueOrdered} selectedId={selectedStop} onSelect={setSelectedStop} ordered className="map-panel--short" />
            </section>
          </aside>
        </div>
      </div>

      <TripPrintView trip={trip} budget={budget} />
      <AddStopDialog open={addTo != null} dayLabel={`day ${addTo + 1}`} onClose={() => setAddTo(null)} onAdd={(id) => { app.addStops(trip.id, addTo, [id]); app.notify(`Added ${getDestination(id).name} to day ${addTo + 1}`); }} />
      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete this trip?" confirmLabel="Delete trip" danger onConfirm={() => { app.deleteTrip(trip.id); app.notify(`Deleted “${trip.name}”`); navigate('/plan'); }}>
        “{trip.name}” and all its days, notes and costs will be removed from this browser. This can’t be undone.
      </ConfirmDialog>
    </div>
  );
}

function BudgetSummary({ result }) {
  return (
    <div className="budget-summary" aria-live="polite">
      <ul>
        {result.lines.filter((l) => l.amount > 0).map((l) => (
          <li key={l.id}><span><l.icon size={15} aria-hidden="true" /> {l.label}</span><span>{formatPkr(l.amount)}</span></li>
        ))}
        {result.contingency > 0 && <li><span><Shield size={15} aria-hidden="true" /> Contingency</span><span>{formatPkr(result.contingency)}</span></li>}
      </ul>
      <div className="budget-summary__total"><span>Total</span><strong>{formatPkr(result.total)}</strong></div>
      <div className="budget-summary__pp"><span>Per traveller ({result.travellers})</span><span>{formatPkr(result.perPerson)}</span></div>
      {result.total === 0 && <p className="muted small mb-0">Add your estimates to see a total.</p>}
    </div>
  );
}

// Print itinerary
function TripPrintView({ trip, budget }) {
  return (
    <section className="print-only print-trip" aria-hidden="true">
      <h1>{trip.name}</h1>
      <p>{trip.days.length} days from {trip.startCity}{trip.startDate ? `, starting ${formatDate(trip.startDate)}` : ''} · {trip.groupSize} traveller(s)</p>
      {trip.notes && <p><em>{trip.notes}</em></p>}
      <ol>
        {trip.days.map((d, i) => (
          <li key={d.id}>
            <strong>Day {i + 1}</strong>: {d.stops.map((s) => { const x = getDestination(s.destinationId); return x ? `${x.name}${s.note ? ` (${s.note})` : ''}` : ''; }).filter(Boolean).join(' → ') || 'Free day'}
            {d.notes && <div>{d.notes}</div>}
          </li>
        ))}
      </ol>
      <h2>Budget</h2>
      <ul>
        {budget.lines.filter((l) => l.amount > 0).map((l) => <li key={l.id}>{l.label}: {formatPkr(l.amount)}</li>)}
        {budget.contingency > 0 && <li>Contingency: {formatPkr(budget.contingency)}</li>}
        <li><strong>Total: {formatPkr(budget.total)} ({formatPkr(budget.perPerson)} per traveller)</strong></li>
      </ul>
      {trip.packages.length > 0 && (
        <>
          <h2>Package rate sources</h2>
          <ul>{trip.packages.map((p) => { const pkg = getPackage(p.packageId); return pkg ? <li key={p.packageId}>{pkg.title} — {pkg.operatorName}, from {formatPkr(pkg.pricePkr)} ({PRICE_BASIS_LABEL[pkg.priceBasis]}), checked {formatDate(pkg.sourceCheckedAt)}: {pkg.sourceUrl}</li> : null; })}</ul>
        </>
      )}
      <p>Estimates are your own. Route order is a suggestion and doesn’t reflect live road conditions.</p>
    </section>
  );
}

// Concierge & Quiz Views

const CONCIERGE_SUGGESTIONS = [
  'Plan 4 days in Northern Pakistan',
  'Find a family-friendly trip under PKR 40,000',
  'I love culture and food',
  'Compare Hunza and Skardu',
  'Build a Lahore weekend',
];

function prefsToChips(prefs) {
  const chips = [];
  if (prefs.days) chips.push({ key: 'days', label: `${prefs.days} day${prefs.days > 1 ? 's' : ''}` });
  if (prefs.season) chips.push({ key: 'season', label: labelOf(SEASONS, prefs.season) });
  if (prefs.from) chips.push({ key: 'from', label: `From ${CITIES.find((c) => c.id === prefs.from)?.name}` });
  if (prefs.budgetPkr) chips.push({ key: 'budgetPkr', label: `Up to ${formatPkr(prefs.budgetPkr)}` });
  if (prefs.group) chips.push({ key: 'group', label: labelOf(COMPANIONS, prefs.group) });
  if (prefs.pace) chips.push({ key: 'pace', label: prefs.pace === 'easy' ? 'Relaxed pace' : 'Adventurous pace' });
  (prefs.interests || []).forEach((i) => chips.push({ key: `interest:${i}`, label: labelOf(CATEGORIES, i) }));
  (prefs.mentioned || []).forEach((id) => chips.push({ key: `mentioned:${id}`, label: getDestination(id)?.name }));
  return chips;
}

function removePref(prefs, key) {
  const next = { ...prefs };
  if (key.startsWith('interest:')) next.interests = (prefs.interests || []).filter((i) => i !== key.slice(9));
  else if (key.startsWith('mentioned:')) next.mentioned = (prefs.mentioned || []).filter((i) => i !== key.slice(10));
  else delete next[key];
  return next;
}

function ConciergePlaceCard({ destination: d, reasons, onNavigate }) {
  const { requestAddToTrip, toggleCompare, comparison, toggleFavorite, favorites } = useApp();
  const price = lowestPrice(d.id);
  return (
    <div className="mini-card">
      <DestinationImage destination={d} className="mini-card__img" />
      <div className="mini-card__body">
        <p className="muted small">{regionName(d.region)} · {durationLabel(d.durationDays)}{price ? ` · tours from ${formatPkr(price)}` : ''}</p>
        <h4>{d.name}</h4>
        {reasons?.length > 0 && <ul className="mini-card__reasons">{reasons.slice(0, 2).map((r) => <li key={r}>{r}</li>)}</ul>}
        <div className="mini-card__actions">
          <Link to={`/destinations/${d.id}`} className="btn btn-primary btn-sm" onClick={onNavigate}>View</Link>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => requestAddToTrip(d.id)}><Plus size={14} aria-hidden="true" /> Trip</button>
          <button type="button" className={cx('btn btn-ghost btn-sm', comparison.includes(d.id) && 'is-on')} aria-pressed={comparison.includes(d.id)} onClick={() => toggleCompare(d.id)}><Scale size={14} aria-hidden="true" /> Compare</button>
          <button type="button" className={cx('icon-btn icon-btn--sm', favorites.includes(d.id) && 'is-on')} aria-pressed={favorites.includes(d.id)} aria-label={`Save ${d.name}`} onClick={() => toggleFavorite(d.id)}><Heart size={15} aria-hidden="true" fill={favorites.includes(d.id) ? 'currentColor' : 'none'} /></button>
        </div>
      </div>
    </div>
  );
}

function AssistantReply({ reply, prefs, onFollowUp, onNavigate, compact }) {
  const { createTrip, notify } = useApp();
  const navigate = useNavigate();
  const saveAsTrip = () => {
    const fromName = CITIES.find((c) => c.id === prefs.from)?.name || 'Islamabad';
    const firstNames = (reply.destinations || []).slice(0, 2).map((id) => getDestination(id).name).join(' + ');
    const t = createTrip({
      name: `${firstNames || 'Concierge'} plan`,
      startCity: fromName,
      season: prefs.season || '',
      groupSize: prefs.groupSize || (prefs.group === 'couple' ? 2 : prefs.group === 'solo' ? 1 : 2),
      budgetTarget: prefs.budgetPkr || 0,
      days: reply.itinerary.map((day) => ({ id: uid('day'), notes: `${day.title}. ${day.detail}`, stops: day.destinationId ? [{ id: uid('stop'), destinationId: day.destinationId, note: '' }] : [] })),
    });
    if (t) { notify(`Saved “${t.name}” to your trips`); onNavigate?.(); navigate(`/plan/${t.id}`); }
  };
  return (
    <div className="reply">
      <p>{reply.text}</p>
      {reply.comparison && (
        <div className="table-scroll">
          <table className="compare-mini">
            <thead><tr><th scope="col"><span className="visually-hidden">Attribute</span></th><th scope="col">{getDestination(reply.destinations[0]).name}</th><th scope="col">{getDestination(reply.destinations[1]).name}</th></tr></thead>
            <tbody>{reply.comparison.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.a}</td><td>{row.b}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      {reply.itinerary?.length > 0 && (
        <div className="reply__block">
          <h4><Calendar size={15} aria-hidden="true" /> Day by day</h4>
          <ol className="reply__days">
            {reply.itinerary.map((day, i) => (
              <li key={`${i}-${day.title}`}><span className="reply__day-num">{i + 1}</span><span><strong>{day.title}</strong><span className="muted small d-block">{day.detail}</span></span></li>
            ))}
          </ol>
          <button type="button" className="btn btn-primary btn-sm" onClick={saveAsTrip}><RouteIcon size={15} aria-hidden="true" /> Save as a trip</button>
        </div>
      )}
      {reply.destinations?.length > 0 && (
        <div className={cx('reply__cards', compact && 'reply__cards--stack')}>
          {reply.destinations.map((id) => <ConciergePlaceCard key={id} destination={getDestination(id)} reasons={reply.reasons?.[id]} onNavigate={onNavigate} />)}
        </div>
      )}
      {reply.costs && (
        <div className="reply__block">
          <h4><Coins size={15} aria-hidden="true" /> Costs</h4>
          {reply.costs.packages.length > 0 && (
            <ul className="reply__costs">
              {reply.costs.packages.map((p) => (
                <li key={p.id}><span>{p.title} <span className="muted small">({p.operator}, {p.duration})</span></span><span>From {formatPkr(p.price)} <span className="muted small">{PRICE_BASIS_LABEL[p.basis]}</span></span></li>
              ))}
            </ul>
          )}
          {reply.costs.budgetPkr && reply.costs.packages.length > 0 && (
            <p className="small">{reply.costs.packages.some((p) => p.price <= reply.costs.budgetPkr) ? `At least one published starting rate is within your ${formatPkr(reply.costs.budgetPkr)} budget.` : `The published starting rates are above your ${formatPkr(reply.costs.budgetPkr)} budget — a self-planned trip may fit better.`}</p>
          )}
          <p className="muted small">{reply.costs.note}</p>
        </div>
      )}
      {reply.tips?.length > 0 && (
        <div className="reply__block">
          <h4><Info size={15} aria-hidden="true" /> Good to know</h4>
          <ul className="tick-list small">{reply.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}
      {reply.followUps?.length > 0 && (
        <div className="suggestion-chips">{reply.followUps.map((f) => <button key={f} type="button" className="suggestion-chip" onClick={() => onFollowUp(f)}>{f}</button>)}</div>
      )}
    </div>
  );
}

// Concierge chat UI
function ConciergeChat({ compact, onNavigate }) {
  const { conversation, setConversation } = useApp();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);
  const { messages, prefs } = conversation;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  const clear = () => { window.clearTimeout(timerRef.current); setTyping(false); setConversation({ messages: [], prefs: {} }); };
  const send = (text) => {
    const clean = text.trim();
    if (!clean || typing) return;
    if (/^start over$/i.test(clean)) { clear(); return; }
    setInput('');
    setConversation((c) => ({ ...c, messages: [...c.messages, { id: uid('m'), role: 'user', text: clean }] }));
    setTyping(true);
    // Brief delay for natural message pacing
    timerRef.current = window.setTimeout(() => {
      setConversation((c) => {
        const { prefs: nextPrefs, reply } = generateConciergeResponse(clean, c.prefs);
        return { prefs: nextPrefs, messages: [...c.messages, { id: uid('m'), role: 'assistant', reply, prefs: nextPrefs }] };
      });
      setTyping(false);
    }, 450);
  };
  const retry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    setConversation((c) => {
      const idx = c.messages.map((m) => m.id).lastIndexOf(lastUser.id);
      return { ...c, messages: c.messages.slice(0, idx) };
    });
    window.setTimeout(() => send(lastUser.text), 0);
  };
  const chips = prefsToChips(prefs);

  return (
    <div className={cx('chat', compact && 'chat--compact')}>
      <div className="chat__scroll" ref={scrollRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat__welcome">
            <span className="chat__mark" aria-hidden="true"><Compass size={22} /></span>
            <h3>Where would you like to go?</h3>
            <p>Tell me how many days you have, when you’re travelling, where you’re starting from and what you enjoy. I’ll suggest places, a day-by-day outline and the published tour rates I know about.</p>
            <div className="suggestion-chips">{CONCIERGE_SUGGESTIONS.map((s) => <button key={s} type="button" className="suggestion-chip" onClick={() => send(s)}>{s}</button>)}</div>
          </div>
        ) : (
          <ul className="chat__messages">
            {messages.map((m) => (
              <motion.li key={m.id} className={cx('msg', `msg--${m.role}`)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
                {m.role === 'assistant' && <span className="msg__avatar" aria-hidden="true"><Compass size={16} /></span>}
                <div className="msg__bubble">
                  <span className="visually-hidden">{m.role === 'user' ? 'You said:' : 'Concierge:'}</span>
                  {m.role === 'user' ? <p>{m.text}</p> : <AssistantReply reply={m.reply} prefs={m.prefs} onFollowUp={send} onNavigate={onNavigate} compact={compact} />}
                </div>
              </motion.li>
            ))}
            {typing && (
              <li className="msg msg--assistant">
                <span className="msg__avatar" aria-hidden="true"><Compass size={16} /></span>
                <div className="msg__bubble msg__typing" aria-label="The concierge is writing"><span /><span /><span /></div>
              </li>
            )}
          </ul>
        )}
      </div>
      {chips.length > 0 && (
        <div className="chat__prefs" aria-label="Your preferences">
          <span className="muted small">Shaped by:</span>
          {chips.map((c) => (
            <button key={c.key} type="button" className="active-chip active-chip--sm" onClick={() => setConversation((conv) => ({ ...conv, prefs: removePref(conv.prefs, c.key) }))} aria-label={`Remove preference ${c.label}`}>
              {c.label} <X size={12} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
      <form className="chat__composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <label htmlFor={compact ? 'chat-input-compact' : 'chat-input'} className="visually-hidden">Message the concierge</label>
        <input id={compact ? 'chat-input-compact' : 'chat-input'} className="form-control" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 6 days in autumn from Lahore, we love history" autoComplete="off" data-autofocus />
        <button type="submit" className="btn btn-accent" disabled={!input.trim() || typing} aria-label="Send"><Send size={18} aria-hidden="true" /></button>
      </form>
      <div className="chat__foot">
        <span className="muted small">Suggestions draw on our destination guides and sourced rates. Live weather and road conditions aren’t included.</span>
        <span className="chat__foot-actions">
          {messages.some((m) => m.role === 'user') && <button type="button" className="btn-link-plain small" onClick={retry}><RotateCcw size={13} aria-hidden="true" /> Retry</button>}
          {messages.length > 0 && <button type="button" className="btn-link-plain small" onClick={clear}>Clear conversation</button>}
          {compact && <Link to="/concierge" className="btn-link-plain small" onClick={onNavigate}>Open full view</Link>}
        </span>
      </div>
    </div>
  );
}

function ConciergePage() {
  useDocumentTitle('Travel concierge');
  const { conversation, comparison, trips } = useApp();
  const lastPlan = [...conversation.messages].reverse().find((m) => m.role === 'assistant' && m.reply?.destinations?.length);
  return (
    <div className="page container-wide page--concierge">
      <header className="page-head page-head--plain">
        <Eyebrow>Travel concierge</Eyebrow>
        <h1>Plan out loud</h1>
      </header>
      <div className="concierge-layout">
        <section className="panel panel--chat" aria-label="Conversation"><ConciergeChat /></section>
        <aside className="concierge-side" aria-label="Trip context">
          <div className="panel">
            <h2 className="h-sub"><Compass size={18} aria-hidden="true" /> Your brief</h2>
            {prefsToChips(conversation.prefs).length ? (
              <ul className="plain-list">{prefsToChips(conversation.prefs).map((c) => <li key={c.key}>{c.label}</li>)}</ul>
            ) : <p className="muted small">Nothing yet — mention days, season, starting city, budget or interests.</p>}
          </div>
          {lastPlan && (
            <div className="panel">
              <h2 className="h-sub"><MapPinned size={18} aria-hidden="true" /> Latest suggestions</h2>
              <ul className="plain-list">{lastPlan.reply.destinations.map((id) => <li key={id}><Link to={`/destinations/${id}`}>{getDestination(id).name}</Link></li>)}</ul>
              <Link to={`/map?focus=${lastPlan.reply.destinations[0]}`} className="btn btn-ghost btn-sm mt-2"><MapIcon size={15} aria-hidden="true" /> Open the map</Link>
            </div>
          )}
          <div className="panel">
            <h2 className="h-sub"><RouteIcon size={18} aria-hidden="true" /> Keep going</h2>
            <ul className="plain-list">
              <li><Link to="/plan">Your trips ({trips.length})</Link></li>
              <li><Link to="/compare">Comparison ({comparison.length}/3)</Link></li>
              <li><Link to="/quiz">Take the quiz</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Quiz Me
function QuizPage() {
  useDocumentTitle('Quiz me');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ interests: [] });
  const [done, setDone] = useState(false);
  const app = useApp();
  const navigate = useNavigate();
  const q = QUIZ_QUESTIONS[step];
  const total = QUIZ_QUESTIONS.length;
  const results = useMemo(() => (done ? rankDestinations(answers) : []), [done, answers]);
  const answered = q && (q.type === 'multi' ? true : Boolean(answers[q.id]));

  const choose = (opt) => {
    if (q.type === 'multi') {
      setAnswers((a) => ({ ...a, [q.id]: a[q.id]?.includes(opt) ? a[q.id].filter((x) => x !== opt) : [...(a[q.id] || []), opt] }));
    } else setAnswers((a) => ({ ...a, [q.id]: opt }));
  };
  const next = () => (step < total - 1 ? setStep(step + 1) : setDone(true));
  const restart = () => { setAnswers({ interests: [] }); setStep(0); setDone(false); };
  const askConcierge = () => {
    const from = CITIES.find((c) => c.id === answers.from)?.name;
    const msg = [
      `${answers.days || 5} days`,
      answers.season && answers.season !== 'any' ? `in ${answers.season}` : '',
      from ? `from ${from}` : '',
      answers.group ? `for ${answers.group === 'family' ? 'a family' : answers.group}` : '',
      answers.interests?.length ? `— we like ${answers.interests.join(', ')}` : '',
      results[0] ? `, thinking about ${results[0].destination.name}` : '',
    ].filter(Boolean).join(' ');
    app.setConversation({ messages: [], prefs: {} });
    navigate('/concierge');
    window.setTimeout(() => {
      const { prefs, reply } = generateConciergeResponse(msg, {});
      app.setConversation({ prefs, messages: [{ id: uid('m'), role: 'user', text: msg }, { id: uid('m'), role: 'assistant', reply, prefs }] });
    }, 0);
  };

  if (done) {
    return (
      <div className="page container-wide page--quiz">
        <header className="page-head page-head--plain">
          <Eyebrow>Your shortlist</Eyebrow>
          <h1>{results.length ? 'Places that fit what you told us' : 'No strong match — yet'}</h1>
          <p className="page-lead">Matches are a simple scoring of your answers against each destination’s seasons, length, effort, interests and distance from your starting city. Labels describe fit, not a scientific score.</p>
        </header>
        {results.length === 0 ? (
          <EmptyState icon={Compass} title="Nothing fits every answer" actions={
            <>
              <button type="button" className="btn btn-primary" onClick={() => setAnswers((a) => ({ ...a, season: 'any', effort: 'challenging' }))}>Broaden season and effort</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setDone(false); setStep(2); }}>Change my answers</button>
            </>
          }>
            Your season, trip length and effort level rule out most places. Broaden one of them, or explore every place instead.
          </EmptyState>
        ) : (
          <ol className="quiz-results">
            {results.map((r, i) => (
              <motion.li key={r.destination.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                <DestinationCard destination={r.destination} variant="list" index={i + 1} extra={
                  <div className="fit-box">
                    <span className={cx('fit-label', `fit-label--${r.fit.split(' ')[0].toLowerCase()}`)}>{r.fit}</span>
                    <ul>{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                } />
              </motion.li>
            ))}
          </ol>
        )}
        <div className="quiz-actions">
          {results.length > 0 && <button type="button" className="btn btn-accent" onClick={askConcierge}><Compass size={16} aria-hidden="true" /> Get an itinerary from the concierge</button>}
          {results.length > 1 && <button type="button" className="btn btn-ghost" onClick={() => { app.setComparison(results.slice(0, 3).map((r) => r.destination.id)); navigate('/compare'); }}><Scale size={16} aria-hidden="true" /> Compare top {Math.min(3, results.length)}</button>}
          <button type="button" className="btn btn-ghost" onClick={() => { setDone(false); setStep(total - 1); }}><ChevronLeft size={16} aria-hidden="true" /> Edit answers</button>
          <button type="button" className="btn btn-ghost" onClick={restart}><RotateCcw size={16} aria-hidden="true" /> Start again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page container-narrow page--quiz">
      <header className="quiz-head">
        <Eyebrow>Quiz me</Eyebrow>
        <p className="quiz-progress-label" aria-live="polite">Question {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
        <div className="quiz-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label="Quiz progress"><span style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
      </header>
      <AnimatePresence mode="wait">
        <motion.fieldset key={q.id} className="quiz-step" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
          <legend><h1 className="quiz-title">{q.title}</h1></legend>
          {q.hint && <p className="muted">{q.hint}</p>}
          <div className={cx('quiz-options', q.options.length > 5 && 'quiz-options--many')}>
            {q.options.map((o) => {
              const on = q.type === 'multi' ? (answers[q.id] || []).includes(o.id) : answers[q.id] === o.id;
              return (
                <button key={o.id} type="button" className={cx('quiz-option', on && 'is-on')} aria-pressed={on} onClick={() => choose(o.id)}>
                  {o.icon && <o.icon size={20} aria-hidden="true" />}
                  <span>{o.label}</span>
                  <span className="quiz-option__check" aria-hidden="true">{on ? <Check size={16} /> : null}</span>
                </button>
              );
            })}
          </div>
        </motion.fieldset>
      </AnimatePresence>
      <div className="quiz-nav">
        <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)} disabled={step === 0}><ChevronLeft size={16} aria-hidden="true" /> Back</button>
        {q.optional && (answers[q.id] || []).length === 0 && <button type="button" className="btn-link-plain" onClick={next}>Skip</button>}
        <button type="button" className="btn btn-primary" onClick={next} disabled={!answered}>{step === total - 1 ? 'See my shortlist' : 'Continue'} <ChevronRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

// Stories, Toolkit & Compare Views

// Story photo selector
const STORY_IMAGE_HINTS = {
  'lahore-walled-city-after-dark': ['wazir', 'delhi gate', 'walled', 'night', 'food street'],
  'reading-the-stones-of-makli': ['tomb', 'makli', 'carv'],
  'karakoram-highway-slowly': ['karakoram', 'highway', 'kkh', 'road', 'passu'],
  'spring-blossom-high-valleys': ['blossom', 'cherry', 'apricot', 'spring', 'pink'],
  'makran-coast-kund-malir': ['kund malir', 'beach', 'princess', 'coast'],
  'guest-not-spectator-kalash': ['bumburet', 'village', 'valley'],
  'leave-no-trace-above-treeline': ['saif', 'lake', 'meadow'],
  'light-at-deosai': ['sheosar', 'deosai', 'plain'],
  'what-to-eat-in-the-north': ['bazaar', 'karimabad', 'apricot', 'altit', 'shigar'],
};
function storyImage(s) {
  const pool = s.destinationIds.flatMap((id) => destinationMedia(id).gallery);
  if (!pool.length) return null;
  const hints = STORY_IMAGE_HINTS[s.id] || [];
  const heroes = new Set(s.destinationIds.map((id) => destinationMedia(id).hero?.id));
  const others = pool.filter((img) => !heroes.has(img.id));
  const matches = (img) => hints.some((h) => `${img.title} ${img.alt} ${img.caption}`.toLowerCase().includes(h));
  // Prefer a matching photo that isn't a destination's cover, so stories don't repeat cover images.
  return others.find(matches) || (others.length ? others[STORIES.indexOf(s) % others.length] : pool.find(matches) || pool[0]);
}

const storyWords = (s) => [s.dek, ...s.sections.flatMap((x) => [x.heading, x.body])].join(' ').split(/\s+/).length;
const readMinutes = (s) => Math.max(1, Math.round(storyWords(s) / 200));

function StoryCard({ story: s, variant = 'default' }) {
  const lead = getDestination(s.destinationIds[0]);
  const { storyBookmarks, toggleStoryBookmark } = useApp();
  const saved = storyBookmarks.includes(s.id);
  return (
    <article className={cx('story-card', `story-card--${variant}`)}>
      <div className="story-card__media"><MediaImage image={storyImage(s)} label={lead?.name} /></div>
      <div className="story-card__body">
        <p className="story-card__cat">{labelOf(STORY_CATEGORIES, s.category)} <span className="muted">· {readMinutes(s)} min read</span></p>
        <h3><Link to={`/stories/${s.id}`} className="stretched">{s.title}</Link></h3>
        <p className="story-card__dek">{s.dek}</p>
      </div>
      <button type="button" className={cx('icon-btn icon-btn--card story-card__save', saved && 'is-on')} aria-pressed={saved} aria-label={saved ? `Remove “${s.title}” from reading list` : `Save “${s.title}” to reading list`} onClick={() => toggleStoryBookmark(s.id)}>
        {saved ? <BookmarkCheck size={18} aria-hidden="true" /> : <Bookmark size={18} aria-hidden="true" />}
      </button>
    </article>
  );
}

function StoriesPage() {
  useDocumentTitle('Stories');
  const [params, setParams] = useSearchParams();
  const cat = params.get('category') || '';
  const q = params.get('q') || '';
  const set = (k, v) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };
  const list = STORIES.filter((s) => (!cat || s.category === cat) && (!q || `${s.title} ${s.dek} ${s.sections.map((x) => x.body).join(' ')}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Stories</Eyebrow>
        <h1>Heritage, food, festivals and the open road</h1>
        <div className="stories-tools">
          <label className="visually-hidden" htmlFor="story-q">Search stories</label>
          <div className="autocomplete"><Search size={18} aria-hidden="true" /><input id="story-q" type="search" className="form-control" placeholder="Search stories" value={q} onChange={(e) => set('q', e.target.value)} /></div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3" role="group" aria-label="Story categories">
          <ToggleChip pressed={!cat} onClick={() => set('category', '')}>All</ToggleChip>
          {STORY_CATEGORIES.map((c) => <ToggleChip key={c.id} pressed={cat === c.id} onClick={() => set('category', cat === c.id ? '' : c.id)}>{c.label}</ToggleChip>)}
        </div>
      </header>
      {list.length === 0 ? (
        <EmptyState icon={BookOpen} title="No stories match" actions={<button type="button" className="btn btn-primary" onClick={() => setParams({})}>Show all stories</button>}>Try another category or a broader word.</EmptyState>
      ) : (
        <div className="story-grid">{list.map((s, i) => <StoryCard key={s.id} story={s} variant={i % 5 === 0 ? 'tall' : 'default'} />)}</div>
      )}
    </div>
  );
}

function StoryPage() {
  const { id } = useParams();
  const s = getStory(id);
  const app = useApp();
  useDocumentTitle(s ? s.title : 'Story not found');
  if (!s) return <NotFoundPage />;
  const dests = s.destinationIds.map(getDestination).filter(Boolean);
  const saved = app.storyBookmarks.includes(s.id);
  const related = STORIES.filter((x) => x.id !== s.id && (x.category === s.category || x.destinationIds.some((d) => s.destinationIds.includes(d)))).slice(0, 3);
  return (
    <article className="page page--story">
      <header className="story-hero">
        <MediaImage image={storyImage(s)} className="story-hero__img" eager label={dests[0]?.name} sizes="100vw" />
        <div className="story-hero__shade" aria-hidden="true" />
        <div className="container-narrow story-hero__content">
          <nav aria-label="Breadcrumb" className="breadcrumb-trail"><Link to="/stories">Stories</Link> <ChevronRight size={14} aria-hidden="true" /> <Link to={`/stories?category=${s.category}`}>{labelOf(STORY_CATEGORIES, s.category)}</Link></nav>
          <h1>{s.title}</h1>
          <p className="story-hero__dek">{s.dek}</p>
          <p className="story-hero__meta">{readMinutes(s)} min read</p>
        </div>
      </header>
      <div className="container-narrow story-body">
        <div className="story-actions no-print">
          <button type="button" className={cx('btn btn-ghost btn-sm', saved && 'is-on')} aria-pressed={saved} onClick={() => app.toggleStoryBookmark(s.id)}>{saved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />} {saved ? 'Saved' : 'Save story'}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => shareOrCopy(s.title, window.location.href, app.notify)}><Share2 size={16} aria-hidden="true" /> Share</button>
        </div>
        {s.sections.map((sec, i) => (
          <section key={sec.heading}>
            <h2>{sec.heading}</h2>
            <p>{sec.body}</p>
            {i === 0 && <blockquote className="pull-quote">{s.pullQuote}</blockquote>}
          </section>
        ))}
        <aside className="story-places" aria-label="Places in this story">
          <h2 className="h-sub"><MapPin size={18} aria-hidden="true" /> Places in this story</h2>
          <div className="story-places__list">
            {dests.map((d) => (
              <div key={d.id} className="story-place">
                <DestinationImage destination={d} className="story-place__img" />
                <div>
                  <Link to={`/destinations/${d.id}`}><strong>{d.name}</strong></Link>
                  <p className="muted small mb-1">{d.tagline}</p>
                  <button type="button" className="btn-link-plain small" onClick={() => app.requestAddToTrip(d.id)}><Plus size={13} aria-hidden="true" /> Add to trip</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section section--paper no-print" aria-labelledby="more-stories">
          <div className="container-wide">
            <SectionHeading id="more-stories" eyebrow="Keep reading" title="More stories" />
            <div className="story-row">{related.map((r) => <StoryCard key={r.id} story={r} />)}</div>
          </div>
        </section>
      )}
    </article>
  );
}

// Travel toolkit
function BudgetCalculator() {
  const [b, setB] = useState({ ...DEFAULT_BUDGET, roomRate: 8000, foodPerPersonPerDay: 2500, transport: 30000, activities: 5000 });
  const set = (k) => (v) => setB((x) => ({ ...x, [k]: v }));
  const result = calculateBudget(b);
  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <p className="muted small">Starter figures are examples to edit, not quotes. Replace them with prices you’ve been given.</p>
        <div className="row g-3">
          <div className="col-6 col-md-4"><Field label="Travellers"><NumberInput min={1} value={b.travellers} onChange={set('travellers')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Days"><NumberInput min={1} value={b.days} onChange={set('days')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Nights"><NumberInput min={0} value={b.nights} onChange={set('nights')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Rooms"><NumberInput min={0} value={b.rooms} onChange={set('rooms')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Room rate / night"><NumberInput step={500} value={b.roomRate} onChange={set('roomRate')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Food / person / day"><NumberInput step={100} value={b.foodPerPersonPerDay} onChange={set('foodPerPersonPerDay')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Transport (total)"><NumberInput step={500} value={b.transport} onChange={set('transport')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Activities & entry"><NumberInput step={500} value={b.activities} onChange={set('activities')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Other"><NumberInput step={500} value={b.other} onChange={set('other')} /></Field></div>
          <div className="col-6 col-md-4"><Field label="Contingency %"><NumberInput value={b.contingencyPct} onChange={set('contingencyPct')} /></Field></div>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="panel">
          <h3 className="h-sub">Estimate</h3>
          <p className="muted small">Accommodation = rate × nights × rooms. Food = per-person rate × travellers × days. Contingency is applied to the subtotal.</p>
          <BudgetSummary result={result} />
          <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => setB({ ...DEFAULT_BUDGET })}><RotateCcw size={14} aria-hidden="true" /> Reset to zero</button>
        </div>
      </div>
    </div>
  );
}

function PackingList() {
  const { packing, setPacking } = useApp();
  const [config, setConfig] = useState(packing?.config || { season: 'summer', activities: ['culture'], days: 4 });
  const [newItem, setNewItem] = useState('');
  const items = packing?.items || [];
  const generate = () => setPacking({ config, items: buildPackingList(config) });
  const update = (fn) => setPacking((p) => ({ config: p?.config || config, items: fn(p?.items || []) }));
  const done = items.filter((i) => i.done).length;
  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="panel">
          <Field label="Season"><select className="form-select" value={config.season} onChange={(e) => setConfig((c) => ({ ...c, season: e.target.value }))}>{SEASONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></Field>
          <Field label="Trip length (days)"><NumberInput min={1} value={config.days} onChange={(v) => setConfig((c) => ({ ...c, days: v }))} /></Field>
          <fieldset className="filter-group"><legend>Activities</legend><div className="filter-group__chips">
            {Object.keys(PACKING_RULES.activities).map((a) => <ToggleChip key={a} pressed={config.activities.includes(a)} onClick={() => setConfig((c) => ({ ...c, activities: c.activities.includes(a) ? c.activities.filter((x) => x !== a) : [...c.activities, a] }))}>{a[0].toUpperCase() + a.slice(1)}</ToggleChip>)}
          </div></fieldset>
          <button type="button" className="btn btn-primary w-100" onClick={generate}><Backpack size={16} aria-hidden="true" /> {items.length ? 'Rebuild my list' : 'Build my list'}</button>
          {items.length > 0 && <p className="muted small mt-2">Rebuilding replaces your current list, including items you added.</p>}
        </div>
      </div>
      <div className="col-lg-7">
        {items.length === 0 ? (
          <EmptyState icon={Backpack} title="Your packing list will appear here">Choose a season, length and activities, then build your list. It’s saved in this browser.</EmptyState>
        ) : (
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h3 className="h-sub mb-0">Packing list</h3>
              <span className="muted small" aria-live="polite">{done} of {items.length} packed</span>
            </div>
            <div className="quiz-progress mb-3" aria-hidden="true"><span style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} /></div>
            <ul className="check-list">
              {items.map((it) => (
                <li key={it.id} className={cx(it.done && 'is-done')}>
                  <label className="check-row">
                    <input type="checkbox" className="form-check-input" checked={it.done} onChange={() => update((list) => list.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))} />
                    <span>{it.label}</span>
                  </label>
                  <button type="button" className="icon-btn icon-btn--sm" onClick={() => update((list) => list.filter((x) => x.id !== it.id))} aria-label={`Remove ${it.label}`}><X size={15} aria-hidden="true" /></button>
                </li>
              ))}
            </ul>
            <form className="inline-form mt-3" onSubmit={(e) => { e.preventDefault(); if (!newItem.trim()) return; update((list) => [...list, { id: uid('item'), label: newItem.trim(), done: false, custom: true }]); setNewItem(''); }}>
              <Field label="Add an item"><input className="form-control" value={newItem} onChange={(e) => setNewItem(e.target.value)} maxLength={80} placeholder="e.g. Altitude sickness tablets" /></Field>
              <button type="submit" className="btn btn-ghost" disabled={!newItem.trim()}><Plus size={16} aria-hidden="true" /> Add</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolkitPage() {
  useDocumentTitle('Travel toolkit');
  const { requestAddToTrip } = useApp();
  const { hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); }, [hash]);
  return (
    <div className="page">
      <header className="page-head page-head--plain container-wide">
        <Eyebrow>Travel toolkit</Eyebrow>
        <h1>Budget, pack and time it right</h1>
        <nav className="toc" aria-label="On this page"><a href="#budget">Budget calculator</a><a href="#packing">Packing list</a><a href="#seasons">Seasonal guide</a><a href="#routes">Routes</a></nav>
      </header>
      <section id="budget" className="section container-wide" aria-labelledby="budget-h"><h2 id="budget-h" className="h-section">Budget calculator</h2><BudgetCalculator /></section>
      <section id="packing" className="section section--stone" aria-labelledby="packing-h"><div className="container-wide"><h2 id="packing-h" className="h-section">Packing list</h2><PackingList /></div></section>
      <section id="seasons" className="section container-wide" aria-labelledby="seasons-h">
        <h2 id="seasons-h" className="h-section">Seasonal guide</h2>
        <div className="season-grid">
          {SEASONS.map((s) => (
            <div key={s.id} className="season-card">
              <h3><s.icon size={18} aria-hidden="true" /> {s.label} <span className="muted small">{s.months}</span></h3>
              <p>{SEASON_GUIDE[s.id].note}</p>
              <ul className="plain-list">{SEASON_GUIDE[s.id].picks.map((id) => <li key={id}><Link to={`/destinations/${id}`}>{getDestination(id).name}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <p className="muted small mt-3">Mountain weather and road access vary every year. Use these as a starting point and confirm conditions locally before travelling.</p>
      </section>
      <section id="routes" className="section section--ink" aria-labelledby="routes-h">
        <div className="container-wide">
          <h2 id="routes-h" className="h-section">Suggested routes</h2>
          <div className="route-grid">
            {CURATED_ROUTES.map((r) => {
              const stops = r.stops.map(getDestination);
              return (
                <article key={r.id} className="route-card">
                  <h3>{r.title}</h3>
                  <p className="muted-light small">{r.days}</p>
                  <ol className="route-card__stops">{stops.map((d) => <li key={d.id}><Link to={`/destinations/${d.id}`}>{d.name}</Link></li>)}</ol>
                  <p className="small">{r.note}</p>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-accent btn-sm" onClick={() => requestAddToTrip(r.stops)}><Plus size={14} aria-hidden="true" /> Add route to a trip</button>
                    <a className="btn btn-outline-light-soft btn-sm" href={mapsRouteUrl(null, stops.map((d) => d.coords))} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Compare
function ComparePage() {
  useDocumentTitle('Compare destinations');
  const { comparison, toggleCompare, setComparison, requestAddToTrip } = useApp();
  const [adding, setAdding] = useState('');
  const items = comparison.map(getDestination).filter(Boolean);
  const rows = [
    { label: 'Region', get: (d) => regionName(d.region) },
    { label: 'Best time', get: (d) => d.bestMonths },
    { label: 'Suggested stay', get: (d) => durationLabel(d.durationDays) },
    { label: 'Effort', get: (d) => labelOf(DIFFICULTIES, d.difficulty) },
    { label: 'Budget feel', get: (d) => labelOf(BUDGETS, d.budget) },
    { label: 'Good for', get: (d) => d.companions.map((c) => labelOf(COMPANIONS, c)).join(', ') },
    { label: 'Style', get: (d) => d.styles.map((s) => labelOf(STYLES, s)).join(', ') },
    { label: 'Activities', get: (d) => d.categories.map((c) => labelOf(CATEGORIES, c)).join(', ') },
    { label: 'Tours from', get: (d) => { const p = lowestPrice(d.id); return p ? `${formatPkr(p)} (sourced starting rate)` : null; } },
    { label: 'Highlights', get: (d) => d.highlights.slice(0, 3).join('; ') },
  ].filter((r) => items.some((d) => r.get(d))); // hide rows with no reliable values for any item
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Compare</Eyebrow>
        <h1>Side by side</h1>
        <p className="page-lead">Compare up to three places. Your selection is saved in this browser.</p>
      </header>
      {items.length < 3 && (
        <div className="inline-form mb-4">
          <Field label="Add a place to compare">
            <select className="form-select" value={adding} onChange={(e) => setAdding(e.target.value)}>
              <option value="">Choose a destination</option>
              {DESTINATIONS.filter((d) => !comparison.includes(d.id)).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <button type="button" className="btn btn-primary" disabled={!adding} onClick={() => { toggleCompare(adding); setAdding(''); }}>Add</button>
          {items.length > 0 && <button type="button" className="btn btn-ghost" onClick={() => setComparison([])}>Clear all</button>}
        </div>
      )}
      {items.length === 0 ? (
        <EmptyState icon={Scale} title="Nothing to compare yet" actions={<Link to="/explore" className="btn btn-primary">Browse destinations</Link>}>Use the scales button on any destination card to add it here.</EmptyState>
      ) : (
        <div className="table-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col"><span className="visually-hidden">Attribute</span></th>
                {items.map((d) => (
                  <th key={d.id} scope="col">
                    <DestinationImage destination={d} className="compare-table__img" />
                    <Link to={`/destinations/${d.id}`} className="compare-table__name">{d.name}</Link>
                    <div className="d-flex gap-1 mt-2 flex-wrap">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => requestAddToTrip(d.id)}><Plus size={14} aria-hidden="true" /> Trip</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleCompare(d.id)}><X size={14} aria-hidden="true" /> Remove</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {items.map((d) => <td key={d.id} data-label={d.name}>{r.get(d) || <span className="muted">Not specified</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Saved places and collections
function SavedPage() {
  useDocumentTitle('Saved and passport');
  const app = useApp();
  const { hash } = useLocation();
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [newName, setNewName] = useState('');
  const [toDelete, setToDelete] = useState(null);
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); }, [hash]);
  const visitedRegions = new Set(app.visited.map((id) => getDestination(id).region));
  const visitedCats = new Set(app.visited.flatMap((id) => getDestination(id).categories));
  const pct = Math.round((app.visited.length / DESTINATIONS.length) * 100);
  const trailblazer = app.plan.id === 'trailblazer';
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Saved</Eyebrow>
        <h1>Your places</h1>
        {!app.storageAvailable && <p className="note"><AlertCircle size={14} aria-hidden="true" /> Your browser is blocking storage, so saved items will be lost when you close this tab.</p>}
      </header>

      <section className="section-tight" aria-labelledby="fav-h">
        <h2 id="fav-h" className="h-section"><Heart size={20} aria-hidden="true" /> Favourites</h2>
        {app.favorites.length ? (
          <div className="result-grid">{app.favorites.map((id) => <DestinationCard key={id} destination={getDestination(id)} />)}</div>
        ) : (
          <EmptyState icon={Heart} title="No favourites yet" actions={<><Link to="/explore" className="btn btn-primary">Explore places</Link><Link to="/quiz" className="btn btn-ghost">Quiz me</Link></>}>Tap the heart on any destination to keep it here.</EmptyState>
        )}
      </section>

      <section className="section-tight" aria-labelledby="col-h">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
          <h2 id="col-h" className="h-section mb-0"><Bookmark size={20} aria-hidden="true" /> Collections</h2>
          <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (newName.trim() && app.createCollection(newName)) { app.notify(`Created “${newName.trim()}”`); setNewName(''); } }}>
            <Field label="New collection"><input className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={60} placeholder="e.g. Honeymoon ideas" /></Field>
            <button type="submit" className="btn btn-ghost" disabled={!newName.trim()}><Plus size={16} aria-hidden="true" /> Create</button>
          </form>
        </div>
        {app.collections.length === 0 ? <p className="muted mt-3">Group places into named collections — use “Add to collection” on any destination page.</p> : (
          <div className="collection-list">
            {app.collections.map((c) => (
              <div key={c.id} className="collection">
                <div className="collection__head">
                  {renaming === c.id ? (
                    <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (renameValue.trim()) { app.renameCollection(c.id, renameValue.trim()); setRenaming(null); } }}>
                      <label className="visually-hidden" htmlFor={`rn-${c.id}`}>Collection name</label>
                      <input id={`rn-${c.id}`} className="form-control form-control-sm" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} maxLength={60} autoFocus />
                      <button type="submit" className="btn btn-primary btn-sm">Save</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRenaming(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <h3>{c.name} <span className="muted small">{c.destinationIds.length} places</span></h3>
                      <div className="d-flex gap-1">
                        <button type="button" className="icon-btn icon-btn--sm" aria-label={`Rename ${c.name}`} onClick={() => { setRenaming(c.id); setRenameValue(c.name); }}><Pencil size={15} aria-hidden="true" /></button>
                        <button type="button" className="icon-btn icon-btn--sm" aria-label={`Delete ${c.name}`} onClick={() => setToDelete(c)}><Trash2 size={15} aria-hidden="true" /></button>
                      </div>
                    </>
                  )}
                </div>
                {c.destinationIds.length ? (
                  <ul className="collection__items">
                    {c.destinationIds.map((id) => { const d = getDestination(id); return d ? (
                      <li key={id}>
                        <DestinationImage destination={d} className="collection__img" />
                        <Link to={`/destinations/${id}`}>{d.name}</Link>
                        <button type="button" className="icon-btn icon-btn--sm" aria-label={`Remove ${d.name} from ${c.name}`} onClick={() => app.toggleInCollection(c.id, id)}><X size={14} aria-hidden="true" /></button>
                      </li>
                    ) : null; })}
                  </ul>
                ) : <p className="muted small">Empty — add places from their destination pages.</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {app.storyBookmarks.length > 0 && (
        <section className="section-tight" aria-labelledby="read-h">
          <h2 id="read-h" className="h-section"><BookOpen size={20} aria-hidden="true" /> Reading list</h2>
          <div className="story-row">{app.storyBookmarks.map(getStory).filter(Boolean).map((s) => <StoryCard key={s.id} story={s} />)}</div>
        </section>
      )}

      {app.recent.length > 0 && (
        <section className="section-tight" aria-labelledby="recent-h">
          <h2 id="recent-h" className="h-section"><Clock size={20} aria-hidden="true" /> Recently viewed</h2>
          <ul className="recent-list">{app.recent.map((id) => { const d = getDestination(id); return <li key={id}><Link to={`/destinations/${id}`}><DestinationImage destination={d} /><span>{d.name}</span></Link></li>; })}</ul>
        </section>
      )}

      <section id="passport" className="passport" aria-labelledby="passport-h">
        <ContourArt className="passport__contours" tone="dark" />
        <div className="passport__head">
          <div>
            <Eyebrow tone="saffron">Discovery passport</Eyebrow>
            <h2 id="passport-h">{app.visited.length} of {DESTINATIONS.length} places stamped</h2>
            <p className="muted-light small">Your own record of places you’ve been — not an official or verified travel document.</p>
          </div>
          <div className="passport__meter" role="img" aria-label={`${pct}% of destinations visited`}><span style={{ '--pct': `${pct}%` }} /><strong>{pct}%</strong></div>
        </div>
        <p className="passport__stats">{visitedRegions.size} of {REGIONS.length} regions · {visitedCats.size} of {CATEGORIES.length} kinds of place</p>
        <ul className="stamp-grid">
          {DESTINATIONS.map((d) => {
            const on = app.visited.includes(d.id);
            return (
              <li key={d.id}>
                <button type="button" className={cx('stamp', on && 'is-on')} aria-pressed={on} onClick={() => app.toggleVisited(d.id)}>
                  <span className="stamp__ring" aria-hidden="true">{on ? <BadgeCheck size={20} /> : REGIONS.find((r) => r.id === d.region).short}</span>
                  <span className="stamp__name">{d.name}</span>
                  <span className="visually-hidden">{on ? '(visited — select to unmark)' : '(select to mark as visited)'}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {trailblazer && (
          <div className="passport__challenges">
            <h3 className="h-sub">Regional challenges</h3>
            <ul className="plain-list">{REGIONS.map((r) => { const all = DESTINATIONS.filter((d) => d.region === r.id); const got = all.filter((d) => app.visited.includes(d.id)).length; return <li key={r.id}>{r.name}: {got}/{all.length} {got === all.length && <BadgeCheck size={14} aria-label="complete" />}</li>; })}</ul>
          </div>
        )}
        {!trailblazer && <p className="small mt-3 mb-0"><Link to="/membership" className="link-light">Trailblazer</Link> adds regional challenges to your passport.</p>}
      </section>

      <ConfirmDialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Delete collection?" confirmLabel="Delete" danger onConfirm={() => { app.deleteCollection(toDelete.id); app.notify(`Deleted “${toDelete.name}”`); }}>
        “{toDelete?.name}” will be removed. The places themselves stay in the catalogue and in your favourites.
      </ConfirmDialog>
    </div>
  );
}

// Account & Membership Views

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function PasswordInput({ value, onChange, autoComplete, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrap">
      <input type={show ? 'text' : 'password'} className="form-control" value={value} onChange={onChange} autoComplete={autoComplete} {...rest} />
      <button type="button" className="icon-btn icon-btn--sm password-wrap__toggle" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
        {show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}

function AuthForms() {
  const { profile, setProfile, notify } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') || 'signin');
  const [form, setForm] = useState({ name: '', email: profile.email || '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [resetSent, setResetSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const next = params.get('next');

  const finish = (p) => {
    setProfile(p);
    setForm((f) => ({ ...f, password: '', confirm: '' })); // never keep the password around
    if (next) navigate(`/${next}`);
  };
  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (mode !== 'signin' && mode !== 'reset' && form.name.trim().length < 2) err.name = 'Enter your name (at least 2 characters).';
    if (!EMAIL_RE.test(form.email.trim())) err.email = 'Enter a valid email address, like name@example.com.';
    if (mode === 'register') {
      if (form.password.length < 8) err.password = 'Use at least 8 characters.';
      if (form.confirm !== form.password) err.confirm = 'Passwords don’t match.';
    }
    if (mode === 'signin' && !form.password) err.password = 'Enter your password.';
    if (mode === 'signin' && !err.email && form.email.trim().toLowerCase() !== (profile.email || '').toLowerCase()) err.email = 'No profile with that email exists in this browser. Create one instead.';
    setErrors(err);
    if (Object.keys(err).length) return;
    if (mode === 'reset') { setResetSent(true); return; }
    if (mode === 'register') {
      finish({ signedIn: true, name: form.name.trim(), email: form.email.trim(), membership: 'explorer', joinedAt: new Date().toISOString() });
      notify(`Welcome, ${form.name.trim()} — your profile is ready`);
    } else {
      finish({ ...profile, signedIn: true });
      notify(`Welcome back, ${profile.name}`);
    }
  };
  const tabs = [{ id: 'signin', label: 'Sign in' }, { id: 'register', label: 'Create profile' }, { id: 'reset', label: 'Forgot password' }];
  return (
    <div className="auth-card">
      <div className="segmented segmented--wide" role="tablist" aria-label="Account options">
        {tabs.map((t) => <button key={t.id} type="button" role="tab" aria-selected={mode === t.id} className={cx(mode === t.id && 'is-on')} onClick={() => { setMode(t.id); setErrors({}); setResetSent(false); }}>{t.label}</button>)}
      </div>
      <AnimatePresence mode="wait" initial={false}>
      <motion.div key={`${mode}-${resetSent}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: MOTION.fast + 0.06, ease: MOTION.ease }}>
      {mode === 'reset' && resetSent ? (
        <div className="callout callout--plain mt-4" role="status">
          <Info size={18} aria-hidden="true" />
          <div>
            <strong>There’s nothing to reset</strong>
            <p>Passwords aren’t stored on this device. Sign in with your email to reopen your profile, or create a new one.</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setMode('signin'); setResetSent(false); }}>Back to sign in</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-4">
          {mode === 'register' && <Field label="Name" error={errors.name}><input className="form-control" value={form.name} onChange={set('name')} autoComplete="name" /></Field>}
          <Field label="Email" error={errors.email}><input type="email" className="form-control" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
          {mode !== 'reset' && (
            <Field label="Password" error={errors.password} hint={mode === 'register' ? 'At least 8 characters.' : undefined}>
              <PasswordInput value={form.password} onChange={set('password')} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
            </Field>
          )}
          {mode === 'register' && <Field label="Confirm password" error={errors.confirm}><PasswordInput value={form.confirm} onChange={set('confirm')} autoComplete="new-password" /></Field>}
          <button type="submit" className="btn btn-primary w-100">{mode === 'signin' ? 'Sign in' : mode === 'register' ? 'Create profile' : 'Reset password'}</button>
          <p className="muted small mt-3 mb-0"><Lock size={13} aria-hidden="true" /> Your profile is kept in this browser only. Passwords are never saved, and anyone using this browser can open the profile.</p>
        </form>
      )}
      </motion.div>
      </AnimatePresence>
      <p className="mt-4 mb-0 text-center"><Link to="/explore">Continue as a guest</Link></p>
    </div>
  );
}

function AccountPage() {
  const app = useApp();
  const { profile, setProfile, preferences, setPreferences, plan, notify } = app;
  useDocumentTitle(profile.signedIn ? 'Your account' : 'Sign in');
  const [draft, setDraft] = useState({ name: profile.name, homeCity: preferences.homeCity, interests: preferences.interests || [], pace: preferences.pace });
  const [nameError, setNameError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);
  useEffect(() => { setDraft({ name: profile.name, homeCity: preferences.homeCity, interests: preferences.interests || [], pace: preferences.pace }); }, [profile.name, preferences]);

  if (!profile.signedIn) {
    const art = extraMedia('generated-01-mountain-road-sunrise');
    return (
      <div className="account-split">
        <motion.aside className="account-art" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: MOTION.slow, ease: MOTION.ease }}>
          {art ? <img src={art.path} alt="" className="account-art__img" /> : <ContourArt className="account-art__contours" tone="dark" />}
          <div className="account-art__shade" aria-hidden="true" />
          <div className="account-art__copy">
            <Eyebrow tone="saffron">Your travel journal</Eyebrow>
            <h1>Keep every road you mean to take.</h1>
            <ul className="account-art__benefits">
              <li><RouteIcon size={18} aria-hidden="true" /> Trips, routes and notes stay with you on this device.</li>
              <li><BadgeCheck size={18} aria-hidden="true" /> Stamp each place you reach in your discovery passport.</li>
            </ul>
            {art && <p className="account-art__tag">Editorial artwork</p>}
          </div>
        </motion.aside>
        <motion.section className="account-form" aria-labelledby="account-form-title" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: MOTION.slow, delay: 0.08, ease: MOTION.ease }}>
          <div className="account-form__inner">
            <h2 id="account-form-title">Sign in or create a profile</h2>
            <p className="muted">Explore, save and plan as a guest anytime. A profile adds your name, preferences and membership on this browser.</p>
            <AuthForms />
          </div>
        </motion.section>
      </div>
    );
  }
  const save = (e) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) { setNameError('Enter your name (at least 2 characters).'); return; }
    setNameError('');
    setProfile({ ...profile, name: draft.name.trim() });
    setPreferences({ homeCity: draft.homeCity, interests: draft.interests, pace: draft.pace });
    notify('Profile saved');
  };
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Account</Eyebrow>
        <h1>Salaam, {profile.name}</h1>
        <p className="page-lead">Signed in on this device as {profile.email}.</p>
      </header>
      <div className="dash-grid">
        <Link to="/membership" className={cx('dash-card dash-card--plan', `dash-card--${plan.id}`)}><Crown size={20} aria-hidden="true" /><span className="muted small">Membership</span><strong>{plan.name}</strong><span className="small">{plan.pricePkr ? `${formatPkr(plan.pricePkr)} / year` : 'Free'} · Change plan</span></Link>
        <Link to="/plan" className="dash-card"><RouteIcon size={20} aria-hidden="true" /><span className="muted small">Trips</span><strong>{app.trips.length}</strong><span className="small">{Number.isFinite(plan.limits.trips) ? `of ${plan.limits.trips}` : 'Unlimited'}</span></Link>
        <Link to="/saved" className="dash-card"><Heart size={20} aria-hidden="true" /><span className="muted small">Favourites</span><strong>{app.favorites.length}</strong><span className="small">{app.collections.length} collection{app.collections.length === 1 ? '' : 's'}</span></Link>
        <Link to="/saved#passport" className="dash-card"><BadgeCheck size={20} aria-hidden="true" /><span className="muted small">Passport</span><strong>{app.visited.length}/{DESTINATIONS.length}</strong><span className="small">places stamped</span></Link>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <form className="panel" onSubmit={save} noValidate>
            <h2 className="h-sub"><User size={18} aria-hidden="true" /> Profile and preferences</h2>
            <Field label="Name" error={nameError}><input className="form-control" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} autoComplete="name" /></Field>
            <Field label="Home city" hint="Used to suggest nearby trips."><select className="form-select" value={draft.homeCity} onChange={(e) => setDraft((d) => ({ ...d, homeCity: e.target.value }))}>{CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <fieldset className="filter-group"><legend>Interests</legend><div className="filter-group__chips">
              {CATEGORIES.map((c) => <ToggleChip key={c.id} pressed={draft.interests.includes(c.id)} onClick={() => setDraft((d) => ({ ...d, interests: d.interests.includes(c.id) ? d.interests.filter((x) => x !== c.id) : [...d.interests, c.id] }))}>{c.label}</ToggleChip>)}
            </div></fieldset>
            <Field label="Preferred pace"><select className="form-select" value={draft.pace} onChange={(e) => setDraft((d) => ({ ...d, pace: e.target.value }))}>{DIFFICULTIES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
            <button type="submit" className="btn btn-primary">Save profile</button>
          </form>
        </div>
        <div className="col-lg-5">
          <div className="panel">
            <h2 className="h-sub">Suggested for you</h2>
            {(() => {
              const picks = rankDestinations({ interests: draft.interests, from: draft.homeCity, effort: draft.pace, season: 'any' }).slice(0, 3);
              return picks.length ? <ul className="plain-list">{picks.map((r) => <li key={r.destination.id}><Link to={`/destinations/${r.destination.id}`}>{r.destination.name}</Link> <span className="muted small">{r.fit}</span></li>)}</ul> : <p className="muted small">Choose a few interests to see suggestions.</p>;
            })()}
          </div>
          <div className="panel">
            <h2 className="h-sub">This device</h2>
            <p className="small">Signing out keeps your trips and saved places in this browser but switches you back to Explorer limits.</p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => { setProfile({ ...profile, signedIn: false }); notify('Signed out'); }}><LogOut size={16} aria-hidden="true" /> Sign out</button>
              <button type="button" className="btn btn-ghost text-danger-soft" onClick={() => setConfirmRemove(true)}><Trash2 size={16} aria-hidden="true" /> Remove profile</button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog open={confirmRemove} onClose={() => setConfirmRemove(false)} title="Remove your profile?" confirmLabel="Remove profile" danger onConfirm={() => { setProfile(DEFAULT_PROFILE); setPreferences(DEFAULT_PREFERENCES); notify('Profile removed from this device'); }}>
        Your name, email, preferences and membership choice will be removed from this browser. Trips and saved places are kept.
      </ConfirmDialog>
    </div>
  );
}

function MembershipPage() {
  useDocumentTitle('Membership');
  const { profile, setProfile, plan: current, notify } = useApp();
  const [choosing, setChoosing] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const eligible = TOUR_PACKAGES.filter((p) => p.membershipEligibility.length);
  const select = (p) => { setConfirmed(null); setChoosing(p); };
  const confirm = () => {
    setProfile({ ...profile, membership: choosing.id });
    setConfirmed(choosing);
    notify(`You’re now on ${choosing.name}`);
  };
  const benefitRows = [
    { label: 'Trip plans', get: (p) => (Number.isFinite(p.limits.trips) ? `Up to ${p.limits.trips}` : 'Unlimited') },
    { label: 'Collections', get: (p) => (Number.isFinite(p.limits.collections) ? `Up to ${p.limits.collections}` : 'Unlimited') },
    { label: 'Favourites, quiz, concierge, compare', get: () => 'Included' },
    { label: 'Proposed member saving', get: (p) => (p.discountRate ? `${Math.round(p.discountRate * 100)}% on eligible packages` : '—') },
    { label: 'Passport regional challenges', get: (p) => (p.id === 'trailblazer' ? 'Included' : '—') },
  ];
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Membership</Eyebrow>
        <h1>Choose how you travel with us</h1>
        <p className="page-lead">Explorer is free for everyone. Plan prices and benefits below are Explore Pakistan’s proposed programme terms — they are not tour operators’ rates or offers.</p>
      </header>
      <div className="plan-grid">
        {MEMBERSHIP_PLANS.map((p) => {
          const isCurrent = current.id === p.id;
          return (
            <article key={p.id} className={cx('plan-card', `plan-card--${p.id}`, isCurrent && 'is-current')}>
              {isCurrent && <span className="plan-card__badge">Your plan</span>}
              <h2>{p.name}</h2>
              <p className="plan-card__price">{p.pricePkr ? <>{formatPkr(p.pricePkr)}<span> / year</span></> : 'Free'}</p>
              <p className="muted">{p.summary}</p>
              <ul className="tick-list">{p.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
              <button type="button" className={cx('btn w-100', isCurrent ? 'btn-ghost' : 'btn-primary')} disabled={isCurrent} onClick={() => select(p)}>{isCurrent ? 'Current plan' : `Choose ${p.name}`}</button>
            </article>
          );
        })}
      </div>

      <section className="section-tight" aria-labelledby="compare-plans">
        <h2 id="compare-plans" className="h-section">Benefits line by line</h2>
        <div className="table-scroll">
          <table className="compare-table compare-table--plans">
            <thead><tr><th scope="col"><span className="visually-hidden">Benefit</span></th>{MEMBERSHIP_PLANS.map((p) => <th key={p.id} scope="col">{p.name}</th>)}</tr></thead>
            <tbody>{benefitRows.map((r) => <tr key={r.label}><th scope="row">{r.label}</th>{MEMBERSHIP_PLANS.map((p) => <td key={p.id} data-label={p.name}>{r.get(p)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="discount-maths">
        <h2 id="discount-maths" className="h-section">How member savings would work</h2>
        <p className="page-lead">Savings apply only to packages explicitly marked eligible, using: member price = starting rate − (starting rate × saving %), rounded to the nearest rupee. Packages without a sourced price are never discounted. These savings are part of our proposed programme and are not offered by the operators.</p>
        <div className="table-scroll">
          <table className="compare-table">
            <thead><tr><th scope="col">Package</th><th scope="col">Starting rate</th><th scope="col">Explorer Plus (5%)</th><th scope="col">Trailblazer (10%)</th></tr></thead>
            <tbody>
              {eligible.map((pkg) => {
                const plus = memberPrice(pkg, 'plus');
                const tb = memberPrice(pkg, 'trailblazer');
                return (
                  <tr key={pkg.id}>
                    <th scope="row">{pkg.title}<span className="muted small d-block">{pkg.operatorName} · <a href={pkg.sourceUrl} target="_blank" rel="noopener noreferrer">source</a></span></th>
                    <td data-label="Starting rate">{formatPkr(pkg.pricePkr)}</td>
                    <td data-label="Explorer Plus">{plus ? `${formatPkr(plus.price)} (−${formatPkr(plus.discount)})` : 'Not eligible'}</td>
                    <td data-label="Trailblazer">{tb ? `${formatPkr(tb.price)} (−${formatPkr(tb.discount)})` : 'Not eligible'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={Boolean(choosing)} onClose={() => setChoosing(null)} title={confirmed ? 'Plan updated' : `Switch to ${choosing?.name || ''}`}>
        {choosing && (confirmed ? (
          <div className="text-center">
            <CheckCircle2 size={40} className="text-success-soft" aria-hidden="true" />
            <p className="mt-2"><strong>You’re on {confirmed.name}.</strong></p>
            <p className="muted">Your profile on this device has been updated. No payment details were collected and nothing has been charged.</p>
            <button type="button" className="btn btn-primary" onClick={() => setChoosing(null)} data-autofocus>Done</button>
          </div>
        ) : !profile.signedIn ? (
          <div>
            <p>Membership is attached to a profile. Create a free profile on this device first — it takes a few seconds.</p>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/account?mode=register&next=membership" className="btn btn-primary" onClick={() => setChoosing(null)}>Create a profile</Link>
              <Link to="/account?next=membership" className="btn btn-ghost" onClick={() => setChoosing(null)}>Sign in</Link>
            </div>
          </div>
        ) : (
          <div>
            <dl className="detail-list">
              <div><dt>Plan</dt><dd>{choosing.name}</dd></div>
              <div><dt>Price</dt><dd>{choosing.pricePkr ? `${formatPkr(choosing.pricePkr)} per year (proposed)` : 'Free'}</dd></div>
              <div><dt>Includes</dt><dd>{choosing.benefits.join('; ')}</dd></div>
            </dl>
            <p className="muted small">Choosing a plan updates your profile on this device. We don’t collect card details and no charge is made.</p>
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-ghost" onClick={() => setChoosing(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={confirm} data-autofocus>Confirm {choosing.name}</button>
            </div>
          </div>
        ))}
      </Modal>
    </div>
  );
}

// Help & Information Views

function AboutPage() {
  useDocumentTitle('About and responsible travel');
  const notes = [
    { icon: Users, title: 'Respect local customs', body: 'Dress modestly, especially in rural areas and religious sites. Ask before photographing people, and accept a no.' },
    { icon: Trash2, title: 'Carry your rubbish out', body: 'Mountain valleys have little waste collection. Take everything back to town with you.' },
    { icon: Leaf, title: 'Give wildlife space', body: 'Never feed animals or approach them for photos. Keep noise down in parks and meadows.' },
    { icon: Landmark, title: 'Protect heritage', body: 'Don’t climb on ancient walls, touch carvings or take “souvenirs” from sites like Mohenjo-daro or Makli.' },
    { icon: Footprints, title: 'Travel safely', body: 'Check road and weather conditions locally, carry ID, and use experienced drivers on jeep tracks.' },
    { icon: Coins, title: 'Spend locally', body: 'Choose local guides, guesthouses and makers, so tourism income stays in the valleys you visit.' },
  ];
  return (
    <div className="page">
      <header className="page-head page-head--plain container-narrow">
        <Eyebrow>About</Eyebrow>
        <h1>A travel guide that shows its sources</h1>
        <p className="page-lead">Explore Pakistan helps you find places, understand when to go and what to expect, and plan a trip you can actually take. We curate destinations across every province and territory, write our own guides, and link every tour price to the operator’s own page with the date we checked it.</p>
        <p>We don’t sell tours, invent ratings, or claim live conditions we can’t see. When something changes quickly — prices, roads, weather — we say so and point you to the people who know.</p>
      </header>
      <section className="section section--stone" aria-labelledby="resp-h">
        <div className="container-wide">
          <SectionHeading id="resp-h" eyebrow="Responsible travel" title="Leave places better than you found them" />
          <div className="resp-grid">{notes.map((n) => <div key={n.title} className="resp-card"><n.icon size={22} aria-hidden="true" /><h3>{n.title}</h3><p>{n.body}</p></div>)}</div>
        </div>
      </section>
      <section className="section container-narrow" aria-labelledby="links-h">
        <h2 id="links-h" className="h-section">Useful resources</h2>
        <ul className="plain-list">
          <li><ExternalA href="https://whc.unesco.org/en/statesparties/pk">UNESCO World Heritage sites in Pakistan</ExternalA></li>
          <li><ExternalA href="https://visa.nadra.gov.pk/">Pakistan online visa system (NADRA)</ExternalA></li>
          <li><ExternalA href="https://commons.wikimedia.org/wiki/Category:Pakistan">Wikimedia Commons — photography of Pakistan</ExternalA></li>
        </ul>
      </section>
    </div>
  );
}

function FaqPage() {
  useDocumentTitle('FAQ');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(FAQ_ITEMS[0].id);
  const list = FAQ_ITEMS.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page container-narrow">
      <header className="page-head page-head--plain">
        <Eyebrow>Help</Eyebrow>
        <h1>Frequently asked questions</h1>
        <div className="autocomplete mt-3"><Search size={18} aria-hidden="true" /><label htmlFor="faq-q" className="visually-hidden">Search questions</label><input id="faq-q" type="search" className="form-control" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" /></div>
      </header>
      {list.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No questions match" actions={<Link to="/contact" className="btn btn-primary">Ask us instead</Link>}>Try a different word, or send us your question.</EmptyState>
      ) : (
        <div className="accordion-list">
          {list.map((f) => {
            const isOpen = open === f.id || Boolean(q);
            return (
              <div key={f.id} className={cx('acc', isOpen && 'is-open')}>
                <h2 className="acc__h">
                  <button type="button" aria-expanded={isOpen} aria-controls={`faq-${f.id}`} id={`faq-btn-${f.id}`} onClick={() => setOpen(open === f.id ? null : f.id)}>
                    {f.q}<ChevronDown size={18} aria-hidden="true" />
                  </button>
                </h2>
                <div id={`faq-${f.id}`} role="region" aria-labelledby={`faq-btn-${f.id}`} hidden={!isOpen} className="acc__body"><p>{f.a}</p></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WhatsAppMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.52 3.48A11.88 11.88 0 0 0 12.09 0C5.53 0 .19 5.34.19 11.9c0 2.1.55 4.17 1.6 5.99L.1 24l6.28-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9a11.83 11.83 0 0 0-3.47-8.42ZM12.09 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98.99-3.64-.24-.37a9.87 9.87 0 0 1-1.52-5.28c0-5.48 4.46-9.94 9.95-9.94 2.66 0 5.16 1.04 7.04 2.92a9.88 9.88 0 0 1 2.91 7.03c0 5.49-4.46 9.95-9.94 9.95Z" />
      <path d="M17.53 14.37c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.78-1.69-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.07-.81.38s-1.06 1.04-1.06 2.54 1.08 2.94 1.23 3.14c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}

function ContactPage() {
  useDocumentTitle('Contact');
  const { profile, notify } = useApp();
  const [form, setForm] = useState({ name: profile.signedIn ? profile.name : '', email: profile.signedIn ? profile.email : '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 2) err.name = 'Enter your name.';
    if (!EMAIL_RE.test(form.email.trim())) err.email = 'Enter a valid email address, like name@example.com.';
    if (!form.subject) err.subject = 'Choose a topic.';
    if (form.message.trim().length < 15) err.message = 'Write at least 15 characters so we understand your question.';
    setErrors(err);
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setReady(true);
  };
  const body = `${form.message.trim()}\n\nTopic: ${form.subject}\n\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}`;
  const emailSubject = `Explore Pakistan: ${form.subject}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
  const whatsappText = `Hello Explore Pakistan,\n\nTopic: ${form.subject}\n\n${form.message.trim()}\n\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}`;
  const whatsappHref = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
  const directWhatsAppHref = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Explore Pakistan, I have a question about the website.')}`;
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(body);
      notify('Message copied');
    } catch {
      notify('Copy didn’t work — you can select the message text and copy it manually.', { tone: 'warn' });
    }
  };
  return (
    <div className="page container-narrow contact-page">
      <header className="page-head page-head--plain contact-page__head">
        <Eyebrow>Contact</Eyebrow>
        <h1>Let’s talk about your next journey</h1>
        <p className="page-lead">Questions, corrections or feedback are welcome. Reach us directly, or leave a message and choose whether to continue by WhatsApp or email.</p>
      </header>

      <section className="contact-methods" aria-label="Direct contact options">
        <a className="contact-method contact-method--whatsapp" href={directWhatsAppHref} target="_blank" rel="noopener noreferrer">
          <span className="contact-method__icon"><WhatsAppMark size={23} /></span>
          <span className="contact-method__copy"><strong>Chat on WhatsApp</strong><span>{CONTACT_WHATSAPP_DISPLAY}</span><small>Usually the quickest way to reach us</small></span>
          <ArrowRight size={18} aria-hidden="true" className="contact-method__arrow" />
        </a>
        <a className="contact-method contact-method--email" href={`mailto:${CONTACT_EMAIL}`}>
          <span className="contact-method__icon"><Mail size={22} aria-hidden="true" /></span>
          <span className="contact-method__copy"><strong>Email us</strong><span>{CONTACT_EMAIL.split('@')[0]}@<wbr />{CONTACT_EMAIL.split('@').slice(1).join('@')}</span><small>For questions, suggestions and corrections</small></span>
          <ArrowRight size={18} aria-hidden="true" className="contact-method__arrow" />
        </a>
      </section>

      <div className="contact-form-intro">
        <h2 className="h-sub">Send a message</h2>
        <p className="muted">For tour bookings and exact package prices, please contact the operator linked on each package.</p>
      </div>

      {ready ? (
        <div className="panel contact-ready" role="status" aria-live="polite">
          <CheckCircle2 size={32} className="text-success-soft" aria-hidden="true" />
          <h2 className="h-sub mt-2">Thanks, {form.name.trim()} — your message is ready</h2>
          <p>Choose WhatsApp or email to open a prepared message. Nothing is sent until you review and send it in that app.</p>
          <div className="contact-actions">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><WhatsAppMark size={17} /> Send with WhatsApp</a>
            <a href={mailto} className="btn btn-primary"><Mail size={16} aria-hidden="true" /> Open email app</a>
            <button type="button" className="btn btn-ghost" onClick={copyMessage}><Copy size={16} aria-hidden="true" /> Copy message</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setReady(false); setErrors({}); setForm((f) => ({ ...f, subject: '', message: '' })); }}>Write another</button>
          </div>
        </div>
      ) : (
        <form className="panel contact-form" onSubmit={submit} noValidate>
          <div className="row g-3">
            <div className="col-md-6"><Field id="contact-name" label="Name" error={errors.name}><input id="contact-name" name="name" className="form-control" value={form.name} onChange={set('name')} autoComplete="name" required /></Field></div>
            <div className="col-md-6"><Field id="contact-email" label="Email" error={errors.email}><input id="contact-email" name="email" type="email" className="form-control" value={form.email} onChange={set('email')} autoComplete="email" required /></Field></div>
            <div className="col-12"><Field id="contact-subject" label="Topic" error={errors.subject}><select id="contact-subject" name="subject" className="form-select" value={form.subject} onChange={set('subject')} required><option value="">Choose a topic</option><option>Destination information</option><option>Price or source correction</option><option>Membership</option><option>Website feedback</option><option>Something else</option></select></Field></div>
            <div className="col-12"><Field id="contact-message" label="Message" error={errors.message}><textarea id="contact-message" name="message" className="form-control" rows={6} value={form.message} onChange={set('message')} maxLength={2000} placeholder="Tell us how we can help…" required /></Field><div className="contact-form__meta"><span>At least 15 characters</span><span>{form.message.length}/2000</span></div></div>
          </div>
          <div className="contact-form__bottom">
            <button type="submit" className="btn btn-primary"><Send size={16} aria-hidden="true" /> Continue to send</button>
            <span className="note"><Lock size={14} aria-hidden="true" /> Your message opens in the email or WhatsApp app you choose.</span>
          </div>
        </form>
      )}
    </div>
  );
}

function CreditsPage() {
  useDocumentTitle('Photo credits');
  const items = allCreditedMedia();
  const groups = items.reduce((acc, it) => { (acc[it.place] ||= []).push(it.img); return acc; }, {});
  return (
    <div className="page container-wide">
      <header className="page-head page-head--plain">
        <Eyebrow>Credits</Eyebrow>
        <h1>Photo credits</h1>
        <p className="page-lead">Our photographs are reused under the licences their creators chose. Each entry links to the original file page and licence. Digital illustrations and artworks are creative representations of Pakistan's diverse regions.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState icon={Camera} title="No photo credits to show">The photo library hasn’t been added to this build yet.</EmptyState>
      ) : Object.entries(groups).map(([place, imgs]) => (
        <section key={place} className="credits-group" aria-labelledby={`cr-${place}`}>
          <h2 id={`cr-${place}`} className="h-sub">{place}</h2>
          <ul className="credits-list">
            {imgs.map((img) => (
              <li key={img.id}>
                <MediaImage image={img} className="credits-list__img" sizes="88px" />
                <div>
                  <strong>{img.title}</strong>
                  <MediaCredit image={img} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="page container-narrow">
      <EmptyState level={1} icon={Compass} title="This trail doesn’t lead anywhere" actions={<><Link to="/" className="btn btn-primary">Go home</Link><Link to="/explore" className="btn btn-ghost">Explore destinations</Link></>}>
        The page may have moved, or the link was mistyped.
      </EmptyState>
    </div>
  );
}

// Routes & Application Entry

// Error boundary
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[Explore Pakistan] view error', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="page container-narrow">
          <EmptyState level={1} icon={AlertCircle} title="Something went wrong on this page" actions={<><button type="button" className="btn btn-primary" onClick={() => { this.setState({ error: null }); window.location.assign('/'); }}>Go home</button><button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>Reload</button></>}>
            Your saved trips and places are safe in this browser.
          </EmptyState>
        </div>
      );
    }
    return this.props.children;
  }
}

function RoutedErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AppProvider>
          <Layout>
            <RoutedErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/destinations/:id" element={<DestinationPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/plan" element={<PlannerPage />} />
                <Route path="/plan/:tripId" element={<PlannerPage />} />
                <Route path="/concierge" element={<ConciergePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/stories/:id" element={<StoryPage />} />
                <Route path="/toolkit" element={<ToolkitPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/credits" element={<CreditsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </RoutedErrorBoundary>
          </Layout>
        </AppProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
