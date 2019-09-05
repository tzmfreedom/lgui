import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from "@material-ui/core/Container";
import Snackbar from '@material-ui/core/Snackbar';

type Response = {
  records: any
}

const getQuery = (object: string) => {
  switch (object) {
    case 'Account':
      return 'SELECT Id, Name FROM Account ORDER BY CreatedDate DESC';
    case 'Contact':
      return 'SELECT Id, Name FROM Contact ORDER BY CreatedDate DESC';
  }
  return 'SELECT Id, Name FROM Account ORDER BY CreatedDate DESC';
}

const List: React.FC<any> = (props: any) => {
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch()
  const conn = useSelector((state: any) => state.conn);
  const flash = useSelector((state: any) => state.flash);
  if (records.length === 0) {
    const query = getQuery(props.object);
    conn.query(query, function(err: any, res: Response) {
      if (err) { return console.error(err); }
      setRecords(res.records);
    });
  }
  const fields = [
    'Id',
    'Name',
  ];
  const deleteRequest = (id: string) => {
    conn.sobject(props.object).destroy(id, (err: any, ret: any) => {
      if (err || !ret.success) { console.error(err, ret) }
      dispatch({
        type: 'add-flash-message',
        value: `${id} record is deleted`,
      });
      const query = getQuery(props.object);
      conn.query(query, function(err: any, res: Response) {
        if (err) { return console.error(err); }
        setRecords(res.records);
      });
    });
  }

  const handleClose = () => {
    dispatch({
      type: 'clear-flash-message',
    })
  }

  return (
    <Container component="main" maxWidth="md">
      <React.Fragment>
        { flash.length > 0 && (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            key="flash-message"
            open={true}
            onClose={handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{flash}</span>}
          />
        ) }
        <h2>{props.object} List</h2>
        { records.length !== 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                {fields.map((field: any) => {
                  return <TableCell key={field}>{field}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record: any) => (
                <TableRow key={record.Id}>
                  <TableCell key="action">
                    <a href="#" onClick={() => props.history.push(`/${props.object}/${record.Id}/`) }>Edit</a> |
                    &nbsp;<a href="#" onClick={() => { deleteRequest(record.Id) }}>Delete</a>
                  </TableCell>
                  {fields.map((field: any) => {
                    return <TableCell key={field}>{record[field]}</TableCell>
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </React.Fragment>
    </Container>
  );
}

export default List;
