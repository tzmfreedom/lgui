import React, {useState, useEffect} from 'react';
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
  const fields = [
    {
      name: "FirstName",
      label: "First Name"
    },
    {
      name: "LastName",
      label: "Last Name"
    },
    {
      name: "email",
      label: "Email"
    },
    {
      name: "address",
      label: "Address"
    },
  ];

  const [form, setForm]: any = useState({});
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
  const conn = useSelector((state: any) => state.conn);
  const dispatch = useDispatch();
  const createOrUpdate = (e: any) => {
    e.preventDefault();
    dispatch(setOverlay());
    if (props.id) {
      conn.sobject(props.object).update(Object.assign({}, form, {Id: props.id}), (err: any, ret: any) => {
        if (err) { console.error(err) }
        dispatch(clearOverlay());
        dispatch(addFlashMessage(`${props.id} record is updated`));
        props.history.push(`/${props.object}`);
      });
    } else {
      conn.sobject(props.object).create(form, (err: any, ret: any) => {
        if (err) { console.error(err) }
        dispatch(clearOverlay())
        dispatch(addFlashMessage(`${ret.id} record is created`));
        props.history.push(`/${props.object}`);
      });
    }
  };
  useEffect(() => {
    if (props.id !== null) {
      conn.sobject(props.object).retrieve(props.id, (err: any, ret: any) => {
        const init: any = {};
        const fieldNames = fields.map((field) => field.name);
        for (let key in ret) {
          if (fieldNames.includes(key)) {
            init[key] = ret[key]
          }
        }

        const params = getAllUrlParams(window.location.href);
        setForm((prev: any) => Object.assign(init, params));
      });
    }
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">Create Record</Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            {fields.map((field: any) => {
              return (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    autoComplete="fname"
                    name={field.name}
                    variant="outlined"
                    fullWidth
                    id={field.name}
                    label={field.label}
                    onChange={onFormChange(field.name)}
                    value={ form[field.name] ? form[field.name] + '' : ''}
                    // autoFocus
                  />
                </Grid>
              )
            })}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={createOrUpdate}
          >
            Create
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(Form);
