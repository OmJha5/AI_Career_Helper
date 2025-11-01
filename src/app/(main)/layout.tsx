import React from 'react'

interface props {
    children: React.ReactNode
}

export default function layout({children} : props) {
  return (
    <div className="container mx-auto my-20">{children}</div>
  )
}
