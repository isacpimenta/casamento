import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js'; 
import { ADMIN_PASSWORD_HASH } from '../config.js';

export default function AdminLogin() {
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const logAttempt = async (success) => {
    try {
      await addDoc(collection(db, 'tentativas_login'), {
        sucesso: success,
        timestamp: serverTimestamp(),
        ip: 'indisponível no frontend', // se quiser pegar IP precisa backend
        senhaTentada: senha,
      });
    } catch (e) {
      console.error('Erro ao logar tentativa:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await bcrypt.compare(senha, ADMIN_PASSWORD_HASH);

    await logAttempt(isValid);

    if (isValid) {
      localStorage.setItem('adminLogged', 'true');
      Swal.fire({
        icon: 'success',
        title: 'Bem-vindo!',
        text: 'Senha correta, você está logado.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/dashboard');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Senha incorreta',
        text: 'Tente novamente.',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl mb-6">Login do Administrador</h1>
      <form onSubmit={handleSubmit} className="max-w-xs w-full">
        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
