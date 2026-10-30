import { ISSUE, LINKS } from '../../content/profile';
import { EMAIL } from '../../content/work';
import ExternalLink from '../shared/ExternalLink';
import Icon from '../shared/Icon';
import './Colophon.css';

export default function Colophon() {
  return (
    <footer className="colophon wrap" id="colophon" aria-labelledby="colo-h">
      <hr className="rule-tt" />
      <div className="g12 colo-grid">
        <div className="colo-main">
          <h2 className="label" id="colo-h">Colophon <span className="folio">p. 44</span></h2>
          <p>
            Headlines and numerals are set in <i>Fraunces</i> by Undercase Type, text in <i>Inter Tight</i> by Rasmus Andersson, and the signage in <i>Barlow Condensed</i> by Jeremy Tribby. One ink, #17160F, and one house green, #1F5C3A, on paper #F3EFE6. Line 1 wears Metro pink and Line 2 keeps the neon green of the old site. I drew the map and every figure in SVG and CSS. The cover photograph is the only image.
          </p>
        </div>
        <div className="colo-links">
          <h2 className="label">Elsewhere</h2>
          <ul>
            <li><ExternalLink className="ln" href={LINKS.github.href}>GitHub<Icon name="ne" /></ExternalLink></li>
            <li><ExternalLink className="ln" href={LINKS.linkedin.href}>LinkedIn<Icon name="ne" /></ExternalLink></li>
            <li><a className="ln" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
          </ul>
        </div>
        <div className="colo-made">
          <h2 className="label">Printed in</h2>
          <p className="made"><code aria-hidden="true">&lt;&gt;</code>Made with 💖 in 🇲🇽🌮</p>
        </div>
      </div>
      <div className="colo-foot">
        <span className="label">Issue Nº {ISSUE.no} · {ISSUE.season} · {ISSUE.place}</span>
        <span className="label">© {new Date().getFullYear()} David "Bubu" Pedroza Segoviano 🦕</span>
        <a className="label" href="#top">Back to the cover &uarr;</a>
      </div>
    </footer>
  );
}
