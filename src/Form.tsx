import React, {useState, useEffect, useCallback} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setOverlay, clearOverlay, addFlashMessage } from './actions';
import { getAllUrlParams } from './util';
import { ConfigStore, Settings, Config, LayoutDefinition, LayoutDefinitionField, LayoutStore, Trigger } from './ConfigStore';
import SObjectForm from './SObjectForm';

interface MyProps extends RouteComponentProps {
  object: string
  id: string | null
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const runTrigger = (trigger: Trigger, conn: any, form: any, id: string | null, f: Function) => {
  switch (trigger.name) {
    case 'CreateRecord':
      const params = Object.assign({}, form, { Id: id });
      const fields = trigger.definition.fields as any;
      const createObject = Object.keys(fields).reduce((ret: any, key: string) => {
        ret[fields[key]] = params[key];
        return ret;
      }, {})
      conn.sobject(trigger.name).create(createObject, (err: any, ret: any) => {
        f();
      });
  }
}

const Form: React.FC<MyProps> = (props: MyProps) => {
  const config = ConfigStore.getObject(Settings.Key, Settings.Default) as Config;
  const classes = useStyles();
  const [form, setForm]: any = useState();
  const conn = useSelector((state: any) => state.conn);
  const dispatch = useDispatch();
  const layout = config.layouts[props.object] ? config.layouts[props.object] : {
    default: {
      definitions: [
        {
          type: 'field',
          name: 'Name',
        }
      ],
      defaultSize: 4,
    }
  } as LayoutStore;
  const definitions = layout.default.definitions;
  const trigger = layout.default.trigger;
  const onCreateOrUpdate = useCallback((e: any) => {
    e.preventDefault();
    dispatch(setOverlay());
    if (props.id) {
      conn.sobject(props.object).update(Object.assign({}, form, {Id: props.id}), (err: any, ret: any) => {
        dispatch(clearOverlay());
        if (err) {
          addFlashMessage(err);
          return;
        }
        if (trigger) {
          runTrigger(trigger, conn, form, props.id, () => {
            dispatch(addFlashMessage(`${props.id} record is updated`));
            props.history.push(`/${props.object}`);
          });
        } else {
          dispatch(addFlashMessage(`${props.id} record is updated`));
          props.history.push(`/${props.object}`);
        }
      });
    } else {
      conn.sobject(props.object).create(form, (err: any, ret: any) => {
        dispatch(clearOverlay());
        if (err) {
          addFlashMessage(err);
          return;
        }
        dispatch(addFlashMessage(`${ret.id} record is created`));
        props.history.push(`/${props.object}`);
      });
    }
  }, [props.id, props.object]);
  useEffect(() => {
    if (props.id !== null) {
      conn.sobject(props.object).retrieve(props.id, (err: any, ret: any) => {
        const init: any = {};
        const fieldNames = definitions.filter((def: LayoutDefinition): def is LayoutDefinitionField => def.type === 'field')
          .map((field: LayoutDefinitionField) => field.name);
        for (let key in ret) {
          if (fieldNames.includes(key)) {
            init[key] = ret[key]
          }
        }

        const params = getAllUrlParams(window.location.href);
        setForm((prev: any) => Object.assign(init, params));
      });
    }
  }, [props.object, props.id]);

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        {form && (
          <SObjectForm layout={layout.default} onCreateOrUpdate={onCreateOrUpdate} init={form} update={!!props.id} />
        )}
      </div>
    </Container>
  );
}

export default withRouter(Form);
