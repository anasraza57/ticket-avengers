import { render } from '@testing-library/react'

import AuthButton from './auth-button'

describe('AuthButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthButton isGoogle />)
    expect(baseElement).toBeTruthy()
  })
})
