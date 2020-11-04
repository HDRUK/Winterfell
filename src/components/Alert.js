import React from "react";
import Success from '../images/tick.svg';
import {status} from '../lib/types';

class Alert extends React.Component {

  render() {

    const { icon, text, className } = this.props.status;

    const renderIcon = () => {
      switch(icon) {
        case status.SUCCESS:
          return <Success />;
        default:
          return '';
      } 
    }
    
    return (
      <div className={className}>{renderIcon()} {text}</div>
    );
  }
}

Alert.defaultProps = {
  status: {
    icon: '',
    text: '',
    class: ''
  }
}

export default Alert;
