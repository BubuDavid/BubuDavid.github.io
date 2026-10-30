/* The opener of a part: a double rule, the part number, the title and a short dek with its folio.
   `id` is the title's id, which the section points at with aria-labelledby. */
export default function PartHead({ id, no, title, folio, as: Tag = 'div', className, children }) {
  return (
    <Tag className={className ? `part-head ${className}` : 'part-head'}>
      <hr className="rule-tt" />
      <div className="g12">
        <p className="part-no">{no}</p>
        <h2 className="part-title" id={id}>{title}</h2>
        <p className="part-dek">{children} <span className="label folio">{folio}</span></p>
      </div>
    </Tag>
  );
}
