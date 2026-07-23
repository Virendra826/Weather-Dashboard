const sky = document.getElementById('sky');
const particles = document.getElementById('particles');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const msgArea = document.getElementById('msgArea');

const hero = document.getElementById('hero');
const stats = document.getElementById('stats');
const forecastTitle = document.getElementById('forecastTitle');
const forecastRow = document.getElementById('forecastRow');

/* ---------------- icons ---------------- */
function iconSVG(kind, size=64){
  const s = size;
  const icons = {
    'clear-day': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="22" fill="#FFB84D"/><g stroke="#FFB84D" stroke-width="4" stroke-linecap="round">
      <line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/>
      <line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/>
      <line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/>
      <line x1="80" y1="20" x2="72" y2="28"/><line x1="28" y1="72" x2="20" y2="80"/>
      </g></svg>`,
    'clear-night': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M62 20 A32 32 0 1 0 80 68 A26 26 0 0 1 62 20 Z" fill="#C9CFE0"/></svg>`,
    'clouds': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><ellipse cx="42" cy="60" rx="26" ry="18" fill="#E4EAF5"/><ellipse cx="62" cy="52" rx="20" ry="16" fill="#F2F5FA"/><ellipse cx="30" cy="52" rx="16" ry="13" fill="#F2F5FA"/></svg>`,
    'partly-day': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><circle cx="38" cy="38" r="16" fill="#FFB84D"/><ellipse cx="55" cy="62" rx="26" ry="17" fill="#F2F5FA"/></svg>`,
    'partly-night': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M45 18 A18 18 0 1 0 58 48 A15 15 0 0 1 45 18 Z" fill="#C9CFE0"/><ellipse cx="55" cy="65" rx="26" ry="17" fill="#DDE4F2"/></svg>`,
    'rain': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><ellipse cx="45" cy="42" rx="26" ry="17" fill="#DDE4F2"/><g stroke="#8FD3F4" stroke-width="4" stroke-linecap="round"><line x1="32" y1="68" x2="26" y2="86"/><line x1="50" y1="68" x2="44" y2="86"/><line x1="68" y1="68" x2="62" y2="86"/></g></svg>`,
    'thunderstorm': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><ellipse cx="45" cy="38" rx="26" ry="16" fill="#C6CEE0"/><polygon points="48,58 36,78 46,78 40,94 62,68 50,68 56,58" fill="#FFB84D"/></svg>`,
    'snow': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><ellipse cx="45" cy="40" rx="26" ry="16" fill="#E4EAF5"/><g fill="#F7F9FC"><circle cx="30" cy="72" r="3.5"/><circle cx="48" cy="80" r="3.5"/><circle cx="66" cy="72" r="3.5"/></g></svg>`,
    'mist': `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><g stroke="#DDE4F2" stroke-width="5" stroke-linecap="round"><line x1="20" y1="38" x2="80" y2="38"/><line x1="14" y1="52" x2="86" y2="52"/><line x1="24" y1="66" x2="76" y2="66"/></g></svg>`
  };
  return icons[kind] || icons['clouds'];
}

/* Normalize a condition string into an icon key + sky category */
function normalizeCondition(cond){
  const c = (cond || '').toLowerCase();
  if(c.includes('thunder')) return 'thunderstorm';
  if(c.includes('snow')) return 'snow';
  if(c.includes('drizzle')) return 'drizzle';
  if(c.includes('rain') || c.includes('shower')) return 'rain';
  if(c.includes('mist') || c.includes('fog') || c.includes('haze') || c.includes('smoke')) return 'mist';
  if(c.includes('partly') || c.includes('few clouds') || c.includes('scattered')) return 'clouds-partly';
  if(c.includes('cloud') || c.includes('overcast')) return 'clouds';
  if(c.includes('clear') || c.includes('sunny')) return 'clear';
  return 'clouds';
}

function mapIcon(main, isDay){
  main = main.toLowerCase();
  if(main === 'clear') return isDay ? 'clear-day' : 'clear-night';
  if(main === 'clouds-partly') return isDay ? 'partly-day' : 'partly-night';
  if(main === 'clouds') return 'clouds';
  if(main === 'rain' || main === 'drizzle') return 'rain';
  if(main === 'thunderstorm') return 'thunderstorm';
  if(main === 'snow') return 'snow';
  if(main === 'mist') return 'mist';
  return 'clouds';
}

/* ---------------- sky + particles ---------------- */
function clearParticles(){ particles.innerHTML = ''; }

function setSky(main, isDay){
  main = main.toLowerCase();
  if(main === 'clouds-partly') main = 'clouds';
  clearParticles();
  let gradient, sunMoon = '';

  if(main === 'clear'){
    gradient = isDay
      ? 'linear-gradient(160deg, #4A90D9 0%, #6FB3E8 50%, #BEE0F5 100%)'
      : 'linear-gradient(160deg, #0B1230 0%, #1A2456 55%, #2D3B7A 100%)';
    sunMoon = isDay ? '<div class="sun"></div>' : buildStars() + '<div class="moon"></div>';
  } else if(main === 'clouds'){
    gradient = isDay
      ? 'linear-gradient(160deg, #7C93B5 0%, #A3B4CC 55%, #C9D3E2 100%)'
      : 'linear-gradient(160deg, #202A45 0%, #33405E 55%, #48557A 100%)';
    sunMoon = buildClouds(isDay);
  } else if(main === 'rain' || main === 'drizzle'){
    gradient = isDay
      ? 'linear-gradient(160deg, #4A5B73 0%, #5F7288 55%, #86949E 100%)'
      : 'linear-gradient(160deg, #131A29 0%, #202B3D 55%, #2E3A4D 100%)';
    sunMoon = buildClouds(isDay);
    buildRain(70);
  } else if(main === 'thunderstorm'){
    gradient = 'linear-gradient(160deg, #22283A 0%, #333B54 55%, #454E6B 100%)';
    sunMoon = buildClouds(false);
    buildRain(90);
  } else if(main === 'snow'){
    gradient = isDay
      ? 'linear-gradient(160deg, #A9BBD4 0%, #C7D5E8 55%, #E8EEF7 100%)'
      : 'linear-gradient(160deg, #26304A 0%, #38466A 55%, #4B5B82 100%)';
    buildSnow(60);
  } else if(['mist','fog','haze','smoke','dust','sand'].includes(main)){
    gradient = isDay
      ? 'linear-gradient(160deg, #8A97A8 0%, #ABB6C4 55%, #CBD3DC 100%)'
      : 'linear-gradient(160deg, #1E2432 0%, #2E3646 55%, #414B5D 100%)';
  } else {
    gradient = 'linear-gradient(160deg, #4A7FD9 0%, #6FA8E0 45%, #A7CBE8 100%)';
  }

  sky.style.background = gradient;
  document.body.style.background = gradient;
  if(sunMoon) particles.innerHTML += sunMoon;
}

function buildStars(){
  let html = '<div class="starlayer">';
  for(let i=0;i<50;i++){
    const top = Math.random()*70;
    const left = Math.random()*100;
    const delay = Math.random()*3;
    html += `<div class="star" style="top:${top}%; left:${left}%; animation-delay:${delay}s;"></div>`;
  }
  html += '</div>';
  return html;
}

function buildClouds(isDay){
  const color = isDay ? 'rgba(255,255,255,0.5)' : 'rgba(200,210,230,0.25)';
  let html = '';
  const positions = [[6,60,180],[40,20,220],[62,45,150],[20,75,140]];
  positions.forEach(([top,left,w],i)=>{
    const h = w*0.4;
    html += `<div class="cloud" style="top:${top}%; left:${left}%; width:${w}px; height:${h}px; background:${color};"></div>`;
  });
  return html;
}

function buildRain(count){
  for(let i=0;i<count;i++){
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = Math.random()*100 + '%';
    drop.style.top = (Math.random()*-100) + 'px';
    const dur = 0.5 + Math.random()*0.5;
    drop.style.animationDuration = dur + 's';
    drop.style.animationDelay = (Math.random()*2) + 's';
    particles.appendChild(drop);
  }
}

function buildSnow(count){
  for(let i=0;i<count;i++){
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    const size = 3 + Math.random()*4;
    flake.style.width = size+'px';
    flake.style.height = size+'px';
    flake.style.left = Math.random()*100 + '%';
    flake.style.top = (Math.random()*-100) + 'px';
    const dur = 4 + Math.random()*4;
    flake.style.animationDuration = dur + 's';
    flake.style.animationDelay = (Math.random()*4) + 's';
    particles.appendChild(flake);
  }
}

/* ---------------- search ---------------- */
let suggestionTimer;

function showSuggestions(list){
  if(!list.length){
    suggestions.classList.remove('show');
    suggestions.innerHTML = '';
    return;
  }

  suggestions.innerHTML = list.map(item => `
    <div class="suggestion-item" data-city="${item.name}, ${item.admin1 || item.country}">
      <div>${item.name}${item.admin1 ? `, ${item.admin1}` : ''}</div>
      <div class="sub">${item.country}${item.latitude && item.longitude ? ` · ${item.latitude.toFixed(2)}, ${item.longitude.toFixed(2)}` : ''}</div>
    </div>
  `).join('');

  suggestions.classList.add('show');
  suggestions.querySelectorAll('.suggestion-item').forEach(btn => {
    btn.addEventListener('click', () => {
      searchInput.value = btn.dataset.city;
      suggestions.classList.remove('show');
      loadWeather(btn.dataset.city);
    });
  });
}

async function fetchSuggestions(query){
  if(query.trim().length < 2) {
    suggestions.classList.remove('show');
    suggestions.innerHTML = '';
    return;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Suggestion lookup failed');
    const data = await res.json();
    showSuggestions((data.results || []).filter(item => item.country === 'India').slice(0, 6));
  } catch (error) {
    suggestions.classList.remove('show');
    suggestions.innerHTML = '';
  }
}

searchInput.addEventListener('input', () => {
  clearTimeout(suggestionTimer);
  suggestionTimer = setTimeout(() => fetchSuggestions(searchInput.value.trim()), 220);
});

searchInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    const q = searchInput.value.trim();
    suggestions.classList.remove('show');
    if(q) loadWeather(q);
  }
});

document.addEventListener('click', (e) => {
  if(!searchPanel.contains(e.target)) suggestions.classList.remove('show');
});

/* ---------------- weather fetch ---------------- */
function showMsg(text, isError){
  msgArea.innerHTML = `<div class="msg ${isError ? 'error':''}">${text}</div>`;
  hero.classList.remove('show'); stats.classList.remove('show');
  forecastTitle.classList.remove('show'); forecastRow.classList.remove('show');
}
function clearMsg(){ msgArea.innerHTML = ''; }

function weatherCodeToCondition(code){
  const map = {
    0: 'Clear',
    1: 'Partly Cloudy',
    2: 'Partly Cloudy',
    3: 'Cloudy',
    45: 'Mist',
    48: 'Mist',
    51: 'Drizzle',
    53: 'Drizzle',
    55: 'Drizzle',
    56: 'Drizzle',
    57: 'Drizzle',
    61: 'Rain',
    63: 'Rain',
    65: 'Rain',
    66: 'Rain',
    67: 'Rain',
    71: 'Snow',
    73: 'Snow',
    75: 'Snow',
    77: 'Snow',
    80: 'Rain',
    81: 'Rain',
    82: 'Rain',
    85: 'Snow',
    86: 'Snow',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm'
  };
  return map[code] || 'Cloudy';
}

async function geocodeLocation(query){
  const cleanQuery = (query || '').split(',')[0].trim();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Location lookup failed');
  const data = await res.json();
  if(!data.results || !data.results.length) throw new Error('Location not found');

  const match = data.results[0];
  return {
    name: match.name,
    admin1: match.admin1 || '',
    country: match.country || '',
    latitude: match.latitude,
    longitude: match.longitude,
    timezone: match.timezone || 'auto'
  };
}

async function fetchWeatherData(query){
  const location = await geocodeLocation(query);
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,pressure_msl,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(location.timezone)}&forecast_days=5`;
  const res = await fetch(forecastUrl);
  if(!res.ok) throw new Error('Weather fetch failed');

  const data = await res.json();
  const current = data.current || {};
  const daily = data.daily || {};
  const forecast = (daily.time || []).map((time, index) => ({
    day: new Date(time).toLocaleDateString(undefined, { weekday: 'short' }),
    condition: weatherCodeToCondition(daily.weather_code?.[index]),
    high_c: daily.temperature_2m_max?.[index],
    low_c: daily.temperature_2m_min?.[index]
  }));

  return {
    location: location.name,
    region: [location.admin1, location.country].filter(Boolean).join(', '),
    temperature_c: current.temperature_2m,
    feels_like_c: current.apparent_temperature,
    condition: weatherCodeToCondition(current.weather_code),
    description: weatherCodeToCondition(current.weather_code).toLowerCase(),
    humidity_pct: current.relative_humidity_2m,
    wind_kmh: current.wind_speed_10m,
    pressure_hpa: current.pressure_msl,
    visibility_km: (current.visibility || 0) / 1000,
    is_day: current.is_day !== 0,
    high_c: daily.temperature_2m_max?.[0],
    low_c: daily.temperature_2m_min?.[0],
    forecast
  };
}

async function loadWeather(query){
  try{
    const w = await fetchWeatherData(query);
    clearMsg();
    renderCurrent(w);
    renderForecast(w);
  }catch(e){
    showMsg('Could not fetch weather for that location. Please check the spelling and try again.', true);
  }
}

function renderCurrent(w){
  const main = normalizeCondition(w.condition);
  const isDay = w.is_day !== false;
  setSky(main, isDay);

  document.getElementById('heroLoc').textContent = w.region ? `${w.location}, ${w.region}` : w.location;
  document.getElementById('heroDate').textContent = new Date().toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' });
  document.getElementById('heroIcon').innerHTML = iconSVG(mapIcon(main, isDay), 74);
  document.getElementById('heroTemp').textContent = Math.round(w.temperature_c) + '°';
  document.getElementById('heroDesc').textContent = w.description || w.condition;
  document.getElementById('heroFeels').textContent = `Feels like ${Math.round(w.feels_like_c)}°  ·  H ${Math.round(w.high_c)}°  L ${Math.round(w.low_c)}°`;

  document.getElementById('statHumidity').textContent = Math.round(w.humidity_pct) + '%';
  document.getElementById('statWind').textContent = Math.round(w.wind_kmh) + ' km/h';
  document.getElementById('statPressure').textContent = Math.round(w.pressure_hpa) + ' hPa';
  document.getElementById('statVisibility').textContent = Number(w.visibility_km).toFixed(1) + ' km';

  hero.classList.add('show');
  stats.classList.add('show');
}

function renderForecast(w){
  const list = (w.forecast || []).slice(0, 5);
  forecastRow.innerHTML = list.map(f => {
    const main = normalizeCondition(f.condition);
    const icon = mapIcon(main, true);
    return `<div class="day-card">
      <div class="day-name">${f.day}</div>
      <div class="day-icon">${iconSVG(icon, 38)}</div>
      <div class="day-hi">${Math.round(f.high_c)}°</div>
      <div class="day-lo">${Math.round(f.low_c)}°</div>
    </div>`;
  }).join('');
  forecastTitle.classList.add('show');
  forecastRow.classList.add('show');
}

/* ---------------- init ---------------- */
setSky('clear', false);
loadWeather('Jaipur');
