import { render } from '@testing-library/react'

import AuthNavigation from './auth-navigation'
jest.mock('next/navigation')

describe('AuthNavigation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthNavigation />)
    expect(baseElement).toBeTruthy()
  })
})
