const { useState } = React;

function OnboardingScreen({ location, setLocation, weather, onDone }) {
  const [localLocation, setLocalLocation] = useState(location);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = React.useRef(null);

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

  const handleSave = () => {
    setLocation(localLocation);
    onDone();
  };

  return (
    <div className="card">
      <h2>Welcome to Garden Tracker</h2>

      <div className="field">
        <label>Location</label>
        <input
          value={localLocation}
          onChange={(e) => setLocalLocation(e.target.value)}
          placeholder="Type your city or ZIP"
        />
      </div>

      <button className="button-secondary" onClick={() => refreshWeather(localLocation)}>
        Refresh Weather
      </button>

      {weather && (
        <p style={{ marginTop: 8, fontSize: "0.9rem" }}>
          Current: {weather.summary} · {weather.temp}°F
        </p>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h3>Take a photo of your garden</h3>
      {!cameraStream && (
        <button className="button-primary" onClick={startCamera}>
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
            Capture Photo
          </button>
        </div>
      )}

      {photoBlob && (
        <div style={{ marginTop: 8 }}>
          <strong>Captured:</strong>
          <br />
          <img
            src={URL.createObjectURL(photoBlob)}
            alt="Garden"
            style={{ width: "100%", borderRadius: 12, marginTop: 4 }}
          />
        </div>
      )}

      <button
        className="button-primary"
        style={{ marginTop: 16 }}
        onClick={handleSave}
      >
        Continue to My Plants
      </button>
    </div>
  );
}
