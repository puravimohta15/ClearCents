import { useState } from "react"

export const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: {
  getValue: () => any
  row: any
  column: any
  table: any
}) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)

  const onBlur = () => {
    setIsEditing(false)
    table.options.meta?.updateData(row.index, column.id, value)
  }

  return isEditing ? (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
      onBlur={onBlur}
      className="w-full border px-2 py-1 rounded"
    />
  ) : (
    <div onClick={() => setIsEditing(true)} className="cursor-pointer">
      {value}
    </div>
  )
}
