import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

type SObjectListProps = {
  records: Array<any>
  object: string
  fields: Array<string>
  onClickEdit: Function
  onClickDelete: Function
}

const SObjectList: React.FC<SObjectListProps> = (props: SObjectListProps) => {
  const { object, records, fields, onClickEdit, onClickDelete } = props;
  return (
    <>
      <h2>{object} List</h2>
      {records.length !== 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              {props.fields.map((field: any) => {
                return <TableCell key={field}>{field}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record: any) => (
              <TableRow key={record.Id}>
                <TableCell key="action">
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onClickEdit(record);
                  }}>Edit</a> |
                    &nbsp;<a href="#" onClick={(e) => {
                      e.preventDefault();
                      onClickDelete(record);
                    }}>Delete</a>
                </TableCell>
                {fields.map((field: any) => {
                  return <TableCell key={field}>{record[field]}</TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default SObjectList;
