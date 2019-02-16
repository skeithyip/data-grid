import React from 'react';
import classNames from 'classnames';

import styles from './ScrollSync.module.css';

const padding = { paddingRight: '7px', paddingLeft: '7px' };

class DataGridGroupCell extends React.PureComponent {
  onClick = () => {
    const { onClick, row } = this.props;
    onClick(row.path);
  };

  render() {
    const { style, row, expanded, showCell, hovered, onMouseOver } = this.props;
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

    const rowLabel = `${row.value}`;

    return (
      <div
        className={divClass}
        style={style}
        onClick={this.onClick}
        onMouseOver={onMouseOver}>
        {showCell && (
          <div>
            <i className={iconClass} style={padding} />
            <span>{rowLabel}</span>
          </div>
        )}
      </div>
    );
  }
}

export default DataGridGroupCell;
