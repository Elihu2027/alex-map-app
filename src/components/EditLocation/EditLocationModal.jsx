import './EditLocationModal.css';

export default function EditLocationModal({
  visible,
  name, onNameChange,
  link, onLinkChange,
  positionChanged,
  onChangePosition,
  onSave,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div className="edit-loc-overlay">
      <div className="edit-loc-card">
        <h3 className="edit-loc-title">Edit Location</h3>

        <label className="edit-loc-label">Name</label>
        <input
          className="edit-loc-input"
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          autoFocus
        />

        <label className="edit-loc-label">Map Link</label>
        <input
          className="edit-loc-input"
          type="url"
          value={link}
          onChange={e => onLinkChange(e.target.value)}
          placeholder="https://maps.google.com/..."
        />

        <div className="edit-loc-position-row">
          <button className="edit-loc-position-btn" onClick={onChangePosition}>
            ↖ Change Marker Position
          </button>
          {positionChanged && (
            <span className="edit-loc-position-badge">Position updated</span>
          )}
        </div>

        <div className="edit-loc-actions">
          <button className="edit-loc-btn edit-loc-btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="edit-loc-btn edit-loc-btn--save"
            onClick={onSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
