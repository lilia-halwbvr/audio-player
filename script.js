//play pause button animation

import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

function calculateTime (secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}








let currentSong = null;




const popupPlayer = document.querySelector('.popup-player')

const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const audios = document.querySelectorAll('audio')

const songsCount = audios.length
const songsNames = document.querySelectorAll('.track-name')

const songs = []

const durationContainers = document.querySelectorAll('.time')
const playIconContainers = document.querySelectorAll('.play-button');

for (let i = 0; i < songsCount; i++) {
  const playButton = playIconContainers[i]

  const animation = lottieWeb.loadAnimation({
    container: playButton,
    path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
    renderer: 'svg',
    loop: false,
    autoplay: false,
    name: "Demo Animation",
  });

  animation.goToAndStop(14, true);

  songs.push({
    id: i,
    state: 'play',
    audio: audios[i],
    durationContainer: durationContainers[i],
    playButton,
    animation,
    name: songsNames[i].outerText,
    play: function() {
      this.audio.play()
      this.animation.playSegments([14, 27], true)
      this.state = 'pause'
      this.renderPlay()
      
      popupPlayButton.classList.remove('play-popup-button')
      popupPlayButton.classList.add('pause-popup-button')
      
    },
    stop: function() {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.animation.playSegments([0, 14], true);
      this.state = 'play';
      
      popupPlayButton.classList.remove('pause-popup-button')
      popupPlayButton.classList.add('play-popup-button')
      
    }, 
    renderPlay: function() {
      let popup = document.querySelector('.popup')
      popup.classList.remove('popup-invisible')
      let songName = document.querySelector('.album-song')
      songName.textContent = this.name
      let songDuration = document.querySelector('.time-popup')
      songDuration.textContent = calculateTime(this.audio.duration)
      currentSong = this
    },
    setSliderMax: function() {
      seekSlider.max = Math.floor(this.audio.duration)
    },
    displaybufferedAmount: function() {
      
      const bufferedAmount = Math.floor(this.audio.buffered.end(this.audio.buffered.length - 1));
      popupPlayer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
    },

    mute: function() {
      if(muteState === 'unmute') {
        muteAnimation.playSegments([0, 15], true);
        this.audio.muted = true;
        muteState = 'mute';
      } else {
        muteAnimation.playSegments([15, 25], true);
        this.audio.muted = false;
        muteState = 'unmute';
      }
      
    }

     
    

  })
}













volumeSlider.addEventListener('input', () => {
  // Обновление громкости аудио
  const volume = volumeSlider.value / volumeSlider.max;
  songs.forEach((song) => {
    song.audio.volume = volume;
  });

  // Обновление позиции ползунка громкости
  showRangeProgress(volumeSlider);
});






















//library for TYPING TEXT BLOCK

let typed = new Typed('#typed', {
  stringsElement: '#typed-strings', 
  typeSpeed: 100, 
  startDelay: 500, 
  backSpeed: 20,
  loop: true 
});





songs.forEach((song, i) => {
  song.playButton.addEventListener('click',  () => {

    // songPlay()

    if(song.state === 'play') {
      songs.filter(track => track.state === 'pause')
      .filter(track => track.id !== i)
      .forEach(track => track.stop())
      song.setSliderMax()
      song.displaybufferedAmount()
      song.play()
                       
    } else {
      song.stop()
                       
      
    }


  })
})







// MUTE BUTTON
const currentTimeContainer = document.getElementById('current-time');

seekSlider.addEventListener('input', () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
});




const muteIconContainer = document.getElementById('mute-icon');
let muteState = 'unmute';
const muteAnimation = lottieWeb.loadAnimation({
  container: muteIconContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Mute Animation",
});

muteIconContainer.addEventListener('click', () => {
  currentSong.mute()
});












let playState = 'play';

const popupPlayButton = document.getElementById('popupPlayButton')
function onPause(event) {
  let isOnPause = event.target.classList.contains('pause-popup-button')
  
  if(isOnPause) {
    currentSong.stop()
    event.target.classList.remove('pause-popup-button')
    event.target.classList.add('play-popup-button')
  } else {
    currentSong.play()
    event.target.classList.remove('play-popup-button')
    event.target.classList.add('pause-popup-button')
  }

  
}

popupPlayButton.addEventListener('click', onPause)
























//functionality on Button Listen Now
const listenNowButton = document.querySelector('.button_listen-now');

listenNowButton.addEventListener('click', () => {
  if (songs.length > 0) {
    const firstSong = songs[0];
    firstSong.play();
    
  }
});





//functions NEXT & PREV Tracks

const nextTrackButton = document.querySelector('.button-next-track');

nextTrackButton.addEventListener('click', () => {
  playNextTrack();
});

function playNextTrack() {
  let currentIndex = currentSong ? currentSong.id : -1;
  let nextIndex = currentIndex + 1;

  if (nextIndex >= songs.length) {
    nextIndex = 0;
  }

  if (currentSong) {
    currentSong.stop();
  }

  songs[nextIndex].play();
}



const prevTrackButton = document.querySelector('.button-prev-track');

prevTrackButton.addEventListener('click', () => {
  playPreviousTrack();
});

function playPreviousTrack() {
  let currentIndex = currentSong ? currentSong.id : -1;
  let prevIndex = currentIndex - 1;

  if (prevIndex < 0) {
    prevIndex = songs.length - 1;
  }

  if (currentSong) {
    currentSong.stop();
  }

  songs[prevIndex].play();
}




// SEEK SLIDER MOVING


const showRangeProgress = (rangeInput) => {
  
  if(rangeInput === seekSlider) {
    popupPlayer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  } else {
    popupPlayer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  }
}

seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});
volumeSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});

















// copy buttons

const buttonShare = document.querySelectorAll('.button')

buttonShare.forEach(function(button) {
  button.addEventListener('click', copyClipboard);
});

function copyClipboard(event) {
  let button = event.target
  let currentPageUrl = window.location.href

  let tempInp = document.createElement('input')
  tempInp.value = currentPageUrl
  document.body.appendChild(tempInp)

  tempInp.select()
  
  document.execCommand('copy')
  document.body.removeChild(tempInp)
}




window.addEventListener("load", function() {
  
  
  audios.forEach((track, i) => {
    
    const container = durationContainers[i]
    
    container.textContent = calculateTime(track.duration)
  })
});












// toogle menu 
const menuToggle = document.querySelector('.header_menu-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');


menuToggle.addEventListener('click', function() {
  
  document.querySelector('.header').classList.toggle('menu-open');
});


document.addEventListener('click', function(event) {
  const target = event.target;
  const isMenuClicked = dropdownMenu.contains(target) || menuToggle.contains(target);

  
  if (!isMenuClicked) {
    document.querySelector('.header').classList.remove('menu-open');
  }
});

































