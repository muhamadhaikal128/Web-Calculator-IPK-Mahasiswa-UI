from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

GRADE_TO_POINT = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0
}

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.json
        semesters = data.get('semesters', [])
        total_points = 0
        total_credits = 0
        semester_scores = []

        for semester in semesters:
            semester_points = 0
            semester_credits = 0

            for course in semester:
                grade = GRADE_TO_POINT.get(course.get('grade', ''), 0)
                credits = course.get('credits', 0)
                semester_points += grade * credits
                semester_credits += credits

            semester_score = semester_points / semester_credits if semester_credits > 0 else 0
            semester_scores.append(semester_score)
            total_points += semester_points
            total_credits += semester_credits

        gpa = total_points / total_credits if total_credits > 0 else 0
        return jsonify({"semester_scores": semester_scores, "gpa": gpa})

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
