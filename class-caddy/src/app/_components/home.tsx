'use client';
import Logo from './logo'
export default function HomeComponent({goToNextPage}:{goToNextPage:(page:string)=>void}) {
  return(
    <main
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#7197C1',
            fontFamily: 'sans-serif',
          }}
        >
          <Logo />
          <h1 style={{ margin: '20px 0 0', color: '#FFF', letterSpacing: '2.5px' }}>
            UFLORIDA
          </h1>
          <button onClick={() => goToNextPage("login")} style={{
            padding: '10px',
            cursor: 'pointer',
            marginTop: '20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6EAAEA',
            width: '190px',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            boxShadow: '3px 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            Log In
          </button>


          <button onClick={() => goToNextPage('register')} style={{
            padding: '10px',
            cursor: 'pointer',
            marginTop: '20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6EAAEA',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '190px',
            transition: 'background-color 0.3s',
            boxShadow: '3px 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            Register
          </button>
        </main>
  )
}