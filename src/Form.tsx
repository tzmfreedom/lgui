import React, {useState, useEffect, useCallback} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setOverlay, clearOverlay, addFlashMessage } from './actions';
import { getAllUrlParams } from './util';
import { ConfigStore, Settings, Config, LayoutDefinition, LayoutDefinitionField, LayoutStore } from './ConfigStore';

const config = ConfigStore.getObject(Settings.Key, Settings.Default) as Config;

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

const Form: React.FC<MyProps> = (props: MyProps) => {
  const classes = useStyles();
  const [form, setForm]: any = useState({});
  const conn = useSelector((state: any) => state.conn);
  const dispatch = useDispatch();
  const layout = config.layouts[props.object] ? config.layouts[props.object] : {
    default: {
      definitions: [
        {
          name: 'Name',
          required: true,
        }
      ],
      defaultSize: 4,
    }
  } as LayoutStore;
  const defaultSize = layout.default.defaultSize;
  const definitions = layout.default.definitions;
  const onFormChange = (name: string) => {
    return (e: any) => {
      const value = e.target.value;
      setForm((prev: any) => {
        return Object.assign({}, prev, {
          [name]: value,
        })
      })
    }
  };
  const createOrUpdate = useCallback((e: any) => {
    e.preventDefault();
    dispatch(setOverlay());
    if (props.id) {
      conn.sobject(props.object).update(Object.assign({}, form, {Id: props.id}), (err: any, ret: any) => {
        dispatch(clearOverlay());
        if (err) {
          addFlashMessage(err);
          return;
        }
        dispatch(addFlashMessage(`${props.id} record is updated`));
        props.history.push(`/${props.object}`);
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
        const fieldNames = definitions.filter((def: LayoutDefinition) => def.type === 'field')
          .map((field: LayoutDefinitionField): field is LayoutDefinitionField => field.name);
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
        <Typography component="h1" variant="h5">Create Record</Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            {definitions.map((def: LayoutDefinition) => {
              switch (def.type) {
                case 'field':
                  return (
                    <Grid item xs={12} sm={defaultSize} key={def.name}>
                      <TextField
                        autoComplete="fname"
                        name={def.name}
                        variant="outlined"
                        fullWidth
                        id={def.name}
                        label={def.label}
                        onChange={onFormChange(def.name)}
                        value={form[def.name] ? form[def.name] + '' : ''}
                      // autoFocus
                      />
                    </Grid>
                  );
                case 'blank':
                    return <Grid item xs={12} sm={defaultSize} key={'blank'}></Grid>
                case 'section':
                    return <Grid item xs={12} sm={defaultSize} key={'section'}></Grid>
                case 'button':
                    return <Grid item xs={12} sm={defaultSize} key={'button'}></Grid>
              }
            })}
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={createOrUpdate}
          >
            {props.id ? 'Update' : 'Create'}
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(Form);
