import React from 'react';

/**
 * LifecycleDemoClass.jsx – Class Component Lifecycle Methods
 * ===========================================================
 * Demonstrating lifecycle methods in class components:
 *   1. constructor() – runs once at initialization
 *   2. componentDidMount() – runs after component mounts to DOM
 *   3. componentDidUpdate() – runs after component updates
 *   4. componentWillUnmount() – runs before component unmounts
 *
 * Check browser DevTools Console to see the order of method calls!
 */

class LifecycleDemoClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log('🔵 Constructor: LifecycleDemoClass initialized');
  }

  componentDidMount() {
    console.log('🟢 componentDidMount: Component mounted to DOM, count =', this.state.count);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      '🟡 componentDidUpdate: Component updated',
      `| prevCount: ${prevState.count} → currentCount: ${this.state.count}`
    );
  }

  componentWillUnmount() {
    console.log('🔴 componentWillUnmount: Component will be removed from DOM, final count =', this.state.count);
  }

  handleIncrement = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <div className="lifecycle-demo">
        <h3 className="lifecycle-title">📌 Class Component Lifecycle</h3>
        
        <article className="lifecycle-article">
          <p className="lifecycle-info">
            <strong>Count (Class State):</strong> <span className="lifecycle-count">{this.state.count}</span>
          </p>
          <button 
            onClick={this.handleIncrement}
            className="lifecycle-btn"
          >
            ⬆️ Increment Count
          </button>
        </article>

      </div>
    );
  }
}

export default LifecycleDemoClass;
