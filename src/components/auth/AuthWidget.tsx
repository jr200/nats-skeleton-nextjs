// import { useEffect, useState } from 'react'
// import { useAuth } from '../Providers'

// export default function AuthWidget() {
//   const { userInfo, authenticated, handleLogin, handleLogout } = useAuth()

//   const [tokenExpiryCountdown, setTokenExpiryCountdown] = useState<number>(-1)

//   useEffect(() => {
//     if (!authenticated) return

//     const REFRESH_SECONDS = 2
//     const timer = setTimeout(
//       () => setTokenExpiryCountdown(userInfo?.expires_in ?? -1),
//       REFRESH_SECONDS * 1000
//     )

//     return () => clearTimeout(timer)
//   })

//   let button =
//     authenticated && userInfo ? (
//       <button onClick={handleLogout}>
//         Log out ({tokenExpiryCountdown}) {status}
//       </button>
//     ) : (
//       <button onClick={handleLogin}>Log in {status}</button>
//     )

//   return button
// }
