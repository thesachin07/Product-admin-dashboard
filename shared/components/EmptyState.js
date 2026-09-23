export default function EmptyState({ message = 'No products found' }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}