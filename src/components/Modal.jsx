import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children, confirmText, onConfirm, isDanger = false }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and lock body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    // Cleanup on unmount
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null; // Don't render if closed

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop click from closing modal when clicking inside */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {onConfirm && (
          <div className="modal-footer">
            <button className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className={`modal-confirm ${isDanger ? 'danger' : ''}`}
              onClick={onConfirm}
            >
              {confirmText || 'Confirm'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
