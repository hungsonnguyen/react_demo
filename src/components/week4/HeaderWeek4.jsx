import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.jsx';

const HeaderWeek4 = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLight = theme === 'light';

  return (
    <header className="header week4-header" data-theme={theme}>
      <div>
        <h1>React Week 4 - Hooks cơ bản</h1>
        <p>Theme hiện tại: {isLight ? 'Light' : 'Dark'}</p>
      </div>
      <button type="button" onClick={toggleTheme} className="theme-toggle-btn">
        Chuyển sang {isLight ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  );
};

export default HeaderWeek4;
