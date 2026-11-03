export const MIN_CONFIDENCE = 0.7

let modelPromise = null

function loadModel() {
  if (!modelPromise) {
    modelPromise = window.tmImage.load('/model.json', '/metadata.json').catch(err => {
      modelPromise = null
      throw err
    })
  }
  return modelPromise
}

export async function predictCategory(imageEl) {
  const model = await loadModel()
  const predictions = await model.predict(imageEl)
  const best = predictions.reduce((a, b) => (b.probability > a.probability ? b : a))
  return { label: best.className, probability: best.probability }
}

export function matchCategory(label, categories) {
  const key = label?.toLowerCase()
  if (!key || key === 'other') return null
  return categories.find(c => c.name?.toLowerCase().startsWith(key)) || null
}

export async function fileToImage(file) {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}
