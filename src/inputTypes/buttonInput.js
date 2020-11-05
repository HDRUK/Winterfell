import React from 'react';

class ButtonInput extends React.Component {

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e, this.props.questionSetId, this.props.id);
  }

  render() {
    return (
      <button
         className={this.props.class}
         disabled={this.props.readOnly}
         onClick={this.handleClick.bind(this)}>
        {this.props.text}
      </button>
    );
  }

};

ButtonInput.defaultProps = {
  questionSetId     : undefined,
  id                : undefined,  
  text              : 'Add',
  placeholder       : undefined,
  class             : '',
  readOnly          : false,
  onClick           : () => {}
};

export default ButtonInput;