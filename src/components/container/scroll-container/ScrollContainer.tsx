import React, { PropsWithChildren } from 'react'

function ScrollContainer({ children }: PropsWithChildren) {
  return <div style={{ overflow: 'auto' }}>{children}</div>
}

export default ScrollContainer
