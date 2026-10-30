import { BIO, LINKS, OPEN_TO, PHOTO, STANDFIRST, STATEMENT } from '../../content/profile';
import { EMAIL, NOW, STATS } from '../../content/work';
import ExternalLink from '../shared/ExternalLink';
import Icon from '../shared/Icon';
import './Cover.css';

const [[before, leadIn, after], second] = BIO;

export default function Cover() {
  return (
    <section className="cover wrap" id="cover" aria-labelledby="cover-h">
      <div className="g12">
        <div className="cover-head">
          <p className="kicker">Cover story <span className="folio">p. 02</span></p>
          <h2 className="statement" id="cover-h">{STATEMENT.lead}<em>{STATEMENT.em}</em></h2>
        </div>

        <figure className="cover-photo">
          <div className="duo">
            <img
              src={PHOTO.src}
              srcSet={`${PHOTO.small} 640w, ${PHOTO.src} 960w`}
              sizes="(min-width: 1024px) 40vw, 100vw"
              width={PHOTO.width}
              height={PHOTO.height}
              alt={PHOTO.alt}
            />
          </div>
          <figcaption className="cap"><span className="fig-n">Fig. 1</span>{PHOTO.caption}</figcaption>
        </figure>

        <div className="cover-intro">
          <p className="standfirst">{STANDFIRST}</p>
          <div className="body dropcap">
            <p>{before}<span className="lead-in">{leadIn}</span>{after}</p>
            <p className="end">{second}</p>
          </div>
          <dl className="facts">
            <div><dt className="label">Now</dt><dd>{NOW}</dd></div>
            <div><dt className="label">Open to</dt><dd>{OPEN_TO}</dd></div>
          </dl>
          <p className="cover-links">
            <ExternalLink className="ln" href={LINKS.github.href}>GitHub<Icon name="ne" /></ExternalLink>
            <ExternalLink className="ln" href={LINKS.linkedin.href}>LinkedIn<Icon name="ne" /></ExternalLink>
            <a className="ln" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>

        <aside className="numbers" aria-labelledby="numbers-h">
          <h3 className="label" id="numbers-h">By the numbers</h3>
          <dl>
            {STATS.map(({ value, label, note }) => (
              <div key={label}>
                <dt>{label}{note && <> <small>{note}</small></>}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
