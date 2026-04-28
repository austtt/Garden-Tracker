async function loadVisionFileset() {
  const { FilesetResolver } = window.MPTasks;
  return await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
}

let plantIdModel = null;
let diseaseModel = null;

async function ensurePlantIdModel() {
  if (plantIdModel) return plantIdModel;
  const { ImageClassifier } = window.MPTasks;
  const fileset = await loadVisionFileset();
  plantIdModel = await ImageClassifier.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/image_classifier/efficientnet_lite0/float32/1/efficientnet_lite0.tflite",
    },
    maxResults: 3,
  });
  return plantIdModel;
}

async function ensureDiseaseModel() {
  if (diseaseModel) return diseaseModel;
  const { ImageSegmenter } = window.MPTasks;
  const fileset = await loadVisionFileset();
  diseaseModel = await ImageSegmenter.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite",
    },
    outputCategoryMask: true,
  });
  return diseaseModel;
}

function blobToImage(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.src = url;
  });
}

// On-device plant ID
async function runPlantId(blob) {
  const model = await ensurePlantIdModel();
  const img = await blobToImage(blob);
  const result = model.classify(img);
  const top = result.classifications[0].categories[0];
  return {
    label: top.categoryName,
    score: top.score,
  };
}

// On-device disease scan with overlay + summary
async function runDiseaseScan(blob) {
  const model = await ensureDiseaseModel();
  const img = await blobToImage(blob);

  const result = model.segment(img);
  const mask = result.categoryMask;
  const width = mask.width;
  const height = mask.height;
  const maskData = new Uint8ClampedArray(mask.data);

  // Build overlay canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);

  let diseasedCount = 0;
  let leafCount = 0;

  for (let i = 0; i < maskData.length; i++) {
    const v = maskData[i]; // 0..255
    const idx = i * 4;

    // Simple heuristic:
    // treat mid-range as leaf, high as diseased
    if (v > 40) {
      leafCount++;
      if (v > 160) diseasedCount++;

      const isDiseased = v > 160;
      const color = isDiseased ? [229, 62, 62] : [56, 161, 105]; // red / green
      imageData.data[idx] = color[0];
      imageData.data[idx + 1] = color[1];
      imageData.data[idx + 2] = color[2];
      imageData.data[idx + 3] = 90; // ~35% opacity
    } else {
      imageData.data[idx] = 0;
      imageData.data[idx + 1] = 0;
      imageData.data[idx + 2] = 0;
      imageData.data[idx + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const severity = leafCount
    ? Math.round((diseasedCount / leafCount) * 100)
    : 0;

  let label = "Healthy";
  let explanation =
    "The leaf appears mostly healthy with minimal visible disease.";
  let action = "Continue your current care routine and monitor occasionally.";

  if (severity > 10 && severity <= 30) {
    label = "Mild Disease";
    explanation =
      "There are some early signs of disease on the leaf surface.";
    action =
      "Remove affected leaves if possible and improve airflow. Monitor closely.";
  } else if (severity > 30) {
    label = "Significant Disease";
    explanation =
      "A large portion of the leaf appears affected by disease.";
    action =
      "Consider pruning heavily affected areas and researching targeted treatment for common leaf diseases.";
  }

  const overlayImage = canvas.toDataURL("image/png");

  return {
    overlayImage,
    summary: {
      label,
      severity,
      explanation,
      action,
    },
  };
}
