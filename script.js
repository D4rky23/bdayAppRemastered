// --- Configurare ---
const BIRTHDAY_DATE_TARGET = '2025-04-13T00:00:00'; // Tinta Countdown
const BIRTHDAY_DATE_PERSON = '2004-04-13'; // Data Nasterii Persoanei pt Varsta
const BIRTHDAY_PERSON_NAME = "Mihaela"; // Numele Persoanei
const BIRTHDAY_MESSAGE_TEXT = `La Multi Ani, ${BIRTHDAY_PERSON_NAME}! ❤️✨`; // Mesajul scris

// --- Referinte Elemente DOM ---
const timerElement = document.getElementById('timer');
const ageElement = document.getElementById('age');
const birthdayMessageElement = document.getElementById('birthdayMessage');
const surpriseButton = document.getElementById('surpriseButton');
const backgroundEffectsContainer = document.querySelector('.background-effects'); // Container pt efecte fundal
const bodyElement = document.body;
const mainHeadingElement = document.getElementById('mainHeading');
const birthdayGreetingElement = document.getElementById('birthdayGreeting');

// Elemente Muzica
const backgroundMusic = document.getElementById('backgroundMusic');
const playPauseButton = document.getElementById('playPauseButton');
const muteButton = document.getElementById('muteButton');

// --- Stare ---
let timerInterval = null;
let isMusicPlaying = false;
let isMuted = false;

// --- Functii de Baza ---

function updateTimer() {
    const birthdayTarget = new Date(BIRTHDAY_DATE_TARGET);
    const now = new Date();
    const timeDiff = birthdayTarget.getTime() - now.getTime();

    if (timeDiff <= 0) {
        // --- STARE DE LA MULTI ANI ---
        if (timerInterval) {
            clearInterval(timerInterval); // Opreste intervalul
            timerInterval = null;
        }
        if (!bodyElement.classList.contains('birthday-active')) { // Adauga clasa doar o data
            bodyElement.classList.add('birthday-active'); // Adauga clasa pt schimbari CSS
            timerElement.innerHTML = "🎉 Astăzi e ziua ta! 🎉"; // Actualizeaza afisaj timer

            // Asigura vizibilitatea mesajului (desi CSS ar trebui sa se ocupe)
            if (birthdayGreetingElement) {
                 birthdayGreetingElement.classList.remove('hidden');
            }

            // Optional: Porneste o animatie/sunet special o singura data
            // playBirthdaySound();
            // launchBirthdayConfettiExplosion();
             if (backgroundMusic && !isMusicPlaying) { // Porneste muzica daca nu e deja pornita
                 togglePlayPause();
             }
        }
        return; // Opreste actualizarile timerului
    }

    // Calculeaza timpul ramas
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Afiseaza countdown cu formatare mai buna
    timerElement.innerHTML = `
        <span>${days}</span>zile
        <span>${hours}</span>ore
        <span>${minutes}</span>min
        <span>${seconds}</span>sec
    `; // Am scos virgulele pt a incapea mai bine pe mobil
}

function updateAge() {
    try {
        const birthdayPerson = new Date(BIRTHDAY_DATE_PERSON);
        const now = new Date();
        let age = now.getFullYear() - birthdayPerson.getFullYear();
        const monthDiff = now.getMonth() - birthdayPerson.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthdayPerson.getDate())) {
            age--;
        }

        // Verifica daca elementul exista inainte de update
        if (ageElement) {
             ageElement.innerHTML = `Vârstă: <span>${age}</span> ani`;
        } else {
            console.warn("Elementul cu ID 'age' nu a fost gasit.");
        }
    } catch (error) {
        console.error("Eroare la calcularea sau afisarea varstei:", error);
        if (ageElement) {
            ageElement.innerHTML = "Nu s-a putut calcula vârsta.";
        }
    }
}

