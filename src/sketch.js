// Importem la llibreria p5.js
import p5 from 'p5';

// Variable que guarda el progrés del temporitzador
let progress = 0;

// Variable que controla la mida de la visualització
let visualSize = 80;

// Variable que indica si el mode nit està activat
let nightMode = false;

// Funció exportada per actualitzar les dades del canvas des de main.js
export function updateSketch(newProgress, newSize, isNightMode) {

  // Actualitzem el progrés del temporitzador
  progress = newProgress;

  // Actualitzem la mida visual configurada per l’usuari
  visualSize = newSize;

  // Actualitzem si el mode nit està activat o no
  nightMode = isNightMode;
}

// Creem una nova instància de p5
new p5((p) => {

  // Funció que s’executa una sola vegada en iniciar el canvas
  p.setup = () => {

    // Creem un canvas de 320 x 320 píxels
    const canvas = p.createCanvas(320, 320);

    // Col·loquem el canvas dins del contenidor HTML amb id "p5-container"
    canvas.parent('p5-container');

    // Configurem els angles en graus en lloc de radians
    p.angleMode(p.DEGREES);
  };

  // Funció que s’executa contínuament per dibuixar l’animació
  p.draw = () => {

    // Canviem el color de fons segons si el mode nit està activat
    p.background(
      nightMode ? 16 : 238,
      nightMode ? 24 : 247,
      nightMode ? 32 : 238
    );

    // Movem l’origen del dibuix al centre del canvas
    p.translate(p.width / 2, p.height / 2);

    // Nombre de pètals o formes que tindrà la figura
    const petals = 12;

    // Calculem el creixement de la figura segons el progrés del temporitzador
    const growth = p.map(progress, 0, 1, 10, visualSize);

    // Dibuixem els pètals de la figura
    for (let i = 0; i < petals; i++) {

      // Rotem el canvas per repartir els pètals en forma circular
      p.rotate(360 / petals);

      // Si el mode nit està activat, fem servir colors blavosos
      if (nightMode) {
        p.fill(120, 200, 255, 180);
      } else {

        // Si el mode nit no està activat, fem servir colors verdosos
        p.fill(70, 170, 90, 180);
      }

      // Eliminem el contorn de les figures
      p.noStroke();

      // Dibuixem un pètal amb forma d’el·lipse
      p.ellipse(growth, 0, growth * 0.8, growth * 0.35);
    }

    // Color del cercle central
    p.fill(nightMode ? 255 : 255, nightMode ? 220 : 210, 80);

    // Dibuixem el cercle central, que també creix amb el progrés
    p.circle(0, 0, 45 + progress * 35);
  };
});