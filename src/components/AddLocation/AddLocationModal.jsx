import './AddLocationModal.css';

export default function AddLocationModal({
  step,
  link, onLinkChange,
  name, onNameChange,
  onContinueFromLink,
  onContinueFromName,
  onBack,
  onCancel,
}) {
  if (step !== 'link' && step !== 'name') return null;

  return (
    <div className="add-location-overlay">
      <div className="add-location-card">
        {step === 'link' && (
          <>
            <h3 className="add-location-title">Add Location</h3>
            <p className="add-location-subtitle">Paste a Google Maps or Apple Maps link</p>
            <input
              className="add-location-input"
              type="url"
              value={link}
              onChange={e => onLinkChange(e.target.value)}
              placeholder="https://maps.google.com/..."
              autoFocus
            />
            <div className="add-location-actions">
              <button className="add-loc-btn add-loc-btn--cancel" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="add-loc-btn add-loc-btn--primary"
                onClick={onContinueFromLink}
                disabled={!link.trim()}
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {step === 'name' && (
          <>
            <h3 className="add-location-title">Name this location</h3>
            <p className="add-location-subtitle">Enter a name for this waypoint</p>
            <input
              className="add-location-input"
              type="text"
              value={name}
              onChange={e => onNameChange(e.target.value)}
              placeholder="e.g. Golden Gate Bridge"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && onContinueFromName()}
            />
            <div className="add-location-actions">
              <button className="add-loc-btn add-loc-btn--back" onClick={onBack}>
                ← Back
              </button>
              <button className="add-loc-btn add-loc-btn--cancel" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="add-loc-btn add-loc-btn--primary"
                onClick={onContinueFromName}
                disabled={!name.trim()}
              >
                Continue →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
