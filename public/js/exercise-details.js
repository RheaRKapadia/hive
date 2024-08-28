document.addEventListener('DOMContentLoaded', function() {
    const workoutList = document.querySelector('.workout-list');

    workoutList.addEventListener('click', function(event) {
      if (event.target.classList.contains('exercise-link')) {
        event.preventDefault();
        const exerciseRow = event.target.closest('.workout-row');
        const shortDescription = exerciseRow.querySelector('.short-description');
        const fullInstructions = exerciseRow.querySelector('.full-instructions');

        if (fullInstructions.style.display === 'none') {
          shortDescription.style.display = 'none';
          fullInstructions.style.display = 'block';
        } else {
          shortDescription.style.display = 'block';
          fullInstructions.style.display = 'none';
        }
      }
    });
  });
