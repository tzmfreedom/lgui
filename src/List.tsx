import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Container from "@material-ui/core/Container";
import Snackbar from '@material-ui/core/Snackbar';
import { addFlashMessage, clearFlashMessage, setOverlay, clearOverlay } from './actions';
import Button from "@material-ui/core/Button";
import {withRouter} from "react-router";
import {getAllUrlParams} from './util';
import Select from "react-select";
import { ConfigStore, Settings } from "./ConfigStore";

type Response = {
  records: any
}

const getFields = (params: any) => {
  const defaultFields = [
    'Id',
  ];
  if (params.fields) {
    return params.fields.split(',');
  }
  return defaultFields;
}

const getQuery = (object: string, fields: Array<string>, params: any) => {
  return `SELECT ${fields.join(',')} FROM ${object}`;
}

const List: React.FC<any> = (props: any) => {
  const [records, setRecords] = useState([]);
  const [listableField, setListableField] = useState({} as any);
  const [listableFieldOptions, setListableFieldOptions] = useState([]);
  const dispatch = useDispatch();
  const conn = useSelector((state: any) => state.conn);
  const flash = useSelector((state: any) => state.flash);
  const params = getAllUrlParams(window.location.href);
  const [fields, setFields] = useState(getFields(params));

  const deleteRequest = useCallback((id: string) => {
    dispatch(setOverlay());
    conn.sobject(props.object).destroy(id, (err: any, ret: any) => {
      if (err || !ret.success) {
        dispatch(clearOverlay());
        addFlashMessage(err);
        return;
      }
      const query = getQuery(props.object, fields, params);
      conn.query(query, function(err: any, res: Response) {
        if (err) {
          addFlashMessage(err);
          dispatch(clearOverlay())
          return;
        }
        setRecords(res.records);
        dispatch(addFlashMessage(`${id} record is deleted`));
        dispatch(clearOverlay())
      });
    });
  }, [props.object, fields, params])

  const handleClose = useCallback(() => {
    dispatch(clearFlashMessage())
  }, [])

  const selectField = useCallback((value: any) => {
    setListableField(value);
  }, [])

  const addField = useCallback(() => {
    fields.push(listableField.value)
    console.log(listableField)
    setFields(fields);
    const query = getQuery(props.object, fields, params);
    conn.query(query, (err: any, res: Response) => {
      if (err) {
        addFlashMessage(err);
        dispatch(clearOverlay())
        return;
      }
      setRecords(res.records);
      dispatch(clearOverlay())
    });
  }, [fields, listableField, props.object, params])

  const saveView = useCallback(() => {
    const settings = ConfigStore.getObject(Settings.Key, Settings.Default);
    const views = settings.views[props.object];
    const view = {
      fields,
    }
    if (views) {
      views.push(view);
    } else {
      settings.views[props.object] = [view];
    }
    ConfigStore.setObject(Settings.Key, settings);
    dispatch(addFlashMessage('view is created'))
  }, [props.object])

  useEffect(() => {
    dispatch(setOverlay())
    const query = getQuery(props.object, fields, params);
    conn.query(query, (err: any, res: Response) => {
      if (err) {
        addFlashMessage(err);
        dispatch(clearOverlay())
        return;
      }
      setRecords(res.records);
      dispatch(clearOverlay())
    });

    conn.sobject(props.object).describe((err: any, res: any) => {
      if (err) {
        addFlashMessage(err);
        return;
      }
      const fields = res.fields.map((field: any) => {
        return {
          label: field.name,
          value: field.name,
        }
      });
      setListableFieldOptions(fields);
      setListableField(fields[0])
    })
  }, []);

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
        <Button variant="contained" color="primary" onClick={() => { props.history.push(`/${props.object}/new/`) }}>Create</Button>
        <Select
          className='fields'
          value={listableField}
          onChange={selectField}
          options={listableFieldOptions}
        />
        <Button variant="contained" color="primary" onClick={addField}>Add Field</Button>
        <Button variant="contained" color="primary" onClick={saveView}>Save View</Button>
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

export default withRouter(List);
