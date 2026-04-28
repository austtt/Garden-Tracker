const { useState } = React;

function PlantCard({ plant, updatePlant, deletePlant }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(plant.name);
  const [notes, setNotes] = useState(plant.notes || "");

  const save = () => {
    updatePlant(plant.id, { name, notes });
    setEditing(false);
  };

  const sendToClaude = () => {
    const payload = {
      name: plant.name,
      notes: plant.notes,
      plantIdResult: plant.plantIdResult,
      disease: plant.disease,
    };
    console.log("Send this to Claude:", payload);
    alert("Claude payload prepared. Check console to copy.");
  };

  return (
    <div className="plant-card">
      {plant.imageUrl && (
        <img src={plant.imageUrl} alt={plant.name} />
      )}
      <div className="plant-card-main">
        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: 4 }}
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </>
        ) : (
          <>
            <strong>{plant.name}</strong>
            {plant.plantIdResult && (
              <div style={{ fontSize: "0.8rem", color: "#555" }}>
                AI guess: {plant.plantIdResult.label} (
                {(plant.plantIdResult.score * 100).toFixed(0)}%)
              </div>
            )}
            {plant.disease && (
              <div style={{ fontSize: "0.8rem", color: "#c53030" }}>
                Disease: {plant.disease.label} · Severity:{" "}
                {plant.disease.severity}%
              </div>
            )}
            {plant.notes && (
              <p style={{ fontSize: "0.85rem", marginTop: 4 }}>{plant.notes}</p>
            )}
          </>
        )}
      </div>
      <div className="plant-card-actions">
        {editing ? (
          <button className="button-secondary" onClick={save}>
            Save
          </button>
        ) : (
          <button
            className="button-secondary"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
        <button
          className="button-danger"
          onClick={() => deletePlant(plant.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={sendToClaude}>
          Send to Claude
        </button>
      </div>
    </div>
  );
}
