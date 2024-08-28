document.addEventListener('DOMContentLoaded', function() {
    const bodyPartFilter = document.getElementById('bodyPartFilter');
    const equipmentFilter = document.getElementById('equipmentFilter');
    const targetFilter = document.getElementById('targetFilter');
    const searchInput = document.querySelector('.search-input');
    const workoutRows = document.querySelectorAll('.workout-row');

    function normalizeText(text) {
        return text.toLowerCase().replace(/[_-]/g, ' ');
    }

    function filterWorkouts() {
        const bodyPart = normalizeText(bodyPartFilter.value);
        const equipment = normalizeText(equipmentFilter.value);
        const target = normalizeText(targetFilter.value);
        const searchTerm = normalizeText(searchInput.value);

        workoutRows.forEach(row => {
            const exerciseName = normalizeText(row.querySelector('.exercise-name').textContent);
            const exerciseEquipment = normalizeText(row.querySelector('.equipment-tag').textContent);
            const exerciseDescription = normalizeText(row.querySelector('.exercise-description').textContent);
            const exerciseMuscles = normalizeText(row.querySelector('div:last-child').textContent);

            const matchesBodyPart = bodyPart === '' || exerciseMuscles.includes(bodyPart);
            const matchesEquipment = equipment === '' || exerciseEquipment.includes(equipment);
            const matchesTarget = target === '' || exerciseMuscles.includes(target);
            const matchesSearch = searchTerm === '' ||
                                  exerciseName.includes(searchTerm) ||
                                  exerciseDescription.includes(searchTerm) ||
                                  exerciseMuscles.includes(searchTerm);

            if (matchesBodyPart && matchesEquipment && matchesTarget && matchesSearch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    bodyPartFilter.addEventListener('change', filterWorkouts);
    equipmentFilter.addEventListener('change', filterWorkouts);
    targetFilter.addEventListener('change', filterWorkouts);
    searchInput.addEventListener('input', filterWorkouts);

    // Initial filter application
    filterWorkouts();
});
