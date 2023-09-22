import { render } from '@testing-library/react';

import SwipeableEdge from './swipeable-edge';

describe('SwipeableEdge', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<SwipeableEdge />);
    expect(baseElement).toBeTruthy();
  });
  
});
