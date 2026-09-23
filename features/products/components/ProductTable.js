import Link from 'next/link';

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-10 h-10 object-cover rounded"
                />
              </td>

              <td className="px-4 py-2 font-medium text-gray-900 max-w-[200px] truncate">
                {p.title}
              </td>

              <td className="px-4 py-2 text-gray-600 capitalize">
                {p.category}
              </td>

              <td className="px-4 py-2 text-gray-900">${p.price}</td>

              <td className="px-4 py-2 text-gray-600">⭐ {p.rating}</td>

              <td className="px-4 py-2 text-gray-600">{p.stock}</td>

              <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/products/${p.id}/edit`}
                    className="text-xs text-gray-700 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}