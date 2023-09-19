import { render } from '@testing-library/react'

import AuthPage from './auth-page'

jest.mock('next/navigation')

describe('AuthPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthPage isRegister={false} />)
    expect(baseElement).toBeTruthy()
  })
})