function typeMessage(message, element, speed) {
    if (!element) {
        console.warn("Elementul tinta pt efectul de scriere nu a fost gasit.");
        return;
    }
    element.innerHTML = ''; // Goleste continutul anterior
    let index = 0;

    function type() {
        if (index < message.length) {
            element.innerHTML += message.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

// --- Functii Efecte ---

function createStars(count = 120) { // Mai multe stele
    if (!backgroundEffectsContainer) return;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        // Randomizeaza durata si delay animatie pt twinkle natural
        star.style.animationDuration = Math.random() * 3 + 2 + "s"; // durata 2s - 5s
        star.style.animationDelay = Math.random() * 5 + "s"; // delay 0s - 5s
        backgroundEffectsContainer.appendChild(star);
    }
}

// Functia pentru inimi (reintrodusa)
function createHeart() {
    if (!backgroundEffectsContainer) return;

    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = ['❤️', '💖', '💕', '💜', '💛'][Math.floor(Math.random() * 5)]; // Inimi variate
    heart.style.left = Math.random() * 98 + 1 + "vw"; // Evita marginile exacte
    heart.style.fontSize = Math.random() * 1.2 + 0.8 + "em"; // Dimensiune 0.8em - 2.0em
    const duration = Math.random() * 5 + 5; // Durata 5s-10s
    heart.style.animationDuration = duration + "s";
    // Optional: Add random horizontal sway via CSS variable
    // heart.style.setProperty('--random-sway', Math.random() * 2 - 1);

    backgroundEffectsContainer.appendChild(heart); // Adauga in containerul de efecte

    // Elimina inima dupa animatie (folosind durata setata)
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}


// Functie IMBUNATATITA pentru confetti initial
function createInitialConfetti(count = 70) { // Am marit putin numarul
    // Nu mai verificam backgroundEffectsContainer, adaugam direct in body
    // const colors = [...] // Nu mai setam culoarea prin JS

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('initial-confetti'); // Folosim clasa dedicata

        // Pozitie initiala aleatorie deasupra ecranului
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = Math.random() * -50 - 10 + 'vh'; // Porneste mai de sus (-60vh to -10vh)

        // Variatii pentru aspect "smecher"
        const size = Math.random() * 5 + 8; // Dimensiune intre 8px si 13px
        confetti.style.width = size + 'px';
        confetti.style.height = size * 1.5 + 'px'; // Putin mai inalt decat lat
        confetti.style.opacity = Math.random() * 0.5 + 0.5; // Opacitate variabila (0.5 - 1.0)

        // Setam variabile CSS pentru animatii mai complexe
        const fallDuration = Math.random() * 3 + 4; // Durata cadere intre 4s si 7s
        confetti.style.setProperty('--fall-duration', fallDuration + 's');
        
        const rotateDuration = Math.random() * 2 + 1; // Durata rotatie intre 1s si 3s
        confetti.style.setProperty('--rotate-duration', rotateDuration + 's');

        const horizontalSway = Math.random() * 100 - 50; // Miscare orizontala intre -50px si +50px
        confetti.style.setProperty('--horizontal-sway', horizontalSway + 'px');

        // Intarziere aleatorie pentru aparitie treptata
        confetti.style.animationDelay = Math.random() * 5 + 's'; // Delay pana la 5s

        // Adaugam confetti direct in body pentru position: fixed
        document.body.appendChild(confetti);

        // Elimina dupa animatie (cea mai lunga durata + delay maxim)
        setTimeout(() => {
            confetti.remove();
        }, (fallDuration + 5) * 1000); // fallDuration + delay max + buffer
    }
}


function createRainbow() {
    const rainbowContainer = document.createElement('div');
    rainbowContainer.className = 'rainbow';

    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    colors.forEach(color => {
        const layer = document.createElement('div');
        layer.className = `rainbow-layer ${color}`;
        rainbowContainer.appendChild(layer);
    });

    // Insereaza curcubeul inaintea containerului principal
    const container = document.querySelector('.container');
    if (container && container.parentNode) { // Verifica si parintele
        container.parentNode.insertBefore(rainbowContainer, container);
    } else {
         console.warn("Containerul principal '.container' sau parintele sau nu a fost gasit pt plasarea curcubeului.");
    }
}

// --- Efecte Buton Surpriza ---

function playSound(url, volume = 0.5) {
     const sound = new Audio(url);
     sound.volume = volume;
     sound.play().catch(error => {
         console.warn("Redarea audio a esuat. Interactiune utilizator necesara?", error);
     });
}

function createConfettiExplosion(count = 150) {
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti'); // Clasa pt confetti buton

        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2 + 100; 

        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * Math.PI * 2; 
        const force = Math.random() * 300 + 200; 
        const translateX = Math.cos(angle) * force;
        const translateY = Math.sin(angle) * force - (Math.random() * 300); 
        const rotation = Math.random() * 720 - 360; 

        confetti.style.transform = `translate(0,0)`; // Start without transform
        confetti.style.transition = `transform 3s ease-out, opacity 3s ease-out`; // Add transition
        confetti.style.opacity = 1;

        // Trigger layout and apply transform for transition
        requestAnimationFrame(() => {
            confetti.style.transform = `translate(${translateX}px, ${translateY}px) rotateZ(${rotation}deg)`;
            confetti.style.opacity = 0; // Fade out during transition
        });

        // Append to body for fixed positioning
        bodyElement.appendChild(confetti);

        // Remove confetti after transition
        setTimeout(() => {
            confetti.remove();
        }, 3100); // Transition duration + buffer
    }
}


