import React from 'react'

interface props {
    children: React.ReactNode
}

export default function layout({children} : props) {
  return (
    <div className="flex justify-center py-20">{children}</div>
  )
}
