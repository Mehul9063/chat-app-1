import React from 'react'
import { Button,Icon,Drawer } from 'rsuite'
import Dashboard from '.'
import { useModalState } from '../../misc/custom-hooks'

const DashBoardToggle = () => {
  
  const { isOpen,open,close } = useModalState()
  
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard"/> Dashboard
      </Button>
      <Drawer show={isOpen} onHide={close} placement="left">
        <Dashboard />
      </Drawer>
    </>
  )
}

export default DashBoardToggle
