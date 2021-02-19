import React from 'react';
import ImageInputList from '../ImageInputList';
import ErrorMessage from './ErrorMessage';
import {useFormikContext} from 'formik'

function FormImagePicker({name}) {
    const { errors, setFieldValue, touched, values } = useFormikContext();
    const handleAdd = uri => {
        setFieldValue(name ,[...values[name], uri])
      }
      
      const handleRemove = uri => {
        setFieldValue(name ,values[name].filter((imageUri) => imageUri != uri))
      }
    return (
        <>
        <ImageInputList imageUris={values[name]} onAddImage = {handleAdd}
        onRemoveImage = {handleRemove}/>
        <ErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    );
}

export default FormImagePicker;