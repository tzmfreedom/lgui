import React, { useState, useCallback } from 'react';
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import { Layout, LayoutDefinition } from './ConfigStore';

interface SObjectFormProps {
  formClassName?: string
  buttonClassName?: string
  layout: Layout
  onCreateOrUpdate: any
  init: any
  update: boolean
}

const SObjectForm: React.FC<SObjectFormProps> = (props: SObjectFormProps) => {
  const { formClassName, buttonClassName, layout, onCreateOrUpdate, init, update } = props;
  const [form, setForm] = useState(init);

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

  const onCreateOrUpdateCallback = useCallback((e) => {
    e.preventDefault();
    onCreateOrUpdate(form)
  }, [form]);
  return (
    <>
      <Typography component="h1" variant="h5">{ update ? 'Update' : 'Create' } Record</Typography>
      <form className={formClassName} noValidate>
        <Grid container spacing={2}>
          {layout.definitions.map((def: LayoutDefinition) => {
            switch (def.type) {
              case 'field':
                return (
                  <Grid item xs={12} sm={layout.defaultSize} key={def.name}>
                    <TextField
                      autoComplete="fname"
                      name={def.name}
                      variant="outlined"
                      fullWidth
                      id={def.name}
                      label={def.label}
                      onChange={onFormChange(def.name)}
                      value={form[def.name] ? form[def.name] + '' : ''}
                      required={def.required}
                    // autoFocus
                    />
                  </Grid>
                );
              case 'blank':
                return <Grid item xs={12} sm={layout.defaultSize} key={'blank'}></Grid>
              case 'section':
                return <Grid item xs={12} sm={layout.defaultSize} key={'section'}></Grid>
              case 'button':
                return <Grid item xs={12} sm={layout.defaultSize} key={'button'}></Grid>
            }
          })}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={buttonClassName}
          onClick={onCreateOrUpdateCallback}
        >
          {update ? 'Update' : 'Create'}
        </Button>
      </form>
    </>
  );
}

export default SObjectForm;
