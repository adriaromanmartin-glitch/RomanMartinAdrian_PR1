// Exportem la funció perquè pugui ser utilitzada des d'altres fitxers
export function setupCounter(element) {

  // Variable interna que guarda el valor actual del comptador
  let counter = 0

  // Funció que actualitza el valor del comptador
  // i modifica el contingut HTML de l'element
  const setCounter = (count) => {

    // Assignem el nou valor al comptador
    counter = count

    // Actualitzem el text que es mostra a pantalla
    element.innerHTML = `Count is ${counter}`
  }

  // Afegim un event listener a l'element
  // Cada vegada que es fa clic, incrementa el comptador en 1
  element.addEventListener('click', () => setCounter(counter + 1))

  // Inicialitzem el comptador amb valor 0
  setCounter(0)
}
