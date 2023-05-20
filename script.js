// Game objects
const objects = [];

// Initialize the game
function initializeGame() {
    const container = document.getElementById('container');

    // Create 25 objects of each type
    for (let i = 0; i < 25; i++) {
        createObject('rock');
        createObject('paper');
        createObject('scissors');
    }

    // Start animation
    animate(container);
}

// Create a game object with the given type
function createObject(type) {
    const object = document.createElement('img');
    object.className = 'game-object';
    object.src = `${type}.png`;
    object.style.left = getRandomPosition() + 'px';
    object.style.top = getRandomPosition() + 'px';
    objects.push({
        element: object,
        type: type,
        xSpeed: getRandomSpeed(),
        ySpeed: getRandomSpeed()
    });
    document.getElementById('container').appendChild(object);
}

// Generate a random position within the container
function getRandomPosition() {
    return Math.floor(Math.random() * 550);
}

// Generate a random speed for the game object
function getRandomSpeed() {
    return Math.random() * 4 - 2;
}

// Animate the game objects
function animate(container) {
    const gameObjects = container.getElementsByClassName('game-object');
    const remainingTypes = new Set(['rock', 'paper', 'scissors']);
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Update the positions of the game objects
    for (let i = 0; i < gameObjects.length; i++) {
        const object = objects[i];
        let left = parseFloat(object.element.style.left) + object.xSpeed;
        let top = parseFloat(object.element.style.top) + object.ySpeed;

        // Prevent objects from going beyond the container boundaries
        const objectWidth = object.element.offsetWidth;
        const objectHeight = object.element.offsetHeight;

        // Adjust the direction if object reaches the container edges
        if (left <= 0 || left >= containerWidth - objectWidth) {
            object.xSpeed *= -1;
            left = clamp(left, 0, containerWidth - objectWidth);
        }
        if (top <= 0 || top >= containerHeight - objectHeight) {
            object.ySpeed *= -1;
            top = clamp(top, 0, containerHeight - objectHeight);
        }

        object.element.style.left = left + 'px';
        object.element.style.top = top + 'px';

        // Check for collisions
        for (let j = i + 1; j < gameObjects.length; j++) {
            const otherObject = objects[j];
            if (checkCollision(object, otherObject)) {
                // Handle collision
                handleCollision(object, otherObject);
            }
        }

        // Check if all objects are of the same type
        remainingTypes.delete(object.type);
    }

    // If there's only one type remaining, stop the animation
    if (remainingTypes.size === 1) {
        return;
    }

    // Request the next animation frame
    requestAnimationFrame(() => animate(container));
}

// Check if two objects collide
function checkCollision(object1, object2) {
    const rect1 = object1.element.getBoundingClientRect();
    const rect2 = object2.element.getBoundingClientRect();
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// Handle collision between two objects
function handleCollision(object1, object2) {
    // Reverse the direction of object1
    const tempXSpeed = object1.xSpeed;
    const tempYSpeed = object1.ySpeed;
    object1.xSpeed = object2.xSpeed;
    object1.ySpeed = object2.ySpeed;
    object2.xSpeed = tempXSpeed;
    object2.ySpeed = tempYSpeed;

    // Move the objects slightly apart to prevent overlap
    const overlap = Math.max(0, (object1.element.offsetWidth + object2.element.offsetWidth) / 2 - Math.abs(object1.xSpeed + object2.xSpeed));
    if (overlap > 0) {
        const angle = Math.atan2(object2.ySpeed - object1.ySpeed, object2.xSpeed - object1.xSpeed);
        const moveX = Math.cos(angle) * overlap;
        const moveY = Math.sin(angle) * overlap;

        const left1 = parseFloat(object1.element.style.left);
        const top1 = parseFloat(object1.element.style.top);
        object1.element.style.left = (left1 - moveX) + 'px';
        object1.element.style.top = (top1 - moveY) + 'px';

        const left2 = parseFloat(object2.element.style.left);
        const top2 = parseFloat(object2.element.style.top);
        object2.element.style.left = (left2 + moveX) + 'px';
        object2.element.style.top = (top2 + moveY) + 'px';
    }

    // Change the type/image of the objects
    if (
        (object1.type === 'rock' && object2.type === 'paper') ||
        (object1.type === 'paper' && object2.type === 'rock')
    ) {
        // Transform object1 into paper
        object1.element.src = 'paper.png';
        object1.type = 'paper';
    } else if (
        (object1.type === 'scissors' && object2.type === 'rock') ||
        (object1.type === 'rock' && object2.type === 'scissors')
    ) {
        // Transform object1 into rock
        object1.element.src = 'rock.png';
        object1.type = 'rock';
    } else if (
        (object1.type === 'paper' && object2.type === 'scissors') ||
        (object1.type === 'scissors' && object2.type === 'paper')
    ) {
        // Transform object1 into scissors
        object1.element.src = 'scissors.png';
        object1.type = 'scissors';
    }
}

// Helper function to clamp a value between a minimum and maximum
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Start the game
initializeGame();