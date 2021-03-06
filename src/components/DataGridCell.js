import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import DataGridGroupCell from './DataGridGroupCell';
import styles from './ScrollSync.module.css';

class DataGridCell extends React.Component {
  onMouseOver = () => {
    const { onMouseOver, rowIndex } = this.props;
    onMouseOver(rowIndex);
  };

  onRowClick = () => {
    const { onRowClick, row } = this.props;
    onRowClick(row);
  };

  render() {
    const {
      columns,
      row, // this is either id or group json
      columnIndex,
      style,
      rowComponent: RowComponent,
      hovered,
      onRowClick,
      onGroupRowClick,
      expanded = []
    } = this.props;

    const column = columns[columnIndex].id;
    const hoveredClass = hovered ? styles.hovered : '';

    if (typeof row === 'string') {
      // id found

      const className = classNames(
        styles.cell,
        hoveredClass,
        typeof onRowClick === 'undefined' ? '' : 'pointer'
      );
      // hide grouped by columns
      // const showColumn = !groupBy.includes(column);

      return (
        <div
          className={className}
          style={style}
          onMouseOver={this.onMouseOver}
          onClick={this.onRowClick}>
          <RowComponent id={row} field={column} />
        </div>
      );
    }

    if (typeof row === 'undefined') {
      const className = classNames(styles.cell, hoveredClass);
      return (
        <div className={className} style={style} onMouseOver={this.onMouseOver}>
          {columnIndex === 0 && <div className={styles.placeholder} />}
        </div>
      );
    }

    return (
      <DataGridGroupCell
        row={row}
        onClick={onGroupRowClick}
        expanded={expanded.includes(row.path)}
        style={style}
        showCell={row.key === column}
        onMouseOver={this.onMouseOver}
        hovered={hovered}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const { rowIndex, getRows } = props;
  const [rows] = getRows(state, props);

  return { row: rows[rowIndex] };
};
export default connect(mapStateToProps)(DataGridCell);
export { DataGridCell };
