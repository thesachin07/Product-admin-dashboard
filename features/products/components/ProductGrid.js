import ProductCard from './ProductCard';
import ProductTable from './ProductTable';

export default function ProductGrid({ products, onDelete }) {
  return (
    <>
      <div className="hidden md:block">
        <ProductTable products={products} onDelete={onDelete} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:hidden">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}