import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-square bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          {product.title}
        </h3>

        <p className="text-xs text-gray-500 capitalize">
          {product.category}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-gray-900">
            ${product.price}
          </span>
          <span className="text-xs text-gray-600">
            ⭐ {product.rating}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Stock: {product.stock}
        </p>
      </div>
    </Link>
  );
}