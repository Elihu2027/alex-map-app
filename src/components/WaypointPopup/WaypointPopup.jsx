import './WaypointPopup.css';

export default function WaypointPopup({ waypoint, visited, onToggle, onEdit }) {
  return (
    <div className="waypoint-popup">
      <h3 className="waypoint-popup__name">{waypoint.name}</h3>

      {waypoint.googleMapsUrl ? (
        <a
          href={waypoint.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="waypoint-popup__link"
        >
          Open in Maps ↗
        </a>
      ) : (
        <span className="waypoint-popup__link waypoint-popup__link--empty">
          No map link
        </span>
      )}

      <label className="waypoint-popup__visited-label">
        <input
          type="checkbox"
          className="waypoint-popup__checkbox"
          checked={visited}
          onChange={() => onToggle(waypoint.id)}
        />
        <span className={visited ? 'waypoint-popup__visited-text--checked' : ''}>
          {visited ? 'Visited ✓' : 'Mark as visited'}
        </span>
      </label>

      <button className="waypoint-popup__edit-btn" onClick={() => onEdit(waypoint)}>
        ✎ Edit
      </button>
    </div>
  );
}
