import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ConfigStore from './ConfigStore';
import { Button, InputLabel, FormControl, MenuItem } from '@material-ui/core';
import Select from 'react-select';
import {OptionsType} from "react-select/src/types";

const LGUI_SETTINGS = 'lgui-settings';

const Setting: React.FC<any> = (props: any) => {
  const settings = ConfigStore.getObject(LGUI_SETTINGS, {
    objects: [
      'Account',
      'Contact',
    ]
  });
  const [selectObjects, setSelectObjects] = useState(settings.objects);
  const [object, setObject] = useState({} as any);
  const [objects, setObjects] = useState([]);
  const conn = useSelector((state: any) => state.conn);
  const selectObject = (e: any) => {
    setObject(e);
  };
  const addObject = () => {
    settings.objects.push(object.value);
    ConfigStore.setObject(LGUI_SETTINGS, settings);
    setSelectObjects(settings.objects);
  };

  const deleteObject = (object: string) => {
    return () => {
      const index = settings.objects.findIndex((v: any) => v === object);
      console.log(index)
      settings.objects.splice(index, 1);
      ConfigStore.setObject(LGUI_SETTINGS, settings);
      setSelectObjects(settings.objects);
    }
  };

  const options = objects.map((object: string) => {
    return { label: object, value: object };
  }) as OptionsType<any>;

  useEffect(() => {
    conn.describeGlobal((err: any, res: any) => {
      if (err) {
        return console.error(err);
      }
      const objects = res.sobjects.map((sobject: any) => sobject.name);
      setObjects(objects);
      const name = objects[0];
      setObject({
        label: name,
        value: name,
      });
    });
  }, []);

  return (
    <div>
      <table>
        <thead>
        <tr>
          <th>Action</th>
          <th>Object</th>
        </tr>
        </thead>
        <tbody>
        {selectObjects.map((object: string) => {
          return (
            <tr key={object}>
              <td><a href="#" onClick={deleteObject(object)}>Delete</a></td>
              <td>{object}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
      <h2>New Object Tab</h2>
      <form>
        <Select
          className='describe-object'
          value={object}
          onChange={selectObject}
          options={options}
        />
        <Button onClick={addObject}>Add</Button>
      </form>
    </div>
  );
}

export default Setting;
