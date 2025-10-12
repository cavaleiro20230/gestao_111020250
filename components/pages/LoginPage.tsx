import React, { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import Card from '../Card';
import { KeyIcon, SparklesIcon } from '../icons';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const authContext = useContext(AuthContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (authContext) {
            const result = authContext.login(email, password);
            if (result === 'invalid') {
                setError('Credenciais inválidas. Tente novamente.');
            } else if (result === 'blocked') {
                setError('Este usuário está bloqueado. Entre em contato com o administrador.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md px-4">
                 <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-400">FEMAR</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sistema de Gestão para Fundações</p>
                 </div>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <KeyIcon className="w-5 h-5 mr-2" />
                                Entrar
                            </button>
                        </div>
                    </form>
                </Card>
                 <div className="text-center mt-4 text-xs text-slate-500">
                    <p>admin@femar.com / password</p>
                    <p>super@femar.com / password</p>
                    <p>finance@femar.com / password</p>
                    <p>project@femar.com / password</p>
                    <p>coord@femar.com / password</p>
                    <p>fiscal@femar.com / password</p>
                    <p>colab@femar.com / password</p>
                    <p className="font-bold text-teal-600 dark:text-teal-400 mt-2">helena@fap.org.br / fap (Portal de Transparência da FEMAR)</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;