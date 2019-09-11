import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ConfigStore, Settings, Config } from './ConfigStore';
import { Button, TextField, Container } from '@material-ui/core';
import Select from 'react-select';
import {addFlashMessage, setOverlay, clearOverlay, setDescribeGlobal} from "./actions";
import YAML from 'js-yaml';
import AceEditor from 'react-ace';

const Setting: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const settings = ConfigStore.getObject(Settings.Key, Settings.Default) as Config;
  const [inputSettings, setInputSettings] = useState(YAML.dump(settings));
  const [selectObjects, setSelectObjects] = useState(settings.objects);
  const [object, setObject] = useState({} as any);
  const [objects, setObjects] = useState([] as Array<any>);
  const conn = useSelector((state: any) => state.conn);
  const cache = useSelector((state: any) => state.cache.describeGlobalResult);
  const selectObject = useCallback((e: any) => {
    setObject(e);
  }, []);
  const addObject = useCallback(() => {
    settings.objects.push(object.value);
    ConfigStore.setObject(Settings.Key, settings);
    setSelectObjects(settings.objects);
  }, [object.value]);

  const deleteObject = (object: string) => {
    return () => {
      const index = settings.objects.findIndex((v: any) => v === object);
      settings.objects.splice(index, 1);
      ConfigStore.setObject(Settings.Key, settings);
      setSelectObjects(settings.objects);
    }
  };

  const changeInputSettings = useCallback((value: string) => {
    setInputSettings(value);
  }, []);

  const saveSettings = useCallback(() => {
    ConfigStore.setObject(Settings.Key, YAML.load(inputSettings));
  }, [inputSettings]);

  const options = useMemo(() => {
    return objects.map((object: string) => {
      return { label: object, value: object };
    });
  }, [objects]);

  useEffect(() => {
    if (cache) {
      setObjects(cache);
      const name = cache[0];
      setObject({
        label: name,
        value: name,
      });
    } else {
      dispatch(setOverlay())
      conn.describeGlobal((err: any, res: any) => {
        if (err) {
          addFlashMessage(err);
          dispatch(clearOverlay());
          return;
        }
        const sobjects = res.sobjects
          .filter((sobject: any) => {
            return sobject.queryable &&
              (sobject.custom || Settings.AllowedStandardObjects.includes(sobject.name)) &&
              !selectObjects.includes(sobject.name)
          })
          .map((sobject: any) => sobject.name);
        setObjects(sobjects);
        const name = sobjects[0];
        setObject({
          label: name,
          value: name,
        });
        dispatch(setDescribeGlobal(sobjects));
        dispatch(clearOverlay());
      });
    }
  }, []);

  return (
    <Container component="main" maxWidth="md">
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
        <form>
          <AceEditor
            mode="yaml"
            theme="github"
            onChange={changeInputSettings}
            name="settings-editor"
            editorProps={{ $blockScrolling: true }}
            value={inputSettings}
          />
          <Button onClick={saveSettings}>設定の保存</Button>
        </form>
      </div>
    </Container>
  );
}

export default Setting;
