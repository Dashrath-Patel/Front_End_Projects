// Story progression and interaction management
let currentScreen = 1;
let musicPlaying = false;
let currentLanguage = 'en'; // 'en' for English, 'hi' for Hinglish

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("💕 Welcome to our love story! 💕");
    
    // Initialize music control
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (musicToggle && backgroundMusic) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Initialize language control
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    // Add click effects throughout the page
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.story-btn') && !e.target.closest('.choice-btn') && !e.target.closest('.final-btn') && !e.target.closest('.music-btn') && !e.target.closest('.language-btn')) {
            createClickSparkle(e.clientX, e.clientY);
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            const visibleScreen = document.querySelector('.story-screen.active');
            const nextButton = visibleScreen?.querySelector('.story-btn');
            if (nextButton) {
                nextButton.click();
            }
        }
        
        // Add language toggle shortcut
        if (e.code === 'KeyL' && e.ctrlKey) {
            e.preventDefault();
            toggleLanguage();
        }
    });
    
    // Create random floating hearts
    setInterval(createRandomHeart, 3000);
    
    // Add touch support for mobile
    let touchStartTime = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
    });

    document.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - touchStartTime;
        const touch = e.changedTouches[0];
        
        if (touchDuration < 300 && !e.target.closest('button')) {
            createClickSparkle(touch.clientX, touch.clientY);
        }
    });
});

// Language toggle function
function toggleLanguage() {
    const languageBtn = document.getElementById('languageToggle');
    const languageText = languageBtn.querySelector('.language-text');
    
    if (currentLanguage === 'en') {
        currentLanguage = 'hi';
        languageText.textContent = 'English';
        languageBtn.classList.add('active');
        switchToHinglish();
    } else {
        currentLanguage = 'en';
        languageText.textContent = 'हिंग्लिश';
        languageBtn.classList.remove('active');
        switchToEnglish();
    }
    
    // Create language switch effect
    createLanguageSwitchEffect();
}

function switchToHinglish() {
    const translatableElements = document.querySelectorAll('[data-hi]');
    translatableElements.forEach(element => {
        const hinglishText = element.getAttribute('data-hi');
        element.textContent = hinglishText;
    });
    
    // Update music button text
    const musicText = document.querySelector('.music-text');
    if (musicText) {
        musicText.textContent = musicPlaying ? 'Music Band Karo' : 'Music Chalao';
    }
}

function switchToEnglish() {
    const translatableElements = document.querySelectorAll('[data-en]');
    translatableElements.forEach(element => {
        const englishText = element.getAttribute('data-en');
        element.textContent = englishText;
    });
    
    // Update music button text
    const musicText = document.querySelector('.music-text');
    if (musicText) {
        musicText.textContent = musicPlaying ? 'Pause Music' : 'Play Music';
    }
}

function createLanguageSwitchEffect() {
    // Create sparkle effect when switching languages
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createClickSparkle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 50);
    }
    
    // Show language switch message
    const message = currentLanguage === 'hi' ? '🌍 Hinglish mein switch ho gaye!' : '🌍 Switched to English!';
    createFloatingMessage(message, 200);
}

// Music control function
function toggleMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicText = musicToggle.querySelector('.music-text');
    
    if (!musicPlaying) {
        // Create a simple romantic melody using Web Audio API
        createRomanticMelody();
        musicText.textContent = currentLanguage === 'hi' ? 'Music Band Karo' : 'Pause Music';
        musicPlaying = true;
        musicToggle.classList.add('playing');
    } else {
        stopMusic();
        musicText.textContent = currentLanguage === 'hi' ? 'Music Chalao' : 'Play Music';
        musicPlaying = false;
        musicToggle.classList.remove('playing');
    }
}

// Create romantic melody using Web Audio API
let audioContext;
let oscillators = [];

function createRomanticMelody() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Romantic melody notes (simplified)
    const melody = [
        { freq: 523.25, duration: 0.5 }, // C5
        { freq: 587.33, duration: 0.5 }, // D5
        { freq: 659.25, duration: 0.8 }, // E5
        { freq: 698.46, duration: 0.3 }, // F5
        { freq: 783.99, duration: 1.0 }, // G5
        { freq: 659.25, duration: 0.8 }, // E5
        { freq: 523.25, duration: 1.2 }  // C5
    ];
    
    playMelody(melody);
}

