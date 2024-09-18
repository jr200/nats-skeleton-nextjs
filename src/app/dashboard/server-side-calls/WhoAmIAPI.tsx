'use client'
import React, { useEffect, useState } from 'react'

function WhoAmIAPI() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/whoami')
      .then(res => {
        return res.json()
      })
      .then(({ user }) => {
        setUser(user)
      })
  }, [])
  return <p>WhoAmIAPI (client): {user}</p>
}

export default WhoAmIAPI
