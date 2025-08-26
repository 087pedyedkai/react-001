import './study.css'
import { useState } from 'react';

type Subject = {
	name: string;
	grade: string;
};

const gradePoints: Record<string, number> = {
	'A': 4.0,
	'B+': 3.5,
	'B': 3.0,
	'C+': 2.5,
	'C': 2.0,
	'D+': 1.5,
	'D': 1.0,
	'F': 0.0,
	'W': 0.0,
};

const gradeOptions = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'];

export default function StudyListComponent() {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [subjectName, setSubjectName] = useState('');
	const [subjectGrade, setSubjectGrade] = useState('A');
	const [gpa, setGpa] = useState<number|null>(null);

	const addSubject = () => {
		if (!subjectName.trim()) return;
		setSubjects([...subjects, { name: subjectName.trim(), grade: subjectGrade }]);
		setSubjectName('');
		setSubjectGrade('A');
		setGpa(null);
	};

	const removeSubject = (idx: number) => {
		setSubjects(subjects.filter((_, i) => i !== idx));
		setGpa(null);
	};

	const calculateGPA = () => {
		const validSubjects = subjects.filter(s => s.grade !== 'W');
		if (validSubjects.length === 0) {
			setGpa(0);
			return;
		}
		const totalPoints = validSubjects.reduce((sum, s) => sum + (gradePoints[s.grade] ?? 0), 0);
		setGpa(Number((totalPoints / validSubjects.length).toFixed(2)));
	};

		return (
			<div className="center-page">
				<div className="study-list-container">
					<h2>ระบบบันทึกรายวิชาและเกรด</h2>
					<div className="input-row">
						<input
							type="text"
							placeholder="ชื่อวิชา"
							value={subjectName}
							onChange={e => setSubjectName(e.target.value)}
						/>
						<select value={subjectGrade} onChange={e => setSubjectGrade(e.target.value)}>
							{gradeOptions.map(g => (
								<option key={g} value={g}>{g}</option>
							))}
						</select>
						<button onClick={addSubject}>เพิ่มรายวิชา</button>
					</div>
					<ul className="subject-list">
						{subjects.map((subj, idx) => (
							<li key={idx} className="subject-item">
								<span style={{ color: subj.grade === 'F' ? 'red' : undefined }}>
									{subj.name} ({subj.grade})
								</span>
								<button className="remove-btn" onClick={() => removeSubject(idx)}>ลบ</button>
							</li>
						))}
					</ul>
					  <button className="gpa-btn" onClick={calculateGPA} disabled={subjects.length === 0}>คำนวณ GPA</button>
					{gpa !== null && (
						<div className="gpa-result">GPA: {gpa}</div>
					)}
				</div>
			</div>
		);
}