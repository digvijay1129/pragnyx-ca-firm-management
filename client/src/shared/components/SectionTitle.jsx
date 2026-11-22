export default function SectionTitle({ eyebrow, title, children, light = false }) {
  return <div className={light ? "section-title light" : "section-title"}>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{children && <p>{children}</p>}</div>;
}
