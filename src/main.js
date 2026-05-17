// Importem els estils CSS de l'aplicació
import './style.css';

// Importem el fitxer del canvas p5.js
import './sketch.js';

// Importem la funció que actualitza els visuals del canvas
import { updateSketch } from './sketch.js';

// Importem les funcionalitats de vibració hàptica de Capacitor
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Importem el sistema d'emmagatzematge local de Capacitor
import { Preferences } from '@capacitor/preferences';


// SELECCIÓ D'ELEMENTS DEL DOM

// Botó per mostrar/amagar la configuració
const settingsBtn = document.querySelector('#settingsBtn');

// Panell de configuració
const settingsPanel = document.querySelector('#settingsPanel');

// Botó per guardar configuració
const saveSettingsBtn = document.querySelector('#saveSettingsBtn');

// Inputs de configuració
const minutesInput = document.querySelector('#minutesInput');
const sizeInput = document.querySelector('#sizeInput');
const nightModeInput = document.querySelector('#nightModeInput');

// Elements del temporitzador
const timerText = document.querySelector('#timerText');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');


// VARIABLES DEL TEMPORITZADOR

// Temps total en segons (5 minuts inicialment)
let totalSeconds = 5 * 60;

// Temps restant actual
let remainingSeconds = totalSeconds;

// Variable que guarda l'interval del temporitzador
let intervalId = null;

// Controla si el temporitzador està actiu
let isRunning = false;


// CONFIGURACIÓ DE L'APP

// Objecte amb les preferències de l'usuari
let settings = {

  // Duració de la sessió en minuts
  minutes: 5,

  // Mida dels elements visuals
  visualSize: 80,

  // Mode nit activat/desactivat
  nightMode: false,
};


// FUNCIÓ DE VIBRACIÓ HÀPTICA

// Funció asíncrona per generar vibració
async function vibrate(style = ImpactStyle.Light) {

  try {

    // Genera vibració segons l'estil indicat
    await Haptics.impact({ style });

  } catch (error) {

    // Missatge d'error si el navegador no suporta hàptics
    console.log('Haptics no disponible en navegador:', error);
  }
}


// CARREGAR CONFIGURACIÓ GUARDADA

// Recupera configuració desada localment
async function loadSettings() {

  // Llegim les dades guardades
  const saved = await Preferences.get({ key: 'focusGardenSettings' });

  // Si existeixen dades guardades
  if (saved.value) {

    // Convertim el JSON a objecte JavaScript
    settings = JSON.parse(saved.value);
  }

  // Actualitzem els inputs amb els valors carregats
  minutesInput.value = settings.minutes;
  sizeInput.value = settings.visualSize;
  nightModeInput.checked = settings.nightMode;

  // Apliquem configuració a la interfície
  applySettings();
}

// GUARDAR CONFIGURACIÓ

// Desa configuració de l'usuari
async function saveSettings() {

  // Llegim valors dels inputs
  settings.minutes = Number(minutesInput.value);
  settings.visualSize = Number(sizeInput.value);
  settings.nightMode = nightModeInput.checked;

  // Guardem dades en format JSON
  await Preferences.set({
    key: 'focusGardenSettings',
    value: JSON.stringify(settings),
  });

  // Actualitzem la interfície
  applySettings();

  // Vibració de confirmació
  await vibrate(ImpactStyle.Medium);
}

// APLICAR CONFIGURACIÓ

// Actualitza la interfície segons configuració
function applySettings() {

  // Activa o desactiva la classe CSS "night"
  document.body.classList.toggle('night', settings.nightMode);

  // Actualitza temps total segons minuts configurats
  totalSeconds = settings.minutes * 60;

  // Reinicia el temps restant
  remainingSeconds = totalSeconds;

  // Actualitza text del temporitzador
  updateTimerText();

  // Actualitza canvas visual
  updateCanvas();
}

// ACTUALITZAR TEXT DEL TEMPORITZADOR

// Mostra el temps restant a pantalla
function updateTimerText() {

  // Convertim segons a minuts
  const minutes = Math.floor(remainingSeconds / 60);

  // Calculem segons restants
  const seconds = remainingSeconds % 60;

  // Mostrem temps format MM:SS
  timerText.textContent =
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}


// ACTUALITZAR CANVAS

// Actualitza els visuals del canvas p5.js
function updateCanvas() {

  // Calculem progrés del temporitzador
  const progress = 1 - remainingSeconds / totalSeconds;

  // Enviem dades al sketch
  updateSketch(progress, settings.visualSize, settings.nightMode);
}


// INICIAR TEMPORITZADOR

// Funció principal del temporitzador
async function startTimer() {

  // Evitem múltiples temporitzadors simultanis
  if (isRunning) return;

  // Marquem temporitzador com actiu
  isRunning = true;

  // Actualitzem text del botó
  startBtn.textContent = 'Posat en marxa...';

  // Vibració lleugera
  await vibrate(ImpactStyle.Light);

  // Executem interval cada segon
  intervalId = setInterval(async () => {

    // Restem un segon
    remainingSeconds--;

    // Actualitzem interfície
    updateTimerText();
    updateCanvas();

    // Quan arriba a zero
    if (remainingSeconds <= 0) {

      // Aturem interval
      clearInterval(intervalId);

      // Marquem temporitzador com finalitzat
      isRunning = false;

      // Recuperem text inicial del botó
      startBtn.textContent = 'Començar';

      // Vibració final
      await Haptics.vibrate();

      // Missatge final
      alert('¡Sessió finalitzada! 🌱');
    }

  }, 1000);
}


// REINICIAR TEMPORITZADOR

// Reinicia el temporitzador manualment
async function resetTimer() {

  // Aturem interval
  clearInterval(intervalId);

  // Marquem com aturat
  isRunning = false;

  // Recuperem temps inicial
  remainingSeconds = totalSeconds;

  // Recuperem text del botó
  startBtn.textContent = 'Empezar';

  // Actualitzem interfície
  updateTimerText();
  updateCanvas();

  // Vibració de confirmació
  await vibrate(ImpactStyle.Medium);
}


// EVENT LISTENERS

// Mostrar/amagar menú configuració
settingsBtn.addEventListener('click', () => {

  settingsPanel.classList.toggle('hidden');
});

// Guardar configuració
saveSettingsBtn.addEventListener('click', saveSettings);

// Iniciar temporitzador
startBtn.addEventListener('click', startTimer);

// Reiniciar temporitzador
resetBtn.addEventListener('click', resetTimer);


// INICIALITZACIÓ APP

// Carreguem configuració guardada
loadSettings();