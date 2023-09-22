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
import { RestApi } from '@driven-app/shared-types/api'
import styles from './login-form.module.css'
import { AuthContext } from '../../context/AuthContext'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const defaultValues = {
  email: '',
  password: '',
}

export default function LoginForm() {
  const { login } = useContext(AuthContext)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const schema = yup.object().shape({
    email: yup.string().required('Email or Phone number is required.'),
    password: yup.string().required('Password is required.'),
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
    await login(data, reset)
    setLoading(false)
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
                    label="Email or Phone number"
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
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
                        >
                          {showPassword ? (
                            <VisibilityOff color="inherit" />
                          ) : (
                            <Visibility color="inherit" />
                          )}
                        </IconButton>
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
