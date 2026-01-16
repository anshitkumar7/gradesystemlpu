import { useState, useEffect } from 'react';
import { Calculator, GraduationCap, X } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  credits: string;
  marks: string;
  grade: string;
  gradePoint: number;
}

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [tgpa, setTgpa] = useState(0);

  useEffect(() => {
    const initialSubjects: Subject[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: '',
      credits: '',
      marks: '',
      grade: '-',
      gradePoint: 0,
    }));
    setSubjects(initialSubjects);
  }, []);

  const getGradeFromMarks = (marks: number): { grade: string; gradePoint: number } => {
    if (marks >= 90) return { grade: 'O', gradePoint: 10 };
    if (marks >= 80) return { grade: 'A+', gradePoint: 9 };
    if (marks >= 70) return { grade: 'A', gradePoint: 8 };
    if (marks >= 60) return { grade: 'B+', gradePoint: 7 };
    if (marks >= 50) return { grade: 'B', gradePoint: 6 };
    if (marks >= 40) return { grade: 'C', gradePoint: 5 };
    return { grade: 'F', gradePoint: 0 };
  };

  const handleMarksChange = (id: number, value: string) => {
    const marks = Math.min(Math.max(parseInt(value) || 0, 0), 100);
    setSubjects(prev =>
      prev.map(subject => {
        if (subject.id === id) {
          const { grade, gradePoint } = getGradeFromMarks(marks);
          return {
            ...subject,
            marks: value,
            grade,
            gradePoint,
          };
        }
        return subject;
      })
    );
  };

  const handleCreditsChange = (id: number, value: string) => {
    const credits = Math.max(parseInt(value) || 0, 0);
    setSubjects(prev =>
      prev.map(subject =>
        subject.id === id ? { ...subject, credits: credits > 0 ? credits.toString() : '' } : subject
      )
    );
  };

  const handleNameChange = (id: number, value: string) => {
    setSubjects(prev =>
      prev.map(subject => (subject.id === id ? { ...subject, name: value } : subject))
    );
  };

  const addSubject = () => {
    const newSubject: Subject = {
      id: subjects.length + 1,
      name: '',
      credits: '',
      marks: '',
      grade: '-',
      gradePoint: 0,
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    }
  };

  const calculateTGPA = () => {
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      const credits = parseFloat(subject.credits) || 0;
      const marks = parseFloat(subject.marks) || 0;

      if (credits > 0 && marks > 0) {
        totalWeightedPoints += subject.gradePoint * credits;
        totalCredits += credits;
      }
    });

    if (totalCredits === 0) {
      alert('Please enter at least one subject with valid credits and marks.');
      return;
    }

    const calculatedTGPA = totalWeightedPoints / totalCredits;
    setTgpa(parseFloat(calculatedTGPA.toFixed(2)));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-red-600 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              LPUGPA
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 font-light">TGPA Calculator</p>
          <p className="text-sm md:text-base text-gray-500 mt-2">
            Estimate your semester TGPA for LPU exams
          </p>
        </div>

        <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/5 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/10">
          <div className="mb-6 p-4 md:p-6 bg-gradient-to-r from-red-900/20 to-red-950/20 rounded-2xl border border-red-900/30">
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-red-400 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Grading System Reference
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4 text-xs md:text-sm">
              {[
                { grade: 'O', point: '10', range: '90-100' },
                { grade: 'A+', point: '9', range: '80-89' },
                { grade: 'A', point: '8', range: '70-79' },
                { grade: 'B+', point: '7', range: '60-69' },
                { grade: 'B', point: '6', range: '50-59' },
                { grade: 'C', point: '5', range: '40-49' },
                { grade: 'F', point: '0', range: '<40' },
              ].map(item => (
                <div key={item.grade} className="text-center p-2 bg-black/30 rounded-lg">
                  <div className="font-bold text-red-400 text-base md:text-lg">{item.grade}</div>
                  <div className="text-gray-400">{item.point} GP</div>
                  <div className="text-gray-600 text-xs">{item.range}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-red-900/30">
                  <th className="text-left p-2 md:p-3 text-gray-400 font-medium">#</th>
                  <th className="text-left p-2 md:p-3 text-gray-400 font-medium min-w-[150px]">
                    Course Name
                    {/* setting up github */}
                  </th>
                  <th className="text-center p-2 md:p-3 text-gray-400 font-medium">Credits</th>
                  <th className="text-center p-2 md:p-3 text-gray-400 font-medium">Marks</th>
                  <th className="text-center p-2 md:p-3 text-gray-400 font-medium">Grade</th>
                  <th className="text-center p-2 md:p-3 text-gray-400 font-medium">GP</th>
                  <th className="text-center p-2 md:p-3 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr
                    key={subject.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-2 md:p-3 text-gray-500">{index + 1}</td>
                    <td className="p-2 md:p-3">
                      <input
                        type="text"
                        value={subject.name}
                        onChange={e => handleNameChange(subject.id, e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-gray-600"
                      />
                    </td>
                    <td className="p-2 md:p-3">
                      <input
                        type="number"
                        value={subject.credits}
                        onChange={e => handleCreditsChange(subject.id, e.target.value)}
                        min="0"
                        placeholder="0"
                        className="w-full max-w-[80px] mx-auto bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white"
                      />
                    </td>
                    <td className="p-2 md:p-3">
                      <input
                        type="number"
                        value={subject.marks}
                        onChange={e => handleMarksChange(subject.id, e.target.value)}
                        min="0"
                        max="100"
                        placeholder="0"
                        className="w-full max-w-[80px] mx-auto bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white"
                      />
                    </td>
                    <td className="p-2 md:p-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-900/30 text-red-400 font-semibold">
                        {subject.grade}
                      </span>
                    </td>
                    <td className="p-2 md:p-3 text-center">
                      <span className="text-gray-300 font-semibold">{subject.gradePoint}</span>
                    </td>
                    <td className="p-2 md:p-3 text-center">
                      <button
                        onClick={() => removeSubject(subject.id)}
                        disabled={subjects.length === 1}
                        className="p-1 text-red-500 hover:text-red-400 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <button
              onClick={addSubject}
              className="w-full md:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-red-600/50 transition-all duration-300 text-gray-300 hover:text-white"
            >
              + Add Subject
            </button>
            <button
              onClick={calculateTGPA}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/50 transform hover:scale-105"
            >
              Calculate TGPA
            </button>
          </div>
        </div>

        <footer className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 text-xs md:text-sm">
            Unofficial TGPA Calculator for LPU Students
          </p>
          <p className="text-gray-700 text-xs mt-2">
            Built by <span className="text-red-500 font-semibold">Anshit</span>
          </p>
        </footer>
      </div>

      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-3xl p-6 md:p-10 max-w-md w-full shadow-2xl shadow-red-900/50 animate-scaleIn">
            <div className="text-center">
              <div className="mb-6">
                <GraduationCap className="w-16 h-16 md:w-20 md:h-20 mx-auto text-red-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Your Estimated TGPA
              </h2>
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-6">
                {tgpa}
              </div>
              <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed">
                This TGPA is an estimation based on entered marks.
              </p>
              <button
                onClick={() => setShowResult(false)}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/50 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
