import { render } from '@testing-library/react'

import MainPage from './main-page'

jest.mock('next/navigation')

describe('MainPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MainPage />)
    expect(baseElement).toBeTruthy()
  })
})
