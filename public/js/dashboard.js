document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/workouts/calendar')
        .then(response => response.json())
        .then(data => {
            const calendarElement = document.getElementById('workout-calendar');
            calendarElement.innerHTML = renderWorkoutCalendar(data);
        })
        .catch(error => console.error('Error loading workout calendar:', error));

    fetch('/api/health')
        .then(response => response.json())
        .then(data => {
            const healthElement = document.getElementById('health-data');
            healthElement.innerHTML = renderHealthData(data);
        })
        .catch(error => console.error('Error loading health data:', error));

    fetch('/api/locations')
        .then(response => response.json())
        .then(data => {
            const locationElement = document.getElementById('location-data');
            locationElement.innerHTML = renderLocationData(data);
        })
        .catch(error => console.error('Error loading location data:', error));

    fetch('/api/workouts/list')
        .then(response => response.json())
        .then(data => {
            const workoutsElement = document.getElementById('workouts-list');
            workoutsElement.innerHTML = renderWorkoutsList(data);
        })
        .catch(error => console.error('Error loading workouts list:', error));
});

function renderWorkoutCalendar(data) {
    // Return HTML string for workout calendar
}

function renderHealthData(data) {
    // Return HTML string for health data
}

function renderLocationData(data) {
    // Return HTML string for location data
}

function renderWorkoutsList(data) {
    // Return HTML string for workouts list
}

// Side menu toggle functionality
const menuToggle = document.querySelector('.user-menu');
const sideMenu = document.querySelector('.side-menu');

menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});
