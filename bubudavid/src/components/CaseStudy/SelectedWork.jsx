import { CASES, SECTION_COPY } from '../../content/work';
import PartHead from '../shared/PartHead';
import CaseStudy from './CaseStudy';

export default function SelectedWork() {
  return (
    <section className="part" id="work" aria-labelledby="work-h">
      <PartHead as="header" className="wrap" id="work-h" no="Part I" title="Selected work" folio="pp. 06–29">
        {SECTION_COPY.work}
      </PartHead>
      {CASES.map(c => <CaseStudy key={c.id} id={c.id} />)}
    </section>
  );
}
