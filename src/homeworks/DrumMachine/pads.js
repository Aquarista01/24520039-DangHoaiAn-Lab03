/** @type {import('./contracts.js').DrumPadData[]} */
export const PADS = [
  {
    id: 'kick',
    name: 'Kick',
    keyLabel: 'W',
    code: 'KeyW',
    src: '/sounds/kick.wav',
    illustrativeLevel: 95,
  },
  {
    id: 'snare',
    name: 'Snare',
    keyLabel: 'A',
    code: 'KeyA',
    src: '/sounds/snare.wav',
    illustrativeLevel: 85,
  },
  {
    id: 'clap',
    name: 'Clap',
    keyLabel: 'S',
    code: 'KeyS',
    src: '/sounds/clap.wav',
    illustrativeLevel: 75,
  },
  {
    id: 'hat',
    name: 'Closed Hat',
    keyLabel: 'D',
    code: 'KeyD',
    src: '/sounds/hat.wav',
    illustrativeLevel: 50,
  },
  {
    id: 'rim',
    name: 'Rimshot',
    keyLabel: 'J',
    code: 'KeyJ',
    src: '/sounds/rim.wav',
    illustrativeLevel: 70,
  },
  {
    id: 'shaker',
    name: 'Shaker',
    keyLabel: 'K',
    code: 'KeyK',
    src: '/sounds/shaker.wav',
    illustrativeLevel: 45,
  },
  {
    id: 'crash',
    name: 'Crash',
    keyLabel: 'L',
    code: 'KeyL',
    src: '/sounds/crash.wav',
    illustrativeLevel: 90,
  },
];

export const PAD_BY_ID = new Map(
  PADS.map((pad) => [pad.id, pad])
);

export const PAD_BY_CODE = new Map(
  PADS.map((pad) => [pad.code, pad.id])
);