function createMassiveFireworks(fireworksCount = 10, particlesPerFirework = 60) { // Mai multe
    const colors = [
        '#ff4e6c', '#ff7a5a', '#ffac53', '#f9f871', '#a6f793',
        '#60f7b3', '#4af0f9', '#66b6ff', '#a39bff', '#e699ff'
    ];

    for (let i = 0; i < fireworksCount; i++) {
        setTimeout(() => {
            const x = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.1);
            const y = Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.1);
            createSingleFirework(x, y, particlesPerFirework, colors);
        }, i * (Math.random() * 150 + 150)); // Interval lansare usor redus (150-300ms)
    }
}

function createSingleFirework(x, y, particleCount, colors) {
    // Trail (optional)
    const trail = document.createElement('div');
    trail.classList.add('firework-particle');
    trail.style.left = `${x}px`;
    trail.style.top = `${window.innerHeight}px`;
    trail.style.backgroundColor = '#ffffff';
    trail.style.width = '3px';
    trail.style.height = '10px';
    trail.style.animation = 'none';
    trail.style.transition = 'top 0.5s ease-out, opacity 0.5s 0.3s ease-out'; // Fade out trail
    trail.style.opacity = 1;
    bodyElement.appendChild(trail);

    requestAnimationFrame(() => {
        trail.style.top = `${y}px`;
        trail.style.opacity = 0; // Start fading out trail after it reaches destination
    });

    setTimeout(() => {
        trail.remove();
        playSound('https://www.fesliyanstudios.com/play-mp3/5672', 0.2); // Sunet artificiu

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle'); // Clasa corecta
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 50;
            const xDist = Math.cos(angle) * distance;
            const yDist = Math.sin(angle) * distance + (Math.random() * 50);

            particle.style.setProperty('--x', `${xDist}px`);
            particle.style.setProperty('--y', `${yDist}px`);
            particle.style.animationDelay = Math.random() * 0.1 + 's';

            bodyElement.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1300); // Potriveste cu durata animatiei CSS + buffer
        }
    }, 500); // Delay explozie
}

function createFestiveTexts(count = 20) { // Mai multe texte
    const texts = [
        "La Mulți Ani!", "Super!", "Yaaay!", "Te iubesc!", `${BIRTHDAY_PERSON_NAME}!`,
        "❤️", "✨", "🎂", "🎉", "🎁", "🥳", "🤩", "🌟"
    ];
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const textElement = document.createElement('div');
            textElement.className = 'festive-text'; // Clasa corecta
            textElement.style.left = `${Math.random() * 70 + 15}%`;
            textElement.style.top = `${Math.random() * 70 + 15}%`;
            textElement.textContent = texts[Math.floor(Math.random() * texts.length)];
            textElement.style.color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 1.5 + 2;
            textElement.style.fontSize = `${size}em`;
            textElement.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

            bodyElement.appendChild(textElement);

            setTimeout(() => {
                textElement.remove();
            }, 2600); // Potriveste cu durata animatiei CSS + buffer
        }, i * (Math.random() * 100 + 100)); // Interval aparitie 100-200ms
    }
}

function shakeScreen(duration = 400) { // Durata redusa putin
    bodyElement.classList.add('shake-effect');
    setTimeout(() => {
        bodyElement.classList.remove('shake-effect');
    }, duration);
}

function flashScreen(duration = 300) { // Flash mai rapid
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    bodyElement.appendChild(flash);
    setTimeout(() => {
        flash.remove();
    }, duration);
}

// --- Functii Control Muzica ---

