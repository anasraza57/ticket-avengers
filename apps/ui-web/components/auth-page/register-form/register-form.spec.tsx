import { render } from '@testing-library/react'

import RegisterForm from './register-form'

jest.mock('next/navigation')

describe('RegisterForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RegisterForm />)
    expect(baseElement).toBeTruthy()
  })
})
