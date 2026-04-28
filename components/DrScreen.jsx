const { useState, useRef } = React;

function DrScreen({ plants, updatePlant }) {
  const [selectedId, setSelectedId] = useState(plants[0]?.id || null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const selectedPlant = plants.find((p) => p.id === selectedId) || null;

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

  const runDisease = async () => {
    if (!photoBlob) {
      alert("Capture a leaf photo first.");
      return;
    }
    const { overlayImage, summary } = await runDiseaseScan(photoBlob);

    setAnalysis(summary);

    // Draw overlay into canvas
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
    };
    img.src = overlayImage;

    if (selectedPlant) {
      updatePlant(selectedPlant.id, { disease: summary });
    }
  };

  return (
    <div className="card">
      <h2>Dr. Plant – Disease Scan</h2>

      <div className="field">
        <label>Select Plant</label>
        <select
          value={selectedId || ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          <option value="">None</option>
          {plants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!cameraStream && (
        <button className="button-secondary" onClick={startCamera}>
          Open Camera
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
            Capture Leaf Photo
          </button>
        </div>
      )}

      {photoBlob && (
        <div style={{ marginTop: 8 }}>
          <strong>Captured leaf:</strong>
          <img
            src={URL.createObjectURL(photoBlob)}
            alt="Leaf"
            style={{ width: "100%", borderRadius: 12, marginTop: 4 }}
          />
        </div>
      )}

      <button
        className="button-primary"
        style={{ marginTop: 12 }}
        onClick={runDisease}
      >
        Run On‑Device Disease Scan
      </button>

      {analysis && (
        <div className="disease-preview-container">
          <div className="disease-preview-box">
            <canvas ref={canvasRef} />
          </div>
          <div className="disease-text">
            <strong>{analysis.label}</strong>
            <br />
            Severity: {analysis.severity}%<br />
            <br />
            {analysis.explanation}
            <br />
            <br />
            <em>Suggested action:</em> {analysis.action}
          </div>
        </div>
      )}
    </div>
  );
}
