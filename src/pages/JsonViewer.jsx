import { useState } from "react";

export default function JsonViewer({ data }) {

  const [open,setOpen] = useState(false)

  return(
    <div className="json-viewer">

      <button onClick={()=>setOpen(!open)}>
        View JSON
      </button>

      {open && (
        <pre>
          {JSON.stringify(data,null,2)}
        </pre>
      )}

    </div>
  )
}