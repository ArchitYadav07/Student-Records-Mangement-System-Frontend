import * as XLSX from 'xlsx';

/**
 * Exports an array of student objects to an Excel (.xlsx) file and triggers download.
 * @param {Array} students - Array of student objects
 * @param {string} [filename='students'] - Base filename (without extension)
 */
export function exportToExcel(students, filename = 'students') {
    // Prepare data with friendly column headers
    const data = students.map((s, index) => ({
        '#': index + 1,
        'Student Name': s.name,
        'Email Address': s.email,
        'Age': s.age,
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
        { wch: 5 },
        { wch: 28 },
        { wch: 36 },
        { wch: 8 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Trigger download
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Validates a student form object. Returns an errors object.
 * @param {Object} form
 * @returns {Object} errors
 */
export function validateStudent(form) {
    const errors = {};

    const name = form.name?.trim();
    const email = form.email?.trim();
    const age = form.age;

    if (!name) {
        errors.name = 'Name is required.';
    } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters.';
    } else if (name.length > 80) {
        errors.name = 'Name must be under 80 characters.';
    }

    if (!email) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (age === '' || age === null || age === undefined) {
        errors.age = 'Age is required.';
    } else {
        const ageNum = Number(age);
        if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
            errors.age = 'Age must be a whole number between 1 and 120.';
        }
    }

    return errors;
}

/**
 * Generates a unique numeric ID
 */
export function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Returns the initials for a given name (up to 2 chars)
 */
export function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
