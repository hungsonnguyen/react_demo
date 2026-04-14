import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContext.jsx';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';

export default function DataList({ search }) {
  const { theme } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(USERS_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Khong the tai du lieu nguoi dung.');
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Da xay ra loi khong xac dinh.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((user) =>
      user.name.toLowerCase().includes(normalizedSearch)
    );
  }, [items, search]);

  if (loading) {
    return <p className="week4-state">Dang tai du lieu...</p>;
  }

  if (error) {
    return (
      <p className="week4-state week4-state-error" role="alert">
        Loi: {error}
      </p>
    );
  }

  if (filteredUsers.length === 0) {
    return <p className="week4-state">Khong tim thay ket qua phu hop.</p>;
  }

  return (
    <div className="week4-list" data-theme={theme}>
      {filteredUsers.map((user) => (
        <article key={user.id} className="week4-user-card">
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Company: {user.company?.name}</p>
        </article>
      ))}
    </div>
  );
}
