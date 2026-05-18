import { useState, forwardRef } from 'react'
import { Upload, X } from 'lucide-react'

interface FileDropzoneProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const FileDropzone = forwardRef<HTMLInputElement, FileDropzoneProps>(({ ...rest }, ref) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.[0]) {
      setFileName(e.dataTransfer.files[0].name)
      // forward to the hidden input so react-hook-form picks it up
      const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      if (input) {
        input.files = e.dataTransfer.files
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }
  }

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileName(e.target.files[0].name)
    rest.onChange?.(e)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFileName(null)
  }

  return (
    <label
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
        isDragOver
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700/50'
      }`}
    >
      <Upload size={20} className={isDragOver ? 'text-blue-400' : 'text-gray-500'} />
      {fileName ? (
        <div className="flex items-center gap-2 text-sm text-white">
          <span className="truncate max-w-45">{fileName}</span>
          <button onClick={handleClear} className="text-gray-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center">
          Drag image here or <span className="text-blue-400">click to browse</span>
        </p>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        {...rest}
        onChange={handleSelect}
      />
    </label>
  )
})

export default FileDropzone
