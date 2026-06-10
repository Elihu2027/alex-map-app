import { useState } from 'react';
import './ResetButton.css';

export default function ResetButton({ onReset }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleConfirm() {
    setShowConfirm(false);
    onReset();
  }

  return (
    <>
      <button className="reset-button" onClick={() => setShowConfirm(true)}>
        Reset All Data
      </button>

      {showConfirm && (
        <div className="reset-overlay" onClick={() => setShowConfirm(false)}>
          <div className="reset-dialog" onClick={e => e.stopPropagation()}>
            <h2 className="reset-dialog__title">Reset All Data?</h2>
            <p className="reset-dialog__message">
              This will permanently delete all saved progress and any locations you've added.
              This action cannot be undone.
            </p>
            <div className="reset-dialog__actions">
              <button className="reset-dialog__cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="reset-dialog__confirm" onClick={handleConfirm}>
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
