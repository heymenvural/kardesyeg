/* 3D modüllerini klasik betiklere açar: window.YEG3D */
import { Kure, konum } from './kure.js';
import { Salon } from './salon.js';

function webglVar() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
  catch (e) { return false; }
}

window.YEG3D = { Kure, Salon, konum, destek: webglVar() };
window.dispatchEvent(new Event('yeg3d'));
