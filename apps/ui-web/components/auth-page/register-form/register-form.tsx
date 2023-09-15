'use client'
import { forwardRef, useContext, useState } from 'react'
import styles from './register-form.module.css'
import { yupResolver } from '@hookform/resolvers/yup'
import { IMaskInput } from 'react-imask'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  FormControl,
  TextField,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material'
import * as yup from 'yup'
import axios from 'axios'
import { RestApi } from 'libs/shared-types/api'
import { SnackbarContext } from 'apps/ui-web/context/SnackbarContext'

/* eslint-disable-next-line */
export interface RegisterFormProps {}

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref: any) {
    const { onChange, name, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask="(#00) 000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: name, value } })}
        overwrite
      />
    )
  },
)

export function RegisterForm(props: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { setSnackbar } = useContext(SnackbarContext)

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required.'),
    lastName: yup.string().required('Last Name is required.'),
    email: yup
      .string()
      .required('Email is required.')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Invalid email format.',
      ),
    phone: yup
      .string()
      .required('Phone is required.')
      .test('valid-phone', 'Invalid phone number.', (value: any) => {
        // Remove non-digit characters from the input
        const digitsOnly = value.replace(/\D/g, '')

        // Check if the input contains 10 digits (assuming US phone format)
        return digitsOnly.length === 10
      }),
    password: yup
      .string()
      .required('Password is required.')
      .matches(
        /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        'Password must be at least 8 characters and contain at least 1 digit and 1 special character.',
      ),
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RestApi.User.CreateRequest) => {
    data['phone'] = '+1' + data['phone'].replace(/\D/g, '')
    console.log('data >> ', data)
    setLoading(true)

    axios
      .post(
        'https://j1mmfot0ad.execute-api.us-east-1.amazonaws.com/users',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        console.log('response > ', res)
        console.log('response data > ', res.data)
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'You have successfully registered!',
        })
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: 'error',
          message: error.response.data.message,
        })
        console.log(error.response.data.message)
      })
      .finally(() => {
        reset()
        setLoading(false)
      })
  }

  return (
    <div className={styles['container']}>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    value={value}
                    onBlur={onBlur}
                    label="First Name"
                    onChange={onChange}
                    placeholder="John"
                    error={Boolean(errors.firstName)}
                  />
                )}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value}
                    onBlur={onBlur}
                    label="Last Name"
                    onChange={onChange}
                    placeholder="Doe"
                    error={Boolean(errors.lastName)}
                  />
                )}
              />

              {errors.lastName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.lastName.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value}
                    label="Email"
                    type={'email'}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder="john@example.com"
                  />
                )}
              />

              {errors.email && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="phone-reg" error={Boolean(errors.phone)}>
                Phone
              </InputLabel>
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    label="Phone"
                    onBlur={onBlur}
                    onChange={onChange}
                    id="phone-reg"
                    error={Boolean(errors.phone)}
                    placeholder="(XXX) XXX-XXXX"
                    inputComponent={TextMaskCustom as any}
                    startAdornment={
                      <InputAdornment position="start">+1</InputAdornment>
                    }
                  />
                )}
              />

              {errors.phone && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.phone.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel
                htmlFor="auth-login-v2-password"
                error={Boolean(errors.password)}
              >
                Password
              </InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    label="Password"
                    onBlur={onBlur}
                    onChange={onChange}
                    id="auth-login-v2-password"
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        ></IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />

              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Create account
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default RegisterForm