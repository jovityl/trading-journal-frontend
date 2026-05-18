import toast from 'react-hot-toast'

export function confirmAction(message: string, onConfirm: () => void) {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id)
              onConfirm()
            }}
            className="flex-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  )
}
