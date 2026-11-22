export function Status({value}){return <span className={`status status-${value}`}>{(value||"pending").replace("-"," ")}</span>}