function togglePlayPause() {
    if (!backgroundMusic) return;
    try {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            playPauseButton.textContent = '🎵';
            playPauseButton.title = 'Play Music';
        } else {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playPauseButton.textContent = '⏸️';
                    playPauseButton.title = 'Pause Music';
                    backgroundMusic.muted = isMuted; // Respecta starea mute
                }).catch(error => {
                    console.warn("Music playback failed. Needs user interaction.", error);
                    isMusicPlaying = false; // Asigura starea corecta
                    playPauseButton.textContent = '🎵';
                    playPauseButton.title = 'Play Music (Click Needed)';
                    // Optionally alert the user
                     // alert("Browser blocked audio playback. Please click the play button!");
                     return; // Iesi devreme daca play esueaza
                });
            }
        }
        isMusicPlaying = !isMusicPlaying; // Comuta starea DOAR daca comanda a fost initializata
    } catch (error) {
         console.error("Error in togglePlayPause:", error);
         isMusicPlaying = false; // Reseteaza starea in caz de eroare
         playPauseButton.textContent = '🎵';
    }
}


function toggleMute() {
    if (!backgroundMusic) return;
    isMuted = !isMuted;
    backgroundMusic.muted = isMuted;
    muteButton.textContent = isMuted ? '🔇' : '🔊';
    muteButton.title = isMuted ? 'Unmute Music' : 'Mute Music';
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Incarcat. Initializare setup.");

    // Apeluri initiale
    updateAge();
    createStars(); // Stelele primele
    createRainbow(); // Apoi curcubeul
    if (birthdayMessageElement) {
        typeMessage(BIRTHDAY_MESSAGE_TEXT, birthdayMessageElement, 110); // Scriere putin mai rapida
    } else {
         console.warn("Elementul mesajului aniversar nu a fost gasit pt efect scriere.");
    }

    // Porneste efectele continue de fundal DUPA ce restul elementelor sunt afisate
    setTimeout(() => {
        createInitialConfetti(); // Aici este apelul corect
        setInterval(createHeart, 400); 
    }, 300); // Delay mic (300ms)

    // Verifica starea initiala si porneste timerul
    updateTimer(); // Apel imediat pt afisare initiala
    if (!bodyElement.classList.contains('birthday-active')) {
         timerInterval = setInterval(updateTimer, 1000);
    }

    // Listener Buton Surpriza
    if (surpriseButton) {
        surpriseButton.addEventListener('click', function() {
            console.log("Buton surpriza apasat!");
            playSound('https://www.fesliyanstudios.com/play-mp3/600', 0.6); // Sunet click buton

            flashScreen();
            setTimeout(() => {
                shakeScreen();
                createMassiveFireworks();
                createFestiveTexts();
                createConfettiExplosion(200); // Confetti explozie buton
            }, 50); // Delay mic intre flash si restul

            this.disabled = true;
            // Opacitatea e setata de CSS :disabled
            setTimeout(() => {
                 if(surpriseButton) {
                     surpriseButton.disabled = false;
                 }
            }, 3500); // Cooldown
        });
    } else {
        console.warn("Butonul surpriza nu a fost gasit.");
    }

    // Listeners Control Muzica
    if (playPauseButton) {
        playPauseButton.addEventListener('click', togglePlayPause);
    } else {
        console.warn("Butonul Play/Pause nu a fost gasit.");
    }

    if (muteButton) {
        muteButton.addEventListener('click', toggleMute);
    } else {
        console.warn("Butonul Mute nu a fost gasit.");
    }

     // Setup initial muzica (muted autoplay attempt)
    if (backgroundMusic) {
         backgroundMusic.volume = 0.4;
         backgroundMusic.muted = true;
         isMuted = true;
         muteButton.textContent = '🔇';
         muteButton.title = 'Unmute Music';

         const playPromise = backgroundMusic.play();
         if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Autoplay muzica fundal initiat (muted).");
                // Nu schimbam isMusicPlaying aici, lasam interactiunea userului sa o faca
            }).catch(error => {
                console.log("Autoplay muzica fundal esuat (asteptat in multe browsere). Necesita interactiune.");
                isMusicPlaying = false;
            });
        } else {
             isMusicPlaying = false; // Fallback if play() doesn't return a promise
        }
     }

});

// Curatare interval la descarcare pagina
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});