import AuthPage from '../../components/auth-page/auth-page'

/* eslint-disable-next-line */
export interface LoginProps {}

export function Login(props: LoginProps) {
  return <AuthPage isRegister={false} />
}

export default Login
