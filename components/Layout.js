// components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>HabitAssist</h1>
        <nav>
          <Link href="/dashboard" style={styles.link}>Dashboard</Link>
          <Link href="/metrics" style={styles.link}>Metrics</Link>
        </nav>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#f9fafb',
  },
  header: {
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  link: {
    marginLeft: '1rem',
    color: '#3b82f6',
    textDecoration: 'none',
  },
  main: {
    width: '100%',
    maxWidth: '640px',
    flexGrow: 1,
  },
};
