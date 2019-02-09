import React from 'react';
import classNames from 'classnames';

import styles from './ScrollSync.module.css';

class DataGridGroupCell extends React.PureComponent {
  onClick = () => {
    const { onClick, row } = this.props;
    onClick(row.path);
  };

  render() {
    const { style, row, expanded, showCell, hovered } = this.props;
    const divClass = classNames(
      styles.cell,
      styles.groupHeaderCell,
      'pointer',
      hovered ? styles.hovered : ''
    );
    const iconClass = classNames(
      'zmdi',
      'zmdi-caret-down',
      'zmdi-hc-lg',
      expanded ? styles.expanded : styles.collapse
    );

    return (
      <div className={divClass} style={style} onClick={this.onClick}>
        {showCell && (
          <div>
            <i
              className={iconClass}
              style={{ paddingRight: '7px', paddingLeft: '7px' }}
            />
            <span>{row.value}</span>
          </div>
        )}
      </div>
    );
  }
}

export default DataGridGroupCell;
