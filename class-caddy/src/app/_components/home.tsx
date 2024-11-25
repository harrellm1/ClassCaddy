'use client';
import { useRouter } from "next/navigation";
import Logo from './logo'
export default async function HomeComponent() {
  const router = useRouter();
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
          <button onClick={() => router.push('/login')} style={{
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6EAAEA',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}>
            Log In
          </button>


          <button onClick={() => router.push('/register')} style={{
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6EAAEA',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}>
            Register
          </button>
        </main>
  )
}