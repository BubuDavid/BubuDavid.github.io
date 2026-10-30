import { LINKS, OPEN_TO } from '../../content/profile';
import { EMAIL } from '../../content/work';
import { useMexicoCityTime } from '../../lib/time';
import ExternalLink from '../shared/ExternalLink';
import Icon from '../shared/Icon';
import './Contact.css';

const openTo = OPEN_TO.charAt(0).toLowerCase() + OPEN_TO.slice(1);

export default function Contact() {
  const { h, m } = useMexicoCityTime();
  return (
    <section className="dest wrap" id="contact" aria-labelledby="contact-h">
      <span className="stripes" aria-hidden="true" />
      <div className="g12 dest-grid">
        <div className="dest-main">
          <p className="kicker">Próxima estación · Next stop <span className="folio">p. 44</span></p>
          <h2 className="dest-title" id="contact-h">Next stop: <em>your&nbsp;team?</em></h2>
          <p className="standfirst">Open to {openTo}. Letters to the editor are welcome.</p>
          <a className="mail-big ln" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <div className="dest-links">
          <p className="label">Connections · Correspondencia</p>
          <ul className="social">
            <li>
              <ExternalLink href={LINKS.github.href}>
                <Icon name="gh" /><span className="grow">GitHub</span><span className="label muted">{LINKS.github.handle}</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={LINKS.linkedin.href}>
                <Icon name="in" /><span className="grow">LinkedIn</span><span className="label muted">{LINKS.linkedin.handle}</span>
              </ExternalLink>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>
                <Icon name="mail" /><span className="grow">Email</span><span className="label muted">{EMAIL}</span>
              </a>
            </li>
          </ul>
          <p className="dest-clock label">Mexico City <span className="js-clock">{h}:{m}</span></p>
        </div>
      </div>
    </section>
  );
}
