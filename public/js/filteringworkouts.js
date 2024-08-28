document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const muscleGroupFilter = document.getElementById('muscleGroupFilter');
    const equipmentFilter = document.getElementById('equipmentFilter');
    const durationFilter = document.getElementById('durationFilter');
    const userRatingFilter = document.getElementById('userRatingFilter');
    const workoutList = document.querySelector('.workout-list');

    // Parse the initial workout data from the DOM
    let workouts = Array.from(workoutList.querySelectorAll('.workout-row')).map(row => ({
        element: row,
        name: row.querySelector('.exercise-name a').textContent,
        instructions: row.querySelector('.short-description').textContent,
        equipment: row.querySelector('.equipment-tag').textContent,
        target: row.querySelector('.workout-row > div:nth-child(5)').textContent.split(',')[0].trim(),
        secondaryMuscles: row.querySelector('.workout-row > div:nth-child(5)').textContent.split(',').slice(1).map(m => m.trim()),
        // Note: difficulty, duration, and userRating are not present in the current HTML.
        // You may need to add these to your server-side rendering if you want to filter by them.
    }));

    function filterWorkouts() {
        const searchTerm = searchInput.value.toLowerCase();
        const equipment = equipmentFilter.value.toLowerCase();
        const muscleGroup = muscleGroupFilter.value.toLowerCase();
        const difficulty = difficultyFilter.value.toLowerCase();

        workouts.forEach(workout => {
            const isVisible =
                workout.name.toLowerCase().includes(searchTerm) &&
                (equipment === '' || workout.equipment.toLowerCase() === equipment) &&
                (muscleGroup === '' ||
                    workout.target.toLowerCase() === muscleGroup ||
                    workout.secondaryMuscles.some(muscle => muscle.toLowerCase() === muscleGroup)) &&
                (difficulty === '' || workout.difficulty === difficulty); // Add this line if you implement difficulty

            workout.element.style.display = isVisible ? '' : 'none';
        });

        updateNoExercisesMessage();
    }

    function updateNoExercisesMessage() {
        const visibleWorkouts = workouts.filter(w => w.element.style.display !== 'none');
        let noExercisesMessage = workoutList.querySelector('.no-exercises');

        if (visibleWorkouts.length === 0) {
            if (!noExercisesMessage) {
                noExercisesMessage = document.createElement('div');
                noExercisesMessage.className = 'no-exercises';
                noExercisesMessage.textContent = 'No exercises found.';
                workoutList.appendChild(noExercisesMessage);
            }
        } else if (noExercisesMessage) {
            noExercisesMessage.remove();
        }
    }

    // Add event listeners to all filter elements
    searchInput.addEventListener('input', filterWorkouts);
    equipmentFilter.addEventListener('change', filterWorkouts);
    muscleGroupFilter.addEventListener('change', filterWorkouts);
    difficultyFilter.addEventListener('change', filterWorkouts);

    // Note: durationFilter and userRatingFilter event listeners are commented out
    // because these data points are not present in the current HTML structure.
    // Uncomment these if you add this data to your server-side rendering.
    // durationFilter.addEventListener('change', filterWorkouts);
    // userRatingFilter.addEventListener('change', filterWorkouts);
});
