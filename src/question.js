import React from 'react';
import _ from 'lodash';
import inputTypes from './inputTypes/index';
import { actions } from './lib/keyActions';

class Question extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      requestedAmendements  : false
    };
  }

  handleInputChange(questionId, value) {
    this.props.onAnswerChange(
      questionId,
      value,
      this.props.validations,
      this.props.validateOn
    );
  }

  handleInputBlur(questionId, value) {
    this.props.onQuestionBlur(
      questionId,
      value,
      this.props.validations,
      this.props.validateOn
    );
  }

  handleInputFocus(questionId) {
    this.props.onQuestionFocus(questionId);
  }

  handleInputClick(questionSetId, questionId) {
    this.props.onQuestionClick(questionSetId, questionId);
  }

  handleActionClick(e) {
    e.preventDefault();
    // let requestedAmendements = this.state.requestedAmendements;
    // this.setState(!requestedAmendements);
    console.log(e, this.props.questionSetId, this.props.questionId);
  }

  render() {
    var Input = inputTypes[this.props.input.type];
    if (!Input) {
      throw new Error('Winterfell: Input Type "' + this.props.input.type +
                      '" not defined as Winterfell Input Type');
    }

    /*
     * Conditional Questions
     *
     * Go through the inputs options and filter them down
     * to options where the value matches the current questions
     * value. If we have conditional questions on a given option,
     * then render this component with the props for the conditional
     * question.
     */
    var conditionalItems = [];
    if (typeof this.props.input.options !== 'undefined') {
      this.props.input.options
          .filter(option => {
            return this.props.value instanceof Array
                     ? this.props.value.indexOf(option.value) > -1
                     : this.props.value == option.value;
          })
          .filter(option => {
            return typeof option.conditionalQuestions !== 'undefined'
                     && option.conditionalQuestions.length > 0;
          })
          .forEach(option =>
            [].forEach.bind(option.conditionalQuestions, conditionalQuestion => {
              conditionalItems.push(
                <Question key={conditionalQuestion.questionId}
                          questionSetId={this.props.questionSetId}
                          questionId={conditionalQuestion.questionId}
                          question={conditionalQuestion.question}
                          text={conditionalQuestion.text}
                          postText={conditionalQuestion.postText}
                          validateOn={conditionalQuestion.validateOn}
                          validations={conditionalQuestion.validations}
                          value={this.props.questionAnswers[conditionalQuestion.questionId]}
                          input={conditionalQuestion.input}
                          classes={this.props.classes}
                          renderError={this.props.renderError}
                          readOnly={this.props.readOnly}
                          inReviewMode={this.props.inReviewMode}
                          questionAnswers={this.props.questionAnswers}
                          validationErrors={this.props.validationErrors}
                          onAnswerChange={this.props.onAnswerChange}
                          onQuestionFocus={this.props.onQuestionFocus}
                          onQuestionClick={this.props.onQuestionClick}
                          onQuestionBlur={this.props.onQuestionBlur}
                          onKeyDown={this.props.onKeyDown} />
              );
            }
          )());
    }

    // Get the current value. If none is set, then use
    // the default if given.
    var value = typeof this.props.value !== 'undefined'
                  ? this.props.value
                  : typeof this.props.input.default !== 'undefined'
                      ? this.props.input.default
                      : typeof this.props.questionAnswers[this.props.questionId] !== 'undefined'
                      ? this.props.questionAnswers[this.props.questionId] : undefined;

    // Disable input
    var disabled = typeof this.props.input.disabled !== 'undefined'
                  ? this.props.input.disabled
                  : false;

    // Retrieve the validation errors for the
    // current question and map them in to
    // error-message blocks.
    var validationErrors = typeof this.props.validationErrors[this.props.questionId] !== 'undefined'
                             ? this.props.validationErrors[this.props.questionId]
                                   .map(error => {
                                     return typeof this.props.renderError === 'function'
                                              ? this.props.renderError(error, this.props.questionId)
                                              : (
                                                  <div key={this.props.questionId + 'Error' + error.type}
                                                       className={this.props.classes.errorMessage}>
                                                    {error.message}
                                                  </div>
                                                );
                                   })
                             : [];

    let labelId = `${this.props.questionId}-label`;
    
    let renderReviewMode = typeof this.props.inReviewMode !== 'undefined' && this.props.inReviewMode ?
                            (<button name={actions.REQUEST_AMENDMENTS} onClick={this.handleActionClick.bind(this)}>Request Amendments</button>) : '';

    return (
      <div className={this.props.classes.question}>
        {!!this.props.question
          ? (
              <label className={this.props.classes.label}
                     id={labelId}
                     htmlFor={this.props.questionId}>
                {this.props.question}
                {typeof this.props.renderRequiredAsterisk !== 'undefined'
                   && this.props.input.required
                   ? this.props.renderRequiredAsterisk()
                   : undefined}
              </label>
            )
          : undefined}
        {!!this.props.text
          ? (
              <p className={this.props.classes.questionText}>
                {this.props.text}
              </p>
            )
          : undefined}
        {validationErrors}
        <Input name={this.props.questionId}
               id={this.props.questionId}
               questionSetId={this.props.questionSetId}
               labelId={labelId}
               value={value}
               disabled={disabled}
               text={this.props.input.text}
               icon={this.props.input.icon}
               class={this.props.input.class}
               action={this.props.input.action}
               options={this.props.input.options}
               placeholder={this.props.input.placeholder}
               required={this.props.input.required}
               readOnly={this.props.readOnly}
               inReviewMode={this.props.inReviewMode}
               classes={this.props.classes}
               onChange={this.handleInputChange.bind(this, this.props.questionId)}
               onFocus={this.handleInputFocus.bind(this, this.props.questionId)}
               onClick={this.handleInputClick.bind(this, this.props.questionSetId, this.props.questionId)}
               onBlur={this.handleInputBlur.bind(this, this.props.questionId)}
               onKeyDown={this.props.onKeyDown}
               {...(typeof this.props.input.props === 'object'
                     ? this.props.input.props
                     : {})}
        />
        {renderReviewMode}
        {!!this.props.postText
          ? (
              <p className={this.props.classes.questionPostText}>
                {this.props.postText}
              </p>
            )
          : undefined}
        {conditionalItems}
      </div>
    );
  }

  componentDidMount() {
    if (typeof this.props.input.default === 'undefined'
          || (this.props.input.type === 'checkboxInput'
                && typeof this.props.questionAnswers[this.props.questionId] === 'undefined')) {
      return;
    }

    this.handleInputChange.call(
      this,
      this.props.questionId,
      this.props.input.default
    );
  }

};

Question.defaultProps = {
  questionSetId          : undefined,
  questionId             : undefined,
  question               : '',
  validateOn             : 'blur',
  validations            : [],
  text                   : undefined,
  postText               : undefined,
  value                  : undefined,
  input                  : {
    default     : undefined,
    type        : 'textInput',
    limit       : undefined,
    placeholder : undefined,
    icon        : undefined,
    class       : undefined,
    action      : undefined,
    disabled    : undefined,
    reviewIndicator: undefined
  },
  classes                : {},
  questionAnswers        : {},
  validationErrors       : {},
  onAnswerChange         : () => {},
  onQuestionBlur         : () => {},
  onQuestionFocus        : () => {},
  onKeyDown              : () => {},
  onKeyDown              : () => {},
  renderError            : undefined,
  renderRequiredAsterisk : undefined,
  readOnly               : false,
  inReviewMode           : false,
};

export default Question;
