document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    const days = document.querySelectorAll('.day');
    console.log('Number of day elements:', days.length);

    let completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];
    console.log('Initial completed days:', completedDays);

    function updateUI() {
        console.log('Updating UI');
        days.forEach(day => {
            const dayNumber = parseInt(day.dataset.day, 10);
            if (completedDays.includes(dayNumber)) {
                day.classList.add('completed');
                console.log(`Day ${dayNumber} marked as completed`);
            } else {
                day.classList.remove('completed');
                console.log(`Day ${dayNumber} marked as not completed`);
            }
        });
    }

    // Initial UI update
    updateUI();

    days.forEach(day => {
        day.addEventListener('click', function () {
            console.log('Day clicked:', this.dataset.day);
            const dayNumber = parseInt(this.dataset.day, 10);
            const index = completedDays.indexOf(dayNumber);

            if (index > -1) {
                completedDays.splice(index, 1);
                console.log(`Removed day ${dayNumber} from completed days`);
            } else {
                completedDays.push(dayNumber);
                console.log(`Added day ${dayNumber} to completed days`);
            }

            localStorage.setItem('completedDays', JSON.stringify(completedDays));
            console.log('Updated localStorage:', JSON.parse(localStorage.getItem('completedDays')));

            // Update the UI immediately after changing the state
            updateUI();
        });
    });
});
