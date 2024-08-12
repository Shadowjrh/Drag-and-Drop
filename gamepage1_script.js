document.addEventListener('DOMContentLoaded', () => {
    const foodItems = document.querySelectorAll('.food-item');
    const subzones = document.querySelectorAll('.subzone');
    const unhealthyZone = document.getElementById('unhealthy-zone');
    const resultsBox = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const retryButton = document.getElementById('retry');
    const proceedButton = document.getElementById('proceed');
    const submitButton = document.getElementById('submit');

    let score = 0;
    const itemStatus = {};

    // Function to handle dragging
    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.closest('.food-item').id);
        event.target.style.opacity = '0.4';
    }

    function handleDragEnd(event) {
        event.target.style.opacity = '1';
    }

    // Function to handle dropping on a zone
    function handleDrop(event) {
        event.preventDefault();
        const foodId = event.dataTransfer.getData('text/plain');
        const foodItem = document.getElementById(foodId);
        const dropZone = event.target.closest('.subzone') || event.target.closest('#unhealthy-zone');

        if (foodItem && dropZone) {
            const category = foodItem.querySelector('p').textContent.toLowerCase();
            const dropZoneId = dropZone.id;

            if (dropZoneId === 'unhealthy-zone') {
                handleCorrectDrop(foodItem, dropZone);
            } else {
                if (category === 'chips' || category === 'donut' || category === 'soda') {
                    handleIncorrectDrop(foodItem, dropZone);
                } else {
                    handleCorrectDrop(foodItem, dropZone);
                }
            }
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleCorrectDrop(foodItem, dropZone) {
        dropZone.appendChild(foodItem);
        foodItem.querySelector('p').style.display = 'none'; // Hide the text
        itemStatus[foodItem.id] = true; // Mark as placed
    }

    function handleIncorrectDrop(foodItem, dropZone) {
        foodItem.querySelector('p').style.display = 'block'; // Show the text again
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function displayResults() {
        resultsBox.style.display = 'block';
        scoreElement.textContent = `Score: ${score}`;

        if (score >= 80) {
            proceedButton.style.display = 'block';
            retryButton.style.display = 'block';
            document.getElementById('retry-message').style.display = 'none';
        } else {
            proceedButton.style.display = 'none';
            retryButton.style.display = 'block';
            document.getElementById('retry-message').style.display = 'block';
        }
    }

    // Shuffle the food items
    function shuffleFoodItems() {
        const container = document.querySelector('.food-items-container');
        const itemsArray = Array.from(container.children);
        for (let i = itemsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            container.appendChild(itemsArray[j]);
        }
    }

    // Add event listeners to food items
    foodItems.forEach(item => {
        item.id = `item-${item.querySelector('p').textContent.toLowerCase()}`;
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Add event listeners to drop zones
    subzones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });

    unhealthyZone.addEventListener('dragover', handleDragOver);
    unhealthyZone.addEventListener('drop', handleDrop);

    // Submit button functionality
    submitButton.addEventListener('click', () => {
        const allItemsPlaced = Array.from(foodItems).every(item => itemStatus[item.id]);
        if (allItemsPlaced) {
            // Calculate score based on correct placement
            score = Array.from(foodItems).reduce((acc, item) => {
                const category = item.querySelector('p').textContent.toLowerCase();
                const dropZoneId = item.parentElement.id;

                if (category === 'chips' || category === 'donut' || category === 'soda') {
                    if (dropZoneId === 'unhealthy-zone') {
                        return acc + 5; // Correctly placed in unhealthy zone
                    }
                } else {
                    if (dropZoneId !== 'unhealthy-zone') {
                        return acc + 5; // Correctly placed in healthy zones
                    }
                }
                return acc;
            }, 0);

            displayResults();
        } else {
            alert('Some items are missing or incorrectly placed.');
        }
    });

    // Shuffle food items when the page loads
    shuffleFoodItems();
});
