import React, {useState} from 'react';
import { useSelector } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

type Response = {
  records: any
}

const getQuery = (object: string) => {
  switch (object) {
    case 'Account':
      return 'SELECT Id, Name FROM Account';
    case 'Contact':
      return 'SELECT Id, Name FROM Contact';
  }
  return 'SELECT Id, Name FROM Account';
}

const List: React.FC<any> = (props: any) => {
  const conn = useSelector((state: any) => state.conn);
  console.log(conn);
  const query = getQuery(props.object);
  const [records, setRecords] = useState([]);
  if (records.length === 0) {
    if (conn === null) {
      window.location.href = "/login";
    } else {
      conn.query(query, function(err: any, res: Response) {
        if (err) { return console.error(err); }
        setRecords(res.records);
      });
    }
  }
  return (
    <React.Fragment>
      <h2>Recent Orders</h2>
      { records.length !== 0 && (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record: any) => (
            <TableRow key={record.Id}>
              <TableCell>{record.Id}</TableCell>
              <TableCell>{record.Name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
    </React.Fragment>
  );
}

export default List;
