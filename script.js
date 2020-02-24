const imageUpload = document.getElementById('imageUpload')

const fileList = [];
const resultList = [];


  imageUpload.addEventListener('change', async () =>{
    
  })
  

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    for(var j=0; j < imageUpload.files.length; j++){
      if (image) image.remove()
      if (canvas) canvas.remove()
      image = await faceapi.bufferToImage(imageUpload.files[j])
      container.append(image)
      canvas = faceapi.createCanvasFromMedia(image)
      container.append(canvas)
      const displaySize = { width: image.width, height: image.height }
      faceapi.matchDimensions(canvas, displaySize)
      const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        drawBox.draw(canvas)
        if(result.label!="unknown"){
          
          if ( !fileList.includes(imageUpload.files[j].name) ) {
            fileList.push(imageUpload.files[j].name)

        }
        console.log(fileList)
        }
      
      })
    }
        const url = 'http://127.0.0.1:5000/postjson'
        $.ajax({
          type: "POST",
          url: url,
          data: JSON.stringify(fileList),
          contentType: "application/json; charset=utf-8",
          dataType: "json",

      })
  })
  
}

function loadLabeledImages() {
  const labels = ['Hagan']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 7; i++) {
        //const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
        //https://github.com/Sami-Rocks/face-recognition/tree/master/labeled_images/Aidle
        //https://github.com/Sami-Rocks/face-recognition/blob/multiple/labeled_images/Hagan/3.jpg?raw=true
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/Sami-Rocks/face-recognition/multiple/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        console.log(detections)
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
