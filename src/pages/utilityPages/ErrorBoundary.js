







import  React          from     'react';
import  Construction   from     './Construction.js';




class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      // Initialize the component's state with hasError set to false.
      this.state = { hasError: false };
    }
  
    // This static method is called when an error is thrown in any of the child components.
    static getDerivedStateFromError(error) {
      // Update the state to indicate that an error has occurred.
      // This will trigger a re-render to display the fallback UI.
      return { hasError: true };
    }
  
    render() {
      // Check if an error has occurred.
      if (this.state.hasError) {
        // If an error has occurred, render the fallback UI.
        return <Construction errorBoundary={true} />;
      }
  
      // If no error has occurred, render the child components as usual.
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;



