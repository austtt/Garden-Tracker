const { useState, useRef } = React;

function MyPlantsScreen({ plants, addPlant, updatePlant, deletePlant }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [photoBlob, setPhotoBlob] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    setCameraStream(stream);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => setPhotoBlob(blob), "image/jpeg", 0.9);
  };

  const handleAddPlant = async () => {
    if (!photoBlob) {
      alert("Take a photo of the plant first.");
      return;
    }

    const imageUrl = URL.createObjectURL(photoBlob);
    const plantIdResult = await runPlantId(photoBlob);

    addPlant({
      name: name || plantIdResult.label || "New Plant",
      notes,
      imageUrl,
      plantIdResult,
      disease: null,
    });

    setName("");
    setNotes("");
    setPhotoBlob(null);
  };

  return (
    <div className="card">
      <h2>My Plants</h2>

      <div className="field">
        <label>Plant Name (optional)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="If empty, we'll use the AI guess"
        />
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {!cameraStream && (
        <button className="button-secondary" onClick={startCamera}>
          Use Camera to Add Plant
        </button>
      )}

      {cameraStream && (
        <div style={{ marginTop: 8 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: 12 }}
          />
          <button
            className="button-secondary"
            style={{ marginTop: 8 }}
            onClick={capturePhoto}
          >
            Capture Plant Photo
          </button>
        </div>
      )}

      {photoBlob && (
        <div style={{ marginTop: 8 }}>
          <strong>Captured:</strong>
          <br />
          <img
            src={URL.createObjectURL(photoBlob)}
            alt="Plant"
            style={{ width: "100%", borderRadius: 12, marginTop: 4 }}
          />
        </div>
      )}

      <button
        className="button-primary"
        style={{ marginTop: 12 }}
        onClick={handleAddPlant}
      >
        Save Plant
      </button>

      <hr style={{ margin: "16px 0" }} />

      <div className="plant-list">
        {plants.length === 0 && (
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            You don't have any plants yet. Add one using the camera above.
          </p>
        )}

        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            updatePlant={updatePlant}
            deletePlant={deletePlant}
          />
        ))}
      </div>
    </div>
  );
}
