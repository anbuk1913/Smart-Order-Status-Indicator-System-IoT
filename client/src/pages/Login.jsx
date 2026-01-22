import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required');
            return;
        }

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <StarBackground />
            <div className="card" style={{ width: '100%', maxWidth: '400px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(30, 41, 59, 0.7)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#fff' }}>Chef Login</h2>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            // required // Validation handled manually
                            className="bg-gray-800 text-white border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            // required // Validation handled manually
                            className="bg-gray-800 text-white border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
