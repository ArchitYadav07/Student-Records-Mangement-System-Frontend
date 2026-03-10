import { useState, useEffect } from 'react';
import { X, User, Mail, Hash, AlertCircle } from 'lucide-react';
import { validateStudent } from '../utils/helpers';

const EMPTY_FORM = { name: '', email: '', age: '' };

/**
 * StudentForm — used for both Add and Edit modes.
 * Props:
 *   mode: 'add' | 'edit'
 *   initialData: student object (for edit) or null
 *   onSubmit(formData): called with { name, email, age }
 *   onClose(): close the modal
 */
export default function StudentForm({ mode, initialData, onSubmit, onClose }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Pre-fill form when editing
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setForm({
                name: initialData.name,
                email: initialData.email,
                age: String(initialData.age),
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
        setTouched({});
    }, [mode, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        // Validate on blur
        const fieldErrors = validateStudent({ ...form, [name]: e.target.value });
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, age: true });
        const validationErrors = validateStudent(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setSubmitting(true);
        // Simulate async operation
        await new Promise(r => setTimeout(r, 600));
        onSubmit({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            age: Number(form.age),
        });
        setSubmitting(false);
    };

    const isEdit = mode === 'edit';

    return (
        <>
            <div className="modal-header">
                <div className="modal-title-group">
                    <div className="modal-icon accent">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="modal-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
                        <p className="modal-subtitle">
                            {isEdit ? 'Update the student information below.' : 'Fill in the details to add a new student.'}
                        </p>
                    </div>
                </div>
                <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
                    <X size={16} />
                </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body">
                    <div className="form-grid">
                        {/* Name */}
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                <User size={13} />
                                Full Name
                                <span className="required-star">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Alice Johnson"
                                className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                                autoComplete="off"
                                autoFocus
                            />
                            {touched.name && errors.name && (
                                <span className="form-error">
                                    <AlertCircle size={12} />
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <Mail size={13} />
                                Email Address
                                <span className="required-star">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. alice@university.edu"
                                className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                                autoComplete="off"
                            />
                            {touched.email && errors.email && (
                                <span className="form-error">
                                    <AlertCircle size={12} />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        {/* Age */}
                        <div className="form-group">
                            <label htmlFor="age" className="form-label">
                                <Hash size={13} />
                                Age
                                <span className="required-star">*</span>
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                min="1"
                                max="120"
                                value={form.age}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. 21"
                                className={`form-input ${touched.age && errors.age ? 'error' : ''}`}
                            />
                            {touched.age && errors.age && (
                                <span className="form-error">
                                    <AlertCircle size={12} />
                                    {errors.age}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? (
                            <>
                                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                {isEdit ? 'Saving...' : 'Adding...'}
                            </>
                        ) : (
                            isEdit ? 'Save Changes' : 'Add Student'
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}
