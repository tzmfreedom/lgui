import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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

const Form: React.FC = () => {
  const classes = useStyles();
  const fields = [
    {
      name: "firstname",
      label: "First Name"
    },
    {
      name: "lastname",
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

  const [form, setForm] = useState({});
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

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        {/*<Avatar className={classes.avatar}>*/}
        {/*  <LockOutlinedIcon />*/}
        {/*</Avatar>*/}
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
                    autoFocus
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
          >
            Create
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Form;
