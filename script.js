function loadVideo(url) {
    const videoElement = document.getElementById('bg-video');
    while (videoElement.firstChild) videoElement.removeChild(videoElement.firstChild);
    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    videoElement.appendChild(source);
    videoElement.load();
    
    return new Promise((resolve) => {
      videoElement.addEventListener('loadeddata', () => resolve(videoElement), { once: true });
      videoElement.addEventListener('error', () => resolve(videoElement), { once: true });
    });
  }
  
  function restartVideo() {
    const videoElement = document.getElementById('bg-video');
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.play().catch(e => console.log('Video play error:', e));
    }
  }
  
  // Spotify Player functionality
  function initSpotifyPlayer() {
    const TRACK = {
      title: "cryptic",
      artist: "beatzbyluc",
      explicit: false,
      cover: "https://i.scdn.co/image/ab67616d00001e0232f462e6cfa4d6a8ada0c3f1",
      audio: "beatzbyluc-cryptic.mp3"
    };
  
    const audio = document.getElementById('audio');
    const cover = document.getElementById('cover');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const progressContainer = document.getElementById('progressContainer');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
  
    if (!audio || !cover) {
      console.log('Spotify elements not found');
      return;
    }
  
    console.log('Initializing Spotify player...');
  
    title.textContent = TRACK.title;
    artist.innerHTML = (TRACK.explicit ? '<span class="spotify-explicit">E</span> ' : '') + TRACK.artist;
    cover.style.backgroundImage = `url(${TRACK.cover})`;
    
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio can play');
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
  
    audio.src = TRACK.audio;
  
    let isPlaying = false;
  
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  
    function updateProgress() {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    }
  
    progressContainer.addEventListener('click', (e) => {
      console.log('Progress bar clicked');
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickPercent = clickX / width;
      audio.currentTime = clickPercent * audio.duration;
    });
  
    playBtn.addEventListener('click', (e) => {
      console.log('Play button clicked, isPlaying:', isPlaying);
      
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().then(() => {
          console.log('Audio started playing');
        }).catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    });
  
    audio.addEventListener('play', () => {
      console.log('Audio play event');
      isPlaying = true;
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    });
  
    audio.addEventListener('pause', () => {
      console.log('Audio pause event');
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    });
  
    audio.addEventListener('timeupdate', updateProgress);
  
    audio.addEventListener('ended', () => {
      console.log('Audio ended');
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      audio.currentTime = 0;
      progress.style.width = '0%';
      currentTimeEl.textContent = '0:00';
    });
  
    audio.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
    });
  }
  
  // 3D Tilt functionality
  function initTiltEffect() {
    const card = document.querySelector(".profile-card");
    if (!card) return;
  
    let rotX = 0, rotY = 0;
    let targetX = 0, targetY = 0;
    let isHovering = false;
    let rafId = null;
  
    const MAX_TILT = 7;
    const EASE = 0.22;
    const SPRING = 0.15;
    const SCALE_OUT = 1.05;
  
    const animate = () => {
      rotX += (targetX - rotX) * EASE;
      rotY += (targetY - rotY) * EASE;
  
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        scale(${isHovering ? SCALE_OUT : 1})
      `;
  
      if (!isHovering) {
        targetX *= (1 - SPRING);
        targetY *= (1 - SPRING);
        if (Math.abs(targetX) < 0.01 && Math.abs(targetY) < 0.01) {
          rotX = rotY = targetX = targetY = 0;
          card.style.transform = 'scale(1)';
          rafId = null;
          return;
        }
      }
  
      rafId = requestAnimationFrame(animate);
    };
  
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
  
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
  
      const percentX = dx / (rect.width / 2);
      const percentY = dy / (rect.height / 2);
  
      targetX = -percentY * MAX_TILT;
      targetY = percentX * MAX_TILT; 
  
      isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });
  
    card.addEventListener("mouseenter", () => {
      isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });
  
    card.addEventListener("mouseleave", () => {
      isHovering = false;
    });
  
    window.addEventListener("resize", () => {
      if (rafId) cancelAnimationFrame(rafId);
      rotX = rotY = targetX = targetY = 0;
      card.style.transform = 'scale(1)';
      rafId = null;
    });
  }
  
 // Visits counter
function initVisitsCounter() {
  const visitsElem = document.getElementById("visits");
  if (visitsElem) {
    if (!localStorage.getItem("visited")) {
      fetch("https://abacus.jasoncameron.dev/hit/ktoetotakoy.github.io/hxrdware")
        .then(() => localStorage.setItem("visited", "true"))
        .catch(() => {});
    }
    const evtSource = new EventSource("https://abacus.jasoncameron.dev/stream/ktoetotakoy.github.io/hxrdware");
    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.value) visitsElem.textContent = data.value;
      } catch {}
    };
    evtSource.onerror = () => evtSource.close();
    setTimeout(() => evtSource.close(), 300000);
  }
}
  
function initLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const container = document.querySelector('.container');
    const audio = document.getElementById('audio');
    
  
    if (!loadingOverlay) return;
    
    loadingOverlay.classList.add('active');
    
    loadingOverlay.addEventListener('click', async function() {

      
      loadingOverlay.classList.remove('active');
      
      container.classList.add('visible');
      
      restartVideo();
      
      setTimeout(() => {
        if (audio) {
          audio.play().then(() => {
            console.log('Трек запущен автоматически');
          }).catch(error => {
            console.log('Автозапуск трека не удался:', error);
          });
        }
      }, 500);
      
      this.removeEventListener('click', arguments.callee);
    });
    
    document.addEventListener('keydown', function firstKeyPress(e) {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
        loadingOverlay.click();
        document.removeEventListener('keydown', firstKeyPress);
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadVideo('https://api.hitube.io/st-tik/token/eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2MzMwZ2xwNXpzb29idHJjbDVkOWNyMnIweWlpMDh3eDIzb2VlcmVkNWFrc203Z3NreXNnd3JvcWZvOW92NGVtdmZuZ3lramQyam1uMHYzc2h2eGNwejg0OXBuenNtOTg3cGJlcXVwbjMyZTF3OXRyZThqY2V6dzY4YTl1MmFsYTE3NjI3MDU2Nzk2MjEiLCJpYXQiOjE3NjI3MDU2Nzk2MjIsImV4cCI6MTc2Mjc5NTY3OX0.x3ykmz5yRlgCXSDpzHeQvLbvuerbLZWWH14RGr4TvbRr8A0O1LiwsAS9TJ31kwMo3qf_JOWtP3qQf37pyLSu7g?sessionid=hitube.io_1d70kRBt5A_1762705656999&wh=www.hitube.io');
    initVisitsCounter();
    initSpotifyPlayer();
    initTiltEffect();
    initLoadingOverlay();
  });

  