function playMelody(melody) {
    let time = audioContext.currentTime;
    
    melody.forEach((note, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, time);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.1, time + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
        
        oscillator.start(time);
        oscillator.stop(time + note.duration);
        
        oscillators.push(oscillator);
        time += note.duration;
    });
    
    // Repeat the melody
    if (musicPlaying) {
        setTimeout(() => {
            if (musicPlaying) {
                playMelody(melody);
            }
        }, time * 1000);
    }
}

function stopMusic() {
    oscillators.forEach(osc => {
        try {
            osc.stop();
        } catch (e) {
            // Oscillator might already be stopped
        }
    });
    oscillators = [];
}

// Story navigation functions
function nextScreen(screenNumber) {
    const currentScreenElement = document.getElementById(`screen-${currentScreen}`);
    const nextScreenElement = document.getElementById(`screen-${screenNumber}`);
    
    if (currentScreenElement && nextScreenElement) {
        currentScreenElement.classList.remove('active');
        nextScreenElement.classList.add('active');
        currentScreen = screenNumber;
        
        // Add screen transition effect
        createScreenTransition();
    }
}

function showResponse(choice) {
    const responses = {
        miss: {
            emoji: "🥺",
            text: {
                en: "Aww, I miss you too! Every moment apart feels like forever...",
                hi: "Aww, main bhi tumhe miss karta hun! Har moment apart mein lagta hai jaise forever..."
            }
        },
        favorite: {
            emoji: "🌟",
            text: {
                en: "You're my favorite person in the whole universe! ✨",
                hi: "Tum mere favorite person ho poore universe mein! ✨"
            }
        },
        blush: {
            emoji: "😳",
            text: {
                en: "Hehe, you make me blush too! My cheeks are so red right now! 💕",
                hi: "Hehe, tum mujhe bhi blush karate ho! Mere cheeks abhi itne red hai! 💕"
            }
        }
    };
    
    const response = responses[choice];
    const responseScreen = document.getElementById('response-screen');
    const responseEmoji = responseScreen.querySelector('.response-emoji');
    const responseText = responseScreen.querySelector('.response-text');
    
    responseEmoji.textContent = response.emoji;
    responseText.textContent = response.text[currentLanguage];
    
    const currentScreenElement = document.getElementById(`screen-${currentScreen}`);
    currentScreenElement.classList.remove('active');
    responseScreen.classList.add('active');
    
    // Trigger heart burst animation
    triggerHeartBurst();
}

function showEnding(choice) {
    const endingScreen = document.getElementById('ending-screen');
    const currentScreenElement = document.getElementById(`screen-${currentScreen}`);
    
    currentScreenElement.classList.remove('active');
    endingScreen.classList.add('active');
    
    // Create celebration effect
    createCelebrationEffect();
    
    // Show special message based on choice
    if (choice === 'course') {
        setTimeout(() => {
            const message = currentLanguage === 'hi' ? 
                "Woh kiss emoji ne mera heart explode kar diya! 😘💥💕" :
                "That kiss emoji made my heart explode! 😘💥💕";
            createFloatingMessage(message);
        }, 2000);
    }
}

function restartStory() {
    const allScreens = document.querySelectorAll('.story-screen');
    allScreens.forEach(screen => screen.classList.remove('active'));
    
    const firstScreen = document.getElementById('screen-1');
    firstScreen.classList.add('active');
    currentScreen = 1;
    
    createRestartEffect();
}

// Visual effects functions
function createClickSparkle(x, y) {
    const sparkles = ['✨', '💫', '⭐', '🌟', '💕'];
    const colors = ['#ff9ec7', '#ffd700', '#ff7eb3', '#87ceeb', '#dda0dd'];
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.fontSize = '1.2rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.userSelect = 'none';
        
        const angle = (i * 72) * (Math.PI / 180);
        const distance = 50 + Math.random() * 30;
        const duration = 800 + Math.random() * 400;
        
        sparkle.style.transition = `all ${duration}ms ease-out`;
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
            sparkle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            sparkle.remove();
        }, duration + 100);
    }
}

function createRandomHeart() {
    const hearts = ['💕', '💖', '💗', '💓', '🌸', '✨'];
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (1 + Math.random()) + 'rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '2';
    heart.style.opacity = '0.7';
    heart.style.transition = 'all 8s linear';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.top = '-50px';
        heart.style.transform = `translateX(${(Math.random() - 0.5) * 100}px) rotate(360deg)`;
        heart.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        heart.remove();
    }, 8100);
}

function createScreenTransition() {
    // Create sparkle burst effect during screen transitions
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createClickSparkle(
                centerX + (Math.random() - 0.5) * 200,
                centerY + (Math.random() - 0.5) * 200
            );
        }, i * 50);
    }
}

function triggerHeartBurst() {
    const heartBurst = document.querySelector('.heart-burst');
    if (heartBurst) {
        // Reset animation
        heartBurst.style.animation = 'none';
        setTimeout(() => {
            heartBurst.style.animation = '';
        }, 10);
    }
    
    // Create additional heart effects around the screen
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createClickSparkle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 100);
    }
}

function createCelebrationEffect() {
    // Create massive celebration with hearts and sparkles
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createClickSparkle(x, y);
        }, i * 50);
    }
    
    // Create floating celebration messages
    const messages = ["💕", "🎉", "✨", "💖", "🥰", "😘"];
    messages.forEach((msg, index) => {
        setTimeout(() => {
            createFloatingMessage(msg, index * 200);
        }, index * 300);
    });
}

function createFloatingMessage(message, delay = 0) {
    const msgElement = document.createElement('div');
    msgElement.textContent = message;
    msgElement.style.position = 'fixed';
    msgElement.style.left = '50%';
    msgElement.style.top = '20%';
    msgElement.style.transform = 'translateX(-50%)';
    msgElement.style.fontSize = '2rem';
    msgElement.style.color = '#d147a3';
    msgElement.style.fontFamily = 'Dancing Script, cursive';
    msgElement.style.fontWeight = '600';
    msgElement.style.pointerEvents = 'none';
    msgElement.style.zIndex = '1000';
    msgElement.style.textShadow = '0 0 20px rgba(209, 71, 163, 0.5)';
    msgElement.style.opacity = '0';
    msgElement.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(msgElement);
    
    setTimeout(() => {
        msgElement.style.opacity = '1';
        msgElement.style.transform = 'translateX(-50%) translateY(-30px)';
    }, delay + 10);
    
    setTimeout(() => {
        msgElement.style.opacity = '0';
        msgElement.style.transform = 'translateX(-50%) translateY(-60px)';
    }, delay + 2000);
    
    setTimeout(() => {
        msgElement.remove();
    }, delay + 3000);
}

function createRestartEffect() {
    // Create a gentle restart effect with soft sparkles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createClickSparkle(x, y);
        }, i * 100);
    }
    
    // Show restart message
    setTimeout(() => {
        const message = currentLanguage === 'hi' ? 
            "Hamari story phir se shuru kar rahe hai... 💕" :
            "Starting our story again... 💕";
        createFloatingMessage(message);
    }, 500);
}

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add hover sound effect simulation
    const buttons = document.querySelectorAll('.story-btn, .choice-btn, .final-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Create subtle sparkle on hover
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.fontSize = '0.8rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1001';
            sparkle.style.animation = 'sparkleHover 0.5s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 500);
        });
    });
});

// Add sparkle hover animation
const sparkleHoverStyle = document.createElement('style');
sparkleHoverStyle.textContent = `
    @keyframes sparkleHover {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    .music-btn.playing .music-icon {
        animation: musicalNote 1s ease-in-out infinite;
    }
    
    @keyframes musicalNote {
        0%, 100% {
            transform: scale(1) rotate(-5deg);
        }
        50% {
            transform: scale(1.1) rotate(5deg);
        }
    }
`;
document.head.appendChild(sparkleHoverStyle);

// Console love messages
console.log("🌟 This love story was crafted with every ounce of my heart 🌟");
console.log("💕 Each animation, each word, each color was chosen just for you 💕");
console.log("✨ I hope you can feel the love radiating from every pixel ✨");
console.log("💖 You mean the world to me 💖");
console.log("🌍 Press Ctrl+L to toggle between English and Hinglish! 🌍");
