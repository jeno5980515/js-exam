import React from 'react';
import CategorySelector from 'app/components/Selectors/CategorySelector';
import QuestionSelector from 'app/components/Selectors/QuestionSelector';

import { Button } from 'antd';
import styles from './ControlWidget.module.scss';


const ControlWidget = ({
  categoryIndex,
  questionIndex,
  onSubmit,
  onChangeCategory,
  onChangeQuestion,
  questionList
}) => (
  <div className={styles.control}>
    <CategorySelector onChange={onChangeCategory} index={categoryIndex} />
    <QuestionSelector onChange={onChangeQuestion} index={questionIndex} list={questionList} />
    <Button
      type="danger"
      onClick={onSubmit}
    >
      Submit
    </Button>
  </div>
);

export default ControlWidget;
