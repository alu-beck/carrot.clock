console.log("Widget gestartet!");

const rabbit = document.getElementById('rabbit');
const clock = document.getElementById('clock');
const images = {
  work: ['animation/rabbit_neutral1.png', 'animation/rabbit_neutral2.png'],
  sleeping: ['animation/rabbit_sleeping1.png', 'animation/rabbit_sleeping2.png', 'animation/rabbit_sleeping3.png', 'animation/rabbit_sleeping4.png'],
  hungry: ['animation/rabbit_hungry1.png', 'animation/rabbit_hungry2.png'],
  happy: ['animation/rabbit_happy.png', 'animation/rabbit_neutral1.png'],
  openMouth: ['animation/rabbit_openmouth.png']
};
let currentIndex = 0;
let currentState = 'initial'; // Initial state
let workTime = 25 * 60 ; // 60 minutes in seconds
let breakTime = 5 * 60; // 10 minutes in seconds
let happyTime = 4; // 5 minutes in seconds
let countdownTime = workTime;
let carrotsEaten = 0;
let carrotInUseId = null;
const totalCarrots = 4; // Total number of carrots to be eaten

handleStateTransition();

function updateClock() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    clock.textContent = timeString;

    if (countdownTime > 0) {
        countdownTime--;
    } else {
        handleStateTransition();
    }
}

function handleStateTransition() {
    if (currentState === 'work') {
        currentState = 'sleeping';
        countdownTime = breakTime;
        clearCarrots();
        clock.style.display = 'block'; // Show the clock
    } else if (currentState === 'initial') {
        currentState = 'hungry';
        showCarrots();
        clock.style.display = 'none'; // Hide the clock
    } else if (currentState === 'sleeping') {
        currentState = 'hungry';
        showCarrots();
        clock.style.display = 'none'; // Hide the clock
    } else if (currentState === 'hungry') {
        if (carrotsEaten >= totalCarrots) {
            currentState = 'happy';
            countdownTime = happyTime;
            clearCarrots();
            carrotsEaten = 0; // Reset the carrotsEaten counter
            clock.style.display = 'none'; // Hide the clock
        } else {
            // Remain in the hungry state
            return;
        }
    } else if (currentState === 'happy') {
        currentState = 'work';
        countdownTime = workTime;
        clearCarrots();
        clock.style.display = 'block'; // Show the clock
    }
    currentIndex = 0; // Reset image index for new state
    updateRabbitImage();
}

// Initialize the application with the initial state
currentState = 'initial';
handleStateTransition();

function updateRabbitImage() {
    const stateImages = images[currentState];
    rabbit.src = stateImages[currentIndex];
    currentIndex = (currentIndex + 1) % stateImages.length;
}

function showCarrots() {
    const leftBar = document.querySelector('.leftbar');
    const rightBar = document.querySelector('.rightbar');
    leftBar.innerHTML = '<img id="carrot1" class="carrot" src="animation/carrot.png" alt="carrot" draggable="true"><img id="carrot2" class="carrot" src="animation/carrot.png" alt="carrot" draggable="true">';
    rightBar.innerHTML = '<img id="carrot3" class="carrot" src="animation/carrot.png" alt="carrot" draggable="true"><img id="carrot4" class="carrot" src="animation/carrot.png" alt="carrot" draggable="true">';
    addDragAndDropListeners();
}

function clearCarrots() {
    const leftBar = document.querySelector('.leftbar');
    const rightBar = document.querySelector('.rightbar');
    leftBar.innerHTML = '';
    rightBar.innerHTML = '';
}

function addDragAndDropListeners() {
    const carrots = document.querySelectorAll('.carrot');
    carrots.forEach(carrot => {
        carrot.addEventListener('dragstart', handleDragStart);
        carrot.addEventListener('dragend', handleDragEnd);
    });

    rabbit.addEventListener('dragover', handleDragOver);
    rabbit.addEventListener('drop', handleDrop);
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    carrotInUseId = event.target.id;
    console.log(`Carrot with ID ${carrotInUseId} is being dragged`);
    setTimeout(() => {
        event.target.style.visibility = 'hidden';
    }, 0);
}

function handleDragEnd(event) {
    const carrot = document.getElementById(event.target.id);
    carrot.style.visibility = 'visible';
    updateRabbitImage(); // Revert to the appropriate image for the current state
}

function handleDragOver(event) {
    event.preventDefault();
    rabbit.src = images.openMouth; // Keep rabbit image as open mouth during drag over
}

function handleDrop(event) {
    event.preventDefault();
    const carrotId = event.dataTransfer.getData('text/plain');
    const carrot = document.getElementById(carrotId);
    if (currentState === 'hungry' && event.target === rabbit) {
        handleCarrotPickup();
        carrot.style.display = 'none'; // Keep the carrot hidden
    } else {
        carrot.style.visibility = 'visible'; // Make the carrot visible again
        carrot.style.display = 'block'; // Ensure the carrot is displayed
    }
    updateRabbitImage(); // Revert to the appropriate image for the current state after drop
}

function handleCarrotPickup() {
    rabbit.src = images.openMouth; // Change rabbit image to open mouth
    carrotsEaten++;
    if (carrotsEaten >= totalCarrots) {
        handleStateTransition();
    }
}

// Example function to simulate carrot pickup
function simulateCarrotPickup() {
    handleCarrotPickup();
    setTimeout(() => {
        updateRabbitImage(); // Revert to the appropriate image after some time
    }, 1000); // Adjust the timeout duration as needed
}

// Call this function when a carrot is picked up
document.querySelectorAll('.carrot').forEach(carrot => {
    carrot.addEventListener('click', simulateCarrotPickup);
});

setInterval(() => {
  updateRabbitImage();
  console.log(`Image changed to: ${rabbit.src}`); // Log the current image source
}, 1000); // Change image every 1 second

const countdownInterval = setInterval(updateClock, 1000); // Update the clock every second
updateClock(); // Initial call to display the clock immediately

// Close button functionality
document.querySelector('.close-button').addEventListener('click', () => {
    window.electron.closeWindow();
});