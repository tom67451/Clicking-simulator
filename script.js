document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const clickArea = document.getElementById('click-area');
    const clickTarget = document.getElementById('click-target');
    const clickButton = document.getElementById('click-button');
    const clickCounter = document.getElementById('click-counter');
    const upgrades = document.getElementById('upgrades');
    const noticeLodys = document.getElementById('notice-lodys');
    const closeNoticeBtn = document.getElementById('close-notice');
    const clickSound = new Audio("click.wav");
    const shorts = document.getElementById('shorts');
    const skibidiToiletMinigameButton = document.getElementById('skibidi-toilet-minigame-button');
    const skibidiToiletMinigame = document.getElementById('skibidi-toilet-minigame');
    let clicks = 0;
    let clickPower = 1;
    let autoClicksPerSecond = 0;
    
    
    // Initialize click counter display
    update();

    

    // Notice
    if (localStorage.getItem("notice-lodys-seen")) {
        noticeLodys.classList.add('hidden');
    } else {
        localStorage.setItem("notice-lodys-seen", "true");
    }

    closeNoticeBtn.addEventListener('click', () => {
        noticeLodys.classList.add('hidden');
        localStorage.setItem("notice-lodys-seen", "true");
    });

    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play()
    }

    function clickAdd() {
        clicks += clickPower;
        update();
        checkUpgrades();
    }

    // Click handling
    clickButton.addEventListener('click', () => {
        clickAdd();
        playClickSound();
    });

    // Upgrade buttons
    const upgradeClickPower = document.getElementById('upgrade-click-power');
    const upgradeAutoClick = document.getElementById('upgrade-auto-click');
    const upgradeSubscribe = document.getElementById('upgrade-subscribe');
    const upgradeShorts = document.getElementById("upgrade-shorts");
    const upgradeSkibidiToiletMinigame = document.getElementById("upgrade-skibidi-toilet-minigame");

    function handleUpgrade(upgradeElement, upgradeType) {
        const cost = parseInt(upgradeElement.dataset.cost);
        if (clicks >= cost) {
            clicks -= cost;

            switch (upgradeType) {
                case "power":
                    const multiplier = parseInt(upgradeElement.dataset.multiplier);
                    clickPower *= 5;
                    upgradeElement.dataset.cost = Math.floor(cost * 1.4);
                    break;
                case "auto":
                    const cps = parseInt(upgradeElement.dataset.cps);
                    autoClicksPerSecond += cps;
                    upgradeElement.dataset.cost = Math.floor(cost * 2);
                    break;
                case "subscribe":
                    window.open('https://www.youtube.com/@Lodys', '_blank');
                    upgradeElement.classList.add('disabled');
                    upgradeElement.innerHTML = '<span class="upgrade-name">Thanks for subscribing! 🎉</span>';
                    update();
                    return;
                case "shorts": 
                    shorts.classList.remove('hidden');
                    playVideo(0);
                    upgradeElement.innerHTML = '<span class="upgrade-name">Shorts Unlocked! 🎉</span>';
                    update();
                    return;
                case "skibidi-toilet-minigame":
                    skibidiToiletMinigame.classList.remove('hidden');
                    upgradeElement.innerHTML = '<span class="upgrade-name">Skibidi Toilet Minigame Unlocked! 🎉</span>';
                    update();
                    return;
            }
            
            upgradeElement.querySelector(".upgrade-cost").textContent = `Cost: ${upgradeElement.dataset.cost} clicks`;
            update();
        }
    }

    upgradeClickPower.addEventListener('click', () => handleUpgrade(upgradeClickPower, 'power'));
    upgradeAutoClick.addEventListener('click', () => handleUpgrade(upgradeAutoClick, 'auto'));
    upgradeSubscribe.addEventListener('click', () => handleUpgrade(upgradeSubscribe, 'subscribe'));
    upgradeShorts.addEventListener("click", () => handleUpgrade(upgradeShorts, "shorts"));
    upgradeSkibidiToiletMinigame.addEventListener('click', () => handleUpgrade(upgradeSkibidiToiletMinigame, 'skibidi-toilet-minigame'));

    function update() {
        clickCounter.textContent = `Clicks: ${clicks.toFixed(2)} (Power: ${clickPower.toFixed(2)}x)${autoClicksPerSecond > 0 ? ` (Auto: ${autoClicksPerSecond.toFixed(2)}/s)` : ''}`;
    }

    function checkUpgrades() {
        if (clicks >= 10) {
            upgrades.classList.remove('hidden');
        }
    }

    // Auto-clicker
    setInterval(() => {
        if (autoClicksPerSecond > 0) {
            clicks += autoClicksPerSecond;
            update();
        }
    }, 1000);

    // Video player functionality
    const videoPlayer = document.getElementById('video-player');
    const nextVideoButton = document.getElementById('next-video');
    const videos = [
        "first.webm",
        
    ];
    let currentVideoIndex = 0;

    function playVideo(index) {
        if (index >= 0 && index < videos.length) {
            videoPlayer.src = videos[index];
            videoPlayer.load();
            videoPlayer.play();
            currentVideoIndex = index;
        }
    }


    
    nextVideoButton.addEventListener('click', () => {
        let nextIndex = (currentVideoIndex + 1) % videos.length;
        playVideo(nextIndex);
    });

    
    videoPlayer.addEventListener('ended', () => {
        let nextIndex = (currentVideoIndex + 1) % videos.length;
        playVideo(nextIndex);
    });
    skibidiToiletMinigameButton.addEventListener('click', () => {
        const skibidi = document.getElementById('skibidi');
        if (skibidi) {
            skibidi.classList.remove('hidden');
            // Force a reflow to restart the animation
            void skibidi.offsetWidth;
            skibidi.style.animation = 'none';
            void skibidi.offsetWidth;
            skibidi.style.animation = null;
            skibidi.classList.add('skibidi');
        }
    });

    
    const skibidi = document.getElementById('skibidi');
    if (skibidi) {
        skibidi.addEventListener('animationend', () => {
            clicks += 100;
            update();
            skibidi.classList.add('hidden');
        });
    }
    
});

