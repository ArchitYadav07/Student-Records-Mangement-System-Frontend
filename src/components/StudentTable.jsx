import { useState, useMemo } from 'react';
import {
    Pencil, Trash2, ChevronUp, ChevronDown,
    ChevronsUpDown, Search, Users
} from 'lucide-react';
import { getInitials } from '../utils/helpers';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

/**
 * StudentTable — renders the sortable, paginated table of students.
 * Props:
 *   students: array
 *   searchQuery: string
 *   onEdit(student): open edit modal
 *   onDelete(student): open delete dialog
 */
export default function StudentTable({ students, searchQuery, onEdit, onDelete }) {
    const [sortField, setSortField] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter
    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return students;
        return students.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            String(s.age).includes(q)
        );
    }, [students, searchQuery]);

    // Sort
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let va = a[sortField], vb = b[sortField];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtered, sortField, sortDir]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
        setPage(1);
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
        return sortDir === 'asc'
            ? <ChevronUp size={13} style={{ color: 'var(--accent)' }} />
            : <ChevronDown size={13} style={{ color: 'var(--accent)' }} />;
    };

    const start = sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, sorted.length);

    return (
        <div className="card">
            <div className="table-wrapper">
                <table className="table" aria-label="Students table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className="sortable" onClick={() => handleSort('name')} aria-sort={sortField === 'name' ? sortDir : 'none'}>
                                <span className="th-inner">Student <SortIcon field="name" /></span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('email')} aria-sort={sortField === 'email' ? sortDir : 'none'}>
                                <span className="th-inner">Email <SortIcon field="email" /></span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('age')} aria-sort={sortField === 'age' ? sortDir : 'none'}>
                                <span className="th-inner">Age <SortIcon field="age" /></span>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    {searchQuery ? (
                                        <div className="empty-state">
                                            <Search size={48} className="empty-icon" />
                                            <h3>No results found</h3>
                                            <p>No students match &ldquo;{searchQuery}&rdquo;. Try a different search term.</p>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <Users size={48} className="empty-icon" />
                                            <h3>No students yet</h3>
                                            <p>Click &ldquo;Add Student&rdquo; to get started.</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            paginated.map((student, idx) => (
                                <tr key={student.id}>
                                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                                        {(safePage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td>
                                        <div className="td-name">
                                            <div className="avatar" style={{ background: getAvatarGradient(student.name) }}>
                                                {getInitials(student.name)}
                                            </div>
                                            <span className="name-text">{student.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="email-text">{student.email}</span>
                                    </td>
                                    <td>
                                        <span className="age-badge">{student.age} yrs</span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                className="btn btn-secondary btn-icon"
                                                onClick={() => onEdit(student)}
                                                title={`Edit ${student.name}`}
                                                aria-label={`Edit ${student.name}`}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                className="btn btn-danger btn-icon"
                                                onClick={() => onDelete(student)}
                                                title={`Delete ${student.name}`}
                                                aria-label={`Delete ${student.name}`}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p className="pagination-info">
                        {sorted.length === 0
                            ? 'No records'
                            : `Showing ${start}–${end} of ${sorted.length} student${sorted.length !== 1 ? 's' : ''}`}
                    </p>
                    <select
                        value={pageSize}
                        onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-secondary)',
                            padding: '4px 8px',
                            fontSize: 13,
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                        }}
                        aria-label="Rows per page"
                    >
                        {PAGE_SIZE_OPTIONS.map(n => (
                            <option key={n} value={n}>{n} per page</option>
                        ))}
                    </select>
                </div>
                <div className="pagination-controls">
                    <button
                        className="page-btn"
                        onClick={() => setPage(1)}
                        disabled={safePage === 1}
                        aria-label="First page"
                    >«</button>
                    <button
                        className="page-btn"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        aria-label="Previous page"
                    >‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                        .reduce((acc, p, i, arr) => {
                            if (i > 0 && arr[i - 1] !== p - 1) acc.push('...');
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((item, i) =>
                            item === '...'
                                ? <span key={`ellipsis-${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                                : <button
                                    key={item}
                                    className={`page-btn ${safePage === item ? 'active' : ''}`}
                                    onClick={() => setPage(item)}
                                    aria-label={`Page ${item}`}
                                    aria-current={safePage === item ? 'page' : undefined}
                                >{item}</button>
                        )
                    }
                    <button
                        className="page-btn"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        aria-label="Next page"
                    >›</button>
                    <button
                        className="page-btn"
                        onClick={() => setPage(totalPages)}
                        disabled={safePage === totalPages}
                        aria-label="Last page"
                    >»</button>
                </div>
            </div>
        </div>
    );
}

// Deterministic gradient based on name string
function getAvatarGradient(name) {
    const gradients = [
        'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'linear-gradient(135deg, #0ea5e9, #6366f1)',
        'linear-gradient(135deg, #10b981, #0ea5e9)',
        'linear-gradient(135deg, #f59e0b, #ef4444)',
        'linear-gradient(135deg, #ec4899, #8b5cf6)',
        'linear-gradient(135deg, #14b8a6, #10b981)',
        'linear-gradient(135deg, #f97316, #f59e0b)',
        'linear-gradient(135deg, #8b5cf6, #ec4899)',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
    return gradients[Math.abs(hash) % gradients.length];
}
