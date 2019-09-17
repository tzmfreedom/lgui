import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { addFlashMessage, clearFlashMessage, setOverlay, clearOverlay, cacheRecords, cacheDescribe } from './actions';
import {withRouter} from "react-router";
import {getAllUrlParams} from './util';
import Select from "react-select";
import { ConfigStore, Settings, Config } from "./ConfigStore";
import { CSVLink } from "react-csv";
import { 
  Container,
  Drawer,
  Divider,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SObjectList from './SObjectList';
import Flash from './Flash';

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
  const cache = useSelector((state: any) => state.cache[props.object]);
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
        dispatch(clearOverlay());
        dispatch(cacheRecords(props.object, res.records));
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
    setFields(fields);
    const query = getQuery(props.object, fields, params);
    conn.query(query, (err: any, res: Response) => {
      if (err) {
        addFlashMessage(err);
        dispatch(clearOverlay())
        return;
      }
      setRecords(res.records);
      dispatch(clearOverlay());
      dispatch(cacheRecords(props.object, res.records));
    });
  }, [fields, listableField, props.object, params])

  const saveView = useCallback(() => {
    const settings = ConfigStore.getObject(Settings.Key, Settings.Default) as Config;
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
    if (cache && cache.records) {
      setRecords(cache.records);
    } else {
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
        dispatch(cacheRecords(props.object, res.records));
      });
    }
    if (cache && cache.describe) {
      setListableFieldOptions(cache.describe);
      setListableField(cache.describe[0]);
    } else {
      conn.sobject(props.object).describe((err: any, res: any) => {
        if (err) {
          addFlashMessage(err);
          return;
        }
        const fields = res.fields.map((field: any) => {
          return {
            label: field.label,
            value: field.name,
          }
        });
        setListableFieldOptions(fields);
        setListableField(fields[0])
        dispatch(cacheDescribe(props.object, fields))
      })
    }
  }, []);

  const csvData = useMemo(() => {
    const csvData = [];
    csvData.push(fields);
    records.forEach((record) => {
      const csvRow = fields.reduce((arr: Array<any>, field: string) => {
        arr.push(record[field]);
        return arr;
      }, []);
      csvData.push(csvRow);
    });
    return csvData;
  }, [records, fields])

  return (
    <Container component="main" maxWidth="md">
      <React.Fragment>
        <Drawer
          variant="permanent"
          anchor="right"
        >
          <div />
          <Divider />
          {/* <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
          {/* <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
        </Drawer>
        <Flash flash={flash} onClose={handleClose}/>
        <Button variant="contained" color="primary" onClick={() => { props.history.push(`/${props.object}/new/`) }}>Create</Button>
        <Select
          className='fields'
          value={listableField}
          onChange={selectField}
          options={listableFieldOptions}
        />
        <Button variant="contained" color="primary" onClick={addField}>Add Field</Button>
        <Button variant="contained" color="primary" onClick={saveView}>Save View</Button>
        <CSVLink data={csvData}>Download</CSVLink>
        <SObjectList
          object={props.object}
          records={records}
          fields={fields}
          onClickEdit={(record: any) => props.history.push(`/${props.object}/${record.Id}/`)}
          onClickDelete={(record: any) => { deleteRequest(record.Id) }}
        />
      </React.Fragment>
    </Container>
  );
}

export default withRouter(List);
