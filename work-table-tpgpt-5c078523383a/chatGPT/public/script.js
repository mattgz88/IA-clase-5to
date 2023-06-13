
let maxTokensSlider = document.getElementById("maxTokensSlider");
let temperatureSlider = document.getElementById("temperatureSlider");

let temperatureNum = document.getElementById("temperatureNum");
let maxTokensNum = document.getElementById("maxTokensNum");

  // Agregar un evento de cambio al rango
maxTokensSlider.addEventListener("input", () => {
  // Obtener el valor del rango y actualizar el contenido del elemento
  maxTokensNum.value = maxTokensSlider.value;
});

temperatureSlider.addEventListener("input", () => {
  // Obtener el valor del rango y actualizar el contenido del elemento
  temperatureNum.value = temperatureSlider.value;
});


function sendQuestion() {
    let inputText = document.getElementById("inputText").value;
    let data = { text: inputText };
  
    fetch("/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      let textarea = document.getElementById("responseText")
      textarea.value = data; //Respuesta
      textarea.style.height = 0; //Reinicio
      textarea.style.height = (textarea.scrollHeight + 10) + "px"; //Ajuste
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function saveConfig() {
  let temperature = parseFloat(document.getElementById("temperatureSlider").value);
  let maxTokens = parseInt(document.getElementById("maxTokensSlider").value);


  let checkedValue = document.querySelector('.checkboxs:checked').value;

  let data = {
    temperature: temperature,
    maxTokens: maxTokens,
    modelNum: checkedValue
  };

  fetch("/config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(function(response) {
    return response.text();
  })
  .then(function(responseData) {
    // Procesar la respuesta del servidor
    console.log(responseData);
  })
  .catch(function(error) {
    console.log("Error: " + error);
  });
}