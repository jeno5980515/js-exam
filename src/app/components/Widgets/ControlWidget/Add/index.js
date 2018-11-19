import React from 'react';
import CategorySelector from 'app/components/Selectors/CategorySelector';

import { Button, Input } from 'antd';
import styles from './ControlWidget.module.scss';


const ControlWidget = ({
  index,
  onChangeName,
  onSubmit,
  onChangeCategory
}) => (
  <div className={styles.control}>
    <CategorySelector onChange={onChangeCategory} index={index} />
    <Input
      placeholder="Question name"
      onChange={e => onChangeName(e.target.value)}
      style={{ width: 200, marginRight: 5 }}
    />
    <Button
      type="danger"
      onClick={onSubmit}
    >
      Submit
    </Button>
  </div>
);

export default ControlWidget;
