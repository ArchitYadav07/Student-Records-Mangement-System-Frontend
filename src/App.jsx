import { useState, useCallback } from 'react';
import {
    Users, UserPlus, Download, Cpu, Search,
    LayoutDashboard, BookOpen, Settings
} from 'lucide-react';
import { ToastProvider, useToast } from './context/ToastContext';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import DeleteDialog from './components/DeleteDialog';
import { initialStudents } from './data/students';
import { exportToExcel, generateId } from './utils/helpers';

// ── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ children, onBackdropClick }) {
    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            onClick={e => { if (e.target === e.currentTarget) onBackdropClick(); }}
        >
            <div className="modal">{children}</div>
        </div>
    );
}

// ── Inner app ────────────────────────────────────────────────────────────────
function StudentsApp() {
    const { addToast } = useToast();

    const [students, setStudents] = useState(initialStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [modal, setModal] = useState(null);

    // ── CRUD ───────────────────────────────────────────────────────────────────
    const handleAdd = useCallback((formData) => {
        const newStudent = { id: generateId(), ...formData };
        setStudents(prev => [newStudent, ...prev]);
        setModal(null);
        addToast(`${formData.name} has been added successfully.`, 'success');
    }, [addToast]);

    const handleEdit = useCallback((formData) => {
        setStudents(prev =>
            prev.map(s => s.id === modal.student.id ? { ...s, ...formData } : s)
        );
        setModal(null);
        addToast(`${formData.name}'s record has been updated.`, 'success');
    }, [modal, addToast]);

    const handleDelete = useCallback(() => {
        const name = modal.student.name;
        setStudents(prev => prev.filter(s => s.id !== modal.student.id));
        setModal(null);
        addToast(`${name} has been removed.`, 'info');
    }, [modal, addToast]);

    // ── Export ─────────────────────────────────────────────────────────────────
    const handleExport = useCallback(() => {
        const q = searchQuery.trim().toLowerCase();
        const toExport = q
            ? students.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                String(s.age).includes(q)
            )
            : students;
        if (toExport.length === 0) { addToast('No records to export.', 'error'); return; }
        exportToExcel(toExport, q ? 'filtered_students' : 'all_students');
        addToast(`Exported ${toExport.length} record(s) to Excel.`, 'success');
    }, [students, searchQuery, addToast]);

    const avgAge = students.length > 0
        ? Math.round(students.reduce((s, x) => s + x.age, 0) / students.length)
        : '–';

    return (
        <div className="app">

            {/* ── Top Banner ── */}
            <div className="top-banner">
                <span className="top-banner-left">
                    🏭 &nbsp;S R Integrated Circuit India — Electronic Components &amp; Solutions
                </span>
                <span className="top-banner-right">
                    Developed by Archit Yadav
                </span>
            </div>

            {/* ── Header ── */}
            <header className="header">
                <div className="header-brand">
                    <div className="header-logo">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h1 className="header-title">S R Integrated Circuit India</h1>
                        <p className="header-subtitle">Student Records Management System</p>
                    </div>
                </div>

                <div className="header-stats">
                    <div className="stat-pill">
                        <span className="stat-value">{students.length}</span>
                        <span className="stat-label">Students</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-pill">
                        <span className="stat-value">{avgAge}</span>
                        <span className="stat-label">Avg Age</span>
                    </div>
                </div>
            </header>

            {/* ── Sub Navigation ── */}
            <nav className="sub-header" aria-label="Module navigation">
                <div className="sub-nav-item active">
                    <LayoutDashboard size={15} />
                    Students
                </div>
                <div className="sub-nav-item">
                    <BookOpen size={15} />
                    Courses
                </div>
                <div className="sub-nav-item">
                    <Users size={15} />
                    Departments
                </div>
                <div className="sub-nav-item">
                    <Settings size={15} />
                    Settings
                </div>
            </nav>

            {/* ── Main ── */}
            <main className="main">

                {/* Section heading */}
                <div className="section-heading">
                    <h2>Student Records</h2>
                    <div className="section-heading-line" />
                    <span className="section-badge">{students.length} Total</span>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-wrapper">
                        <Search size={16} className="search-icon" />
                        <input
                            id="search-students"
                            type="search"
                            className="search-input"
                            placeholder="Search by name, email, or age…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            aria-label="Search students"
                        />
                    </div>
                    <button
                        id="export-excel-btn"
                        className="btn btn-success"
                        onClick={handleExport}
                        title={searchQuery ? 'Download filtered results as Excel' : 'Download all students as Excel'}
                    >
                        <Download size={15} />
                        {searchQuery ? 'Export Filtered' : 'Export Excel'}
                    </button>
                    <button
                        id="add-student-btn"
                        className="btn btn-primary"
                        onClick={() => setModal({ type: 'add' })}
                    >
                        <UserPlus size={15} />
                        Add Student
                    </button>
                </div>

                {/* Table */}
                <StudentTable
                    students={students}
                    searchQuery={searchQuery}
                    onEdit={student => setModal({ type: 'edit', student })}
                    onDelete={student => setModal({ type: 'delete', student })}
                />
            </main>

            {/* ── Footer ── */}
            <footer className="footer">
                <div>
                    <span className="footer-brand">S R Integrated Circuit India</span>
                    &nbsp;— Student Records Management System
                </div>
                <div className="footer-dev">
                    Developed by <span>Archit Yadav</span>
                </div>
            </footer>

            {/* ── Modals ── */}
            {modal?.type === 'add' && (
                <Modal onBackdropClick={() => setModal(null)}>
                    <StudentForm mode="add" initialData={null} onSubmit={handleAdd} onClose={() => setModal(null)} />
                </Modal>
            )}
            {modal?.type === 'edit' && (
                <Modal onBackdropClick={() => setModal(null)}>
                    <StudentForm mode="edit" initialData={modal.student} onSubmit={handleEdit} onClose={() => setModal(null)} />
                </Modal>
            )}
            {modal?.type === 'delete' && (
                <Modal onBackdropClick={() => setModal(null)}>
                    <DeleteDialog student={modal.student} onConfirm={handleDelete} onClose={() => setModal(null)} />
                </Modal>
            )}
        </div>
    );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <ToastProvider>
            <StudentsApp />
        </ToastProvider>
    );
}
