const { useRef, useState } = React;

function IdentifyScreen({ addPlant }) {
  const [photoBlob, setPhotoBlob] = useState(null);
  const [result, setResult] = useState(null);
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

  const runId = async () => {
    if (!photoBlob) {
      alert("Capture a plant photo first.");
      return;
    }
    const res = await runPlantId(photoBlob);
    setResult(res);
  };

  return (
    <div className="card">
      <h2>Identify a Plant</h2>

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
            Capture Plant Photo
          </button>
        </div>
      )}

      {photoBlob && (
        <div style={{ marginTop: 8 }}>
          <img
            src={URL.createObjectURL(photoBlob)}
            alt="Plant"
            style={{ width: "100%", borderRadius: 12 }}
          />
        </div>
      )}

      <button
        className="button-primary"
        style={{ marginTop: 12 }}
        onClick={runId}
      >
        Run On‑Device Plant ID
      </button>

      {result && (
        <p style={{ marginTop: 8, fontSize: "0.9rem" }}>
          AI thinks this is <strong>{result.label}</strong> (
          {(result.score * 100).toFixed(0)}%).
        </p>
      )}
    </div>
  );
}
