'use client'
import { useContext, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
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
import axiosInstance from '../../../utils/axiosConfig'
import { RestApi } from '@driven-app/shared-types/api'
import { SnackbarContext } from '../../../context/SnackbarContext'
import styles from './login-form.module.css'
import { useRouter } from 'next/navigation'

const defaultValues = {
  email: '',
  password: '',
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { setSnackbar } = useContext(SnackbarContext)
  const router = useRouter()

  const schema = yup.object().shape({
    email: yup
      .string()
      .required('Email is required.')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Invalid email format.',
      ),
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

  const onSubmit = async (data: RestApi.User.LoginRequest) => {
    console.log('data >> ', data)
    setLoading(true)

    axiosInstance
      .post('/users/login', data)
      .then((res) => {
        console.log('response data > ', res.data)
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'You have successfully logged in!',
        })
        router.replace('/')
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
              Sign in
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}
