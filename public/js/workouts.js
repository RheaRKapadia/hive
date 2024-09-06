document.addEventListener('DOMContentLoaded', function() {
    const exerciseNames = document.querySelectorAll('.exercise-name');
    const popup = document.getElementById('exercisePopup');
    const editButton = document.getElementById('editExercise');
    const deleteButton = document.getElementById('deleteExercise');
    const closeButton = document.getElementById('closePopup');
    let currentExerciseId, currentWorkoutId;

    exerciseNames.forEach(exercise => {
        exercise.addEventListener('click', function() {
            currentExerciseId = this.dataset.exerciseId;
            currentWorkoutId = this.dataset.workoutId;
            popup.style.display = 'block';
        });
    });

    editButton.addEventListener('click', function() {
        // Implement edit functionality here
        console.log(`Edit exercise ${currentExerciseId} in workout ${currentWorkoutId}`);
        popup.style.display = 'none';
    });

    deleteButton.addEventListener('click', function() {
        // Implement delete functionality here
        console.log(`Delete exercise ${currentExerciseId} from workout ${currentWorkoutId}`);
        popup.style.display = 'none';
    });

    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
