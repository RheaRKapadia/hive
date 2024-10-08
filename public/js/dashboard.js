let currentSlide = 0;
let slidesContainer;
let totalSlides;

document.addEventListener('DOMContentLoaded', function() {
    const userId = document.body.getAttribute('data-user-id');

    fetchAndDisplayWorkouts(userId);
    setupQuote();
    setupWorkoutCalendar();
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
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const storage = isChrome ? sessionStorage : localStorage;
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    console.log('setupQuote function called (Chrome version)');

    async function fetchAndDisplayQuote() {
        console.log('fetchAndDisplayQuote function called');

        quoteText.textContent = 'Loading quote...';
        quoteAuthor.textContent = '';

        const today = new Date().toDateString();
        const cachedQuote = sessionStorage.getItem('dailyQuote');
        const cachedDate = sessionStorage.getItem('dailyQuoteDate');

        console.log('Cached quote:', cachedQuote);
        console.log('Cached date:', cachedDate);

        if (cachedQuote && cachedDate === today) {
            console.log('Using cached quote');
            try {
                const parsedQuote = JSON.parse(cachedQuote);
                console.log('Parsed cached quote:', parsedQuote);
                const content = parsedQuote.q || parsedQuote.content;
                const author = parsedQuote.a || parsedQuote.author;

                if (content && author) {
                    quoteText.textContent = `"${content}"`;
                    quoteAuthor.textContent = author;
                } else {
                    throw new Error('Invalid cached quote data');
                }
            } catch (error) {
                console.error('Error parsing cached quote:', error);
                await fetchNewQuote();
            }
        } else {
            console.log('Fetching new quote');
            await fetchNewQuote();
        }
    }

    async function fetchNewQuote() {
        console.log('fetchNewQuote function called');
        try {
            const response = await fetch('/api/quote');
            console.log('API response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch quote: ${response.status}`);
            }

            const data = await response.json();
            console.log('Quote API response:', data);

            if (Array.isArray(data) && data.length > 0) {
                const quoteData = data[0];
                console.log('Quote data:', quoteData);

                const content = quoteData.q || quoteData.content;
                const author = quoteData.a || quoteData.author;

                if (content && author) {
                    quoteText.textContent = `"${content}"`;
                    quoteAuthor.textContent = author;
                    sessionStorage.setItem('dailyQuote', JSON.stringify(quoteData));
                    sessionStorage.setItem('dailyQuoteDate', new Date().toDateString());
                } else {
                    throw new Error('Invalid quote data structure');
                }
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            quoteText.textContent = 'Inspiration is within you today.';
            quoteAuthor.textContent = '';
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
