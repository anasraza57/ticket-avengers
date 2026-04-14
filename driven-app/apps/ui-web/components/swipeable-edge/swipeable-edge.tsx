import * as React from 'react'
import { Global } from '@emotion/react'
import { styled } from '@mui/material/styles'
import { CssBaseline, Box, Typography, SwipeableDrawer } from '@mui/material'
import Instructions from '../instructions/instructions'

const drawerBleeding = 87

interface Props {
  window?: () => Window
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: '#ffffff',
}))

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
}))

const Puller = styled(Box)(({ theme }) => ({
  width: 53,
  height: 4,
  backgroundColor: '#1c1c1e',
  borderRadius: 3,
  position: 'absolute',
  top: 22,
  left: 'calc(50% - 30px)',
}))

export default function SwipeableEdgeDrawer(props: Props) {
  const { window } = props
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(90% - ${drawerBleeding}px)`,
            overflow: 'visible',
            color: '#1c1c1e',
          },
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography
            variant="h6"
            sx={{ pt: 5, pb: 2, fontWeight: 600, textAlign: 'center' }}
          >
            How it works?
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            p: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Instructions />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  )
}
