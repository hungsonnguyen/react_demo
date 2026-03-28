const WelcomeMessage = ({ children }) => {
  return (
    <div className="welcome-message">
      <p className="welcome-label">Hé lô Franch</p>
      <div className="welcome-content">{children}</div>
    </div>
  );
};

export default WelcomeMessage;
