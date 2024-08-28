document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const muscleGroupFilter = document.getElementById('muscleGroupFilter');
    const equipmentFilter = document.getElementById('equipmentFilter');
    const durationFilter = document.getElementById('durationFilter');
    const userRatingFilter = document.getElementById('userRatingFilter');
    const workoutList = document.querySelector('.workout-list');

    // Parse the initial workout data from the DOM
    let workouts = Array.from(workoutList.querySelectorAll('.workout-row')).map(row => ({
        element: row,
        name: row.querySelector('.exercise-name').textContent,
        instructions: row.querySelector('.workout-row > div:nth-child(3)').textContent,
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

        workouts.forEach(workout => {
            const isVisible =
                workout.name.toLowerCase().includes(searchTerm) &&
                (equipment === '' || workout.equipment.toLowerCase() === equipment) &&
                (muscleGroup === '' ||
                    workout.target.toLowerCase() === muscleGroup ||
                    workout.secondaryMuscles.some(muscle => muscle.toLowerCase() === muscleGroup));

            workout.element.style.display = isVisible ? '' : 'none';
        });

        const visibleWorkouts = workouts.filter(w => w.element.style.display !== 'none');
        const noExercisesMessage = workoutList.querySelector('.no-exercises');

        if (visibleWorkouts.length === 0) {
            if (!noExercisesMessage) {
                const message = document.createElement('div');
                message.className = 'no-exercises';
                message.textContent = 'No exercises found.';
                workoutList.appendChild(message);
            }
        } else if (noExercisesMessage) {
            noExercisesMessage.remove();
        }
    }

    // Add event listeners to all filter elements
    searchInput.addEventListener('input', filterWorkouts);
    equipmentFilter.addEventListener('change', filterWorkouts);
    muscleGroupFilter.addEventListener('change', filterWorkouts);

    // Note: difficultyFilter, durationFilter, and userRatingFilter event listeners are commented out
    // because these data points are not present in the current HTML structure.
    // Uncomment these if you add this data to your server-side rendering.
    // difficultyFilter.addEventListener('change', filterWorkouts);
    // durationFilter.addEventListener('change', filterWorkouts);
    // userRatingFilter.addEventListener('change', filterWorkouts);
});
