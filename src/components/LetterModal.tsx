import { letters } from '../lovegame/content/letters';
import { asset } from '../lovegame/assets';
import AudioPlayer from './AudioPlayer';

interface Props {
  index: number;
  onClose: () => void;
  onSwitch?: (i: number) => void; // utilisé quand on relit les lettres à la fin
}

export default function LetterModal({ index, onClose, onSwitch }: Props) {
  const letter = letters[index];
  return (
    <div className="modal-backdrop">
      <div className="letter-modal" role="dialog" aria-modal="true">
        <div className="letter-head">
          <span className="reader-wrap">
            <img className="reader reader-a" src={asset('characters/hero/read_0.png')} alt="" />
            <img className="reader reader-b" src={asset('characters/hero/read_1.png')} alt="" />
          </span>
          <h2>{letter.title}</h2>
        </div>
        {onSwitch && (
          <div className="letter-tabs">
            {letters.map((_, i) => (
              <button key={i} className={i === index ? 'on' : ''} onClick={() => onSwitch(i)}>Lettre {i + 1}</button>
            ))}
          </div>
        )}
        <AudioPlayer key={index} src={letter.audio} />
        <div className="letter-body">
          {letter.paragraphs.map((p, i) => (<p key={i}>{p}</p>))}
        </div>
        <button className="primary" onClick={onClose}>{onSwitch ? 'Fermer' : 'Continuer l’aventure'}</button>
      </div>
    </div>
  );
}
