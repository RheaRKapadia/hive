let currentSlide = 0;
let slidesContainer;
let totalSlides;

document.addEventListener('DOMContentLoaded', function() {
    const userId = document.body.getAttribute('data-user-id');

    fetchAndDisplayWorkouts(userId);
    setupQuote();
    setupWorkoutCalendar();
    setupSideMenu();
});

async function fetchAndDisplayWorkouts(userId) {
    const workoutsList = document.getElementById('workouts-list');

    try {
        const response = await fetch(`/${userId}/workouts/data`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const workouts = await response.json();

        if (workouts.length === 0) {
            workoutsList.innerHTML = '<p>No workouts found. Create a new workout to get started!</p>';
        } else {
            workoutsList.innerHTML = renderWorkoutsList(workouts, userId);
            initializeSlider();
        }
    } catch (error) {
        console.error('Error fetching workouts:', error);
        workoutsList.innerHTML = `<p>Failed to load workouts. Please try again later. (Error: ${error.message})</p>`;
    }
}

function renderWorkoutsList(workouts, userId) {
    const workoutSlides = workouts.map((workout, index) => `
        <div class="workout-slide" id="slide-${index}">
            <div class="workout-item">
                <h3>${workout.name}</h3>
                <div class="exercise-list">
                    <h4>Exercises:</h4>
                    <ul>
                        ${workout.exerciseNames.map(name => `<li>${name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="workout-slider">
            <div class="slides-container">
                ${workoutSlides}
            </div>
            <button class="slider-nav prev">&#10094;</button>
            <button class="slider-nav next">&#10095;</button>
        </div>
    `;
}

function initializeSlider() {
    slidesContainer = document.querySelector('.slides-container');
    totalSlides = document.querySelectorAll('.workout-slide').length;

    if (totalSlides > 0) {
        changeSlide(0);
    }

    document.querySelectorAll('.slider-nav').forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.classList.contains('prev') ? -1 : 1;
            changeSlide(direction);
        });
    });
}

function changeSlide(direction) {
    if (!slidesContainer || totalSlides === 0) return;

    currentSlide += direction;
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function setupQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    async function fetchAndDisplayQuote() {
        const today = new Date().toDateString();
        const cachedQuote = localStorage.getItem('dailyQuote');
        const cachedDate = localStorage.getItem('dailyQuoteDate');

        if (cachedQuote && cachedDate === today) {
            const { content, author } = JSON.parse(cachedQuote);
            quoteText.textContent = `"${content}"`;
            quoteAuthor.textContent = author;
        } else {
            try {
                const response = await fetch('https://api.quotable.io/random?tags=inspirational');
                if (!response.ok) {
                    throw new Error('Failed to fetch quote');
                }
                const data = await response.json();
                quoteText.textContent = `"${data.content}"`;
                quoteAuthor.textContent = data.author;
                localStorage.setItem('dailyQuote', JSON.stringify({ content: data.content, author: data.author }));
                localStorage.setItem('dailyQuoteDate', today);
            } catch (error) {
                console.error('Error fetching quote:', error);
                quoteText.textContent = 'Failed to load quote. Please try again later.';
                quoteAuthor.textContent = '';
            }
        }
    }

    fetchAndDisplayQuote();
}

function setupWorkoutCalendar() {
    const days = document.querySelectorAll('.day');

    days.forEach(day => {
        const dayNumber = parseInt(day.dataset.day, 10);
        const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];

        if (completedDays.includes(dayNumber)) {
            day.classList.add('completed');
        }

        day.addEventListener('click', function () {
            if (day.classList.contains('completed')) {
                day.classList.remove('completed');
                completedDays.splice(completedDays.indexOf(dayNumber), 1);
            } else {
                day.classList.add('completed');
                completedDays.push(dayNumber);
            }

            localStorage.setItem('completedDays', JSON.stringify(completedDays));
        });
    });
}

function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.user-menu span')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
