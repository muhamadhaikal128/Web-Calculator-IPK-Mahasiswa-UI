let semesterCount = 0;

function addSemester() {
    semesterCount++;
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';
    semesterDiv.innerHTML = `<h2>Semester ${semesterCount}</h2>
                             <div id="courses-${semesterCount}"></div>
                             <button type="button" onclick="addCourse(${semesterCount})">Tambah Mata Kuliah</button>`;
    document.getElementById('semester-container').appendChild(semesterDiv);
    addCourse(semesterCount);
}

function addCourse(semester) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course';
    courseDiv.innerHTML = `<label>Mata Kuliah: <input type="text" name="course"></label>
                           <label>SKS: <input type="number" name="credits"></label>
                           <label>Nilai: 
                               <select name="grade">
                                 <option value="A">A</option>
                                 <option value="A-">A-</option>
                                 <option value="B+">B+</option>
                                 <option value="B">B</option>
                                 <option value="B-">B-</option>
                                 <option value="C+">C+</option>
                                 <option value="C">C</option>
                               </select>
                           </label>`;
    document.getElementById(`courses-${semester}`).appendChild(courseDiv);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-semester-btn').addEventListener('click', addSemester);
    addSemester();

    const form = document.getElementById('calculator-form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const semesters = [];

        for (let i = 1; i <= semesterCount; i++) {
            const coursesDiv = document.getElementById(`courses-${i}`);
            const courseInputs = coursesDiv.querySelectorAll('.course');
            const courses = [];

            courseInputs.forEach((courseDiv) => {
                const course = courseDiv.querySelector("[name='course']").value;
                const credits = parseFloat(courseDiv.querySelector("[name='credits']").value);
                const grade = courseDiv.querySelector("[name='grade']").value;
                courses.push({ course, credits, grade });
            });

            semesters.push(courses);
        }

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ semesters }),
        })
        .then(response => response.json())
        .then(data => {
            let semesterScores = data.semester_scores.map((score, index) => `Semester ${index + 1}: ${score.toFixed(2)}`).join('<br>');
            let gpa = `IPK: ${data.gpa.toFixed(2)}`;
            resultDiv.innerHTML = `<p>${semesterScores}</p><p>${gpa}</p>`;
        });
    });
});

