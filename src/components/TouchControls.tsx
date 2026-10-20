import { PointerEvent } from 'react';
import { controls } from '../lovegame/controls';

type Hold = 'left' | 'right' | 'jump';

function hold(key: Hold) {
  const down = (e: PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    controls[key] = true;
    if (key === 'jump') controls.jumpPressed = true;
  };
  const up = (e: PointerEvent) => { e.preventDefault(); controls[key] = false; };
  return { onPointerDown: down, onPointerUp: up, onPointerCancel: up, onPointerLeave: up };
}

export default function TouchControls() {
  return (
    <div className="touch-controls">
      <div className="pad-left">
        <button className="pad" {...hold('left')} aria-label="Gauche">◀</button>
        <button className="pad" {...hold('right')} aria-label="Droite">▶</button>
      </div>
      <div className="pad-right">
        <button className="pad" onPointerDown={(e) => { e.preventDefault(); controls.actionPressed = true; }} aria-label="Interagir">❤</button>
        <button className="pad big" {...hold('jump')} aria-label="Sauter">⤒</button>
      </div>
    </div>
  );
}
