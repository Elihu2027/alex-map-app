import './BackButton.css';

export default function BackButton({ onBack, regionName }) {
  return (
    <button className="back-button" onClick={onBack}>
      ← Back to Map
    </button>
  );
}
