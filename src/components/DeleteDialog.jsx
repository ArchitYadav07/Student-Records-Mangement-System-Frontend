import { AlertTriangle, X } from 'lucide-react';

/**
 * DeleteDialog — confirmation dialog before deleting a student.
 * Props:
 *   student: { name }
 *   onConfirm(): perform delete
 *   onClose(): cancel
 */
export default function DeleteDialog({ student, onConfirm, onClose }) {
    return (
        <>
            <div className="modal-header">
                <div className="modal-title-group">
                    <div className="modal-icon danger">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h2 className="modal-title">Delete Student</h2>
                        <p className="modal-subtitle">This action cannot be undone.</p>
                    </div>
                </div>
                <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
                    <X size={16} />
                </button>
            </div>

            <div className="modal-body">
                <div className="delete-dialog-body">
                    <div className="delete-warning-icon">
                        <AlertTriangle size={28} />
                    </div>
                    <p className="delete-name">{student?.name}</p>
                    <p className="delete-desc">
                        Are you sure you want to permanently delete this student record?
                        All associated data will be lost.
                    </p>
                </div>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={onConfirm} id="confirm-delete-btn">
                    <AlertTriangle size={14} />
                    Delete Student
                </button>
            </div>
        </>
    );
}
