//play pause button animation

import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

function calculateTime (secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}







let currentSong = null;
let currentPopupSong = null;




const popupPlayer = document.querySelector('.popup__player')

const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const audios = document.querySelectorAll('audio')

const songsCount = audios.length
const songsNames = document.querySelectorAll('.tracks__name')

const songs = []

const durationContainers = document.querySelectorAll('.tracks__time')
const playIconContainers = document.querySelectorAll('.tracks__play-button');

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
    // text: arr[i],
    state: 'play',
    audio: audios[i],
    durationContainer: durationContainers[i],
    playButton,
    pausedTime: 0, 
    animation,
    name: songsNames[i].outerText,
    isPlaying: false, // Добавить переменную isPlaying
    play: function() {
      this.audio.currentTime = this.pausedTime;
      this.audio.play();
      this.animation.playSegments([14, 27], true);
      this.state = 'pause';
      this.renderPlay();
      popupPlayButton.classList.remove('play-popup-button');
      popupPlayButton.classList.add('pause-popup-button');
      this.isPlaying = true; 
      songs.forEach((song) => {
        if (song.id !== this.id) {
          song.pausedTime = 0;
          song.isPlaying = false;
        }
      });
    },
    stop: function() {
      this.pausedTime = this.audio.currentTime;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.animation.playSegments([0, 14], true);
      this.state = 'play';
      popupPlayButton.classList.remove('pause-popup-button');
      popupPlayButton.classList.add('play-popup-button');
      this.isPlaying = false;
    },
      renderPlay: function() {
        let popup = document.querySelector('.popup')
        popup.classList.remove('popup_invisible')
        let songName = document.querySelector('.popup__album-song')
        songName.textContent = this.name
        let songDuration = document.querySelector('.popup__time')
        songDuration.textContent = calculateTime(this.audio.duration)
        currentSong = this
        currentPopupSong = this
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
        
      },
      whilePlaying: function() {
        if (this.isPlaying) {
          seekSlider.value = Math.floor(this.audio.currentTime);
          currentTimeContainer.textContent = calculateTime(seekSlider.value);
          popupPlayer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
          raf = requestAnimationFrame(() => this.whilePlaying());
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


// seekSlider.addEventListener('input', () => {
//   const seekTime = seekSlider.value;
//   currentTimeContainer.textContent = calculateTime(seekTime);

//   if (currentSong) {
//     const audio = audios[currentSong.id];
//     audio.currentTime = seekTime;
//   }
// });



seekSlider.addEventListener('input', () => {
  const audio = audios[currentSong.id];
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  if(!audio.paused) {
    cancelAnimationFrame(raf);
  }
});

seekSlider.addEventListener('change', () => {
  const audio = audios[currentSong.id];
  audio.currentTime = seekSlider.value;
  if (!audio.paused) {
    requestAnimationFrame(() => currentSong.whilePlaying());
  } else {
    currentSong.pausedTime = seekSlider.value;
  }
});






 





//library for TYPING TEXT BLOCK

let typed = new Typed('#typed', {
  stringsElement: '#typed-strings', 
  typeSpeed: 100, 
  startDelay: 500, 
  backSpeed: 20,
  loop: true 
});







const currentTimeContainer = document.getElementById('current-time');

seekSlider.addEventListener('input', () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
});


let raf = null;

songs.forEach((song, i) => {
  song.playButton.addEventListener('click',  () => {

    // songPlay()

    if(song.state === 'play') {
      songs.filter(track => track.state === 'pause')
      .filter(track => track.id !== i)
      .forEach(track => track.stop())
      song.setSliderMax()
      song.displaybufferedAmount()
      requestAnimationFrame(() => song.whilePlaying());
      song.play()
                       
    } else {
      
      song.stop()
      cancelAnimationFrame(raf);

                       
      
    }


  })
})


//functionality on Button Listen Now
const listenNowButton = document.querySelector('.album__button-listen');

listenNowButton.addEventListener('click', () => {
  if (songs.length >= 0) {
    
    const firstSong = songs[0];
    songs.filter(track => track.state === 'pause')
      
      .forEach(track => track.stop())
      firstSong.setSliderMax()
      firstSong.displaybufferedAmount()
      requestAnimationFrame(() => firstSong.whilePlaying());
    firstSong.play();
    
  } else {
      
    firstSong.stop()
    cancelAnimationFrame(raf);
    
  }
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
    currentSong.setSliderMax()
    currentSong.displaybufferedAmount()
    requestAnimationFrame(() => currentSong.whilePlaying());
    currentSong.play()
    event.target.classList.remove('play-popup-button')
    event.target.classList.add('pause-popup-button')
  }

  
}

popupPlayButton.addEventListener('click', onPause)












// MUTE BUTTON





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
  
  songs[nextIndex].setSliderMax()
  songs[nextIndex].displaybufferedAmount()
  requestAnimationFrame(() => songs[nextIndex].whilePlaying());
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
  songs[prevIndex].setSliderMax()
  songs[prevIndex].displaybufferedAmount()
  requestAnimationFrame(() => songs[prevIndex].whilePlaying());
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


// Пример отображения уведомления
buttonShare.forEach(function(button) {
  button.addEventListener('click', function() {
    
    // Отображаем уведомление
    Toastify({
      text: "'http://127...' successfully copied!",
      duration: 3000,
      gravity: "top",
      position: "right",
      zIndex: '-1',
      
      style: {
        
        fontFamily: "'Montserrat', sans-serif",
        background: "aliceblue",
        color: 'black',
        fontSize: "15px",
        
        
        
     
      },
    }).showToast();
  });
});






// toogle menu 
const menuToggle = document.querySelector('.header__button');
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






const toggleButtons = document.querySelectorAll('.toggle-button');


toggleButtons.forEach(button => {
  const subMenu = button.nextElementSibling;
  subMenu.style.display = 'none';
  button.addEventListener('click', () => {
    subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
  });
});

let subClose = document.querySelector('.dropdown-menu__button')

subClose.addEventListener('click',  () => {
  document.querySelector('.header').classList.remove('menu-open');
})





toggleButtons.forEach((toggleButton) => {
  let rotation = 0;
  let isRotated = false;

  toggleButton.addEventListener("click", () => {
    if (!isRotated) {
      rotation += 90;
      toggleButton.style.transform = `rotate(${rotation}deg)`;
    } else {
      rotation -= 90;
      toggleButton.style.transform = `rotate(${rotation}deg)`;
    }

    isRotated = !isRotated;
  });
});


