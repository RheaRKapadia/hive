// document.addEventListener('DOMContentLoaded', function () {
//     const days = document.querySelectorAll('.day');

//     days.forEach(day => {
//         const dayNumber = parseInt(day.dataset.day, 10);
//         const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];

//         if (completedDays.includes(dayNumber)) {
//             day.classList.add('completed');
//         }

//         day.addEventListener('click', function () {
//             if (day.classList.contains('completed')) {
//                 day.classList.remove('completed');
//                 completedDays.splice(completedDays.indexOf(dayNumber), 1);
//             } else {
//                 day.classList.add('completed');
//                 completedDays.push(dayNumber);
//             }

//             localStorage.setItem('completedDays', JSON.stringify(completedDays));
//         });
//     });
// });
