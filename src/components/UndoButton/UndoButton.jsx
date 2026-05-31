import './UndoButton.css';

export default function UndoButton({ onUndo, canUndo }) {
  return (
    <button className="undo-button" onClick={onUndo} disabled={!canUndo}>
      ↩ Undo
    </button>
  );
}
