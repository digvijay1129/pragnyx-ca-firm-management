export function Field({label, ...props}) { return <label className="field"><span>{label}</span><input {...props}/></label>; }

export function TextArea({label,...props}) { return <label className="field"><span>{label}</span><textarea rows="4" {...props}/></label>; }

export function SelectField({label,children,...props}) { return <label className="field"><span>{label}</span><select {...props}>{children}</select></label>; }
