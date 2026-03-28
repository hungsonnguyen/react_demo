export const defaultItems = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Keyboard", price: 50 },
  { id: 3, name: "Mouse", price: 25 },
];

const ItemList = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="empty">Danh sách rỗng</p>;
  }

  return (
    <div className="item-list">
      <h2>Danh sách sản phẩm</h2>
      <ul>
        {items.map(({ id, name, price }) => (
          <li key={id}>
            <span className="item-name">{name}</span>
            <span className="item-price">${price.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
