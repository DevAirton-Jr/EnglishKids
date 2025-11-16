import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

function loadAvatars() {
  const ctx = require.context('../assets/avatars', false, /\.(png|jpe?g|gif|svg)$/);
  const files = ctx.keys();
  const list = files.map((key) => {
    const src = ctx(key);
    const base = key.replace('./', '');
    const name = base.replace(/\.[^/.]+$/, '');
    return { name, src };
  });
  return list;
}

const avatars = loadAvatars();

export default function Profile() {
  const { userProfile, updateUserProfile, uploadProfilePicture } = useAuth();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setBio(userProfile.bio || '');
      setAge(userProfile.age || '');
      setPhotoURL(userProfile.photoURL || '');
    }
  }, [userProfile]);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setCustomImage(null);
    setPhotoURL(avatar.src);
  };

  const handleCustomImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
        setSelectedAvatar(null);
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      let finalPhotoURL = photoURL;

      if (customImage && uploadProfilePicture) {
        finalPhotoURL = await uploadProfilePicture(customImage);
      }

      await updateUserProfile({
        name,
        bio,
        age,
        photoURL: finalPhotoURL,
      });

      setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Erro ao atualizar perfil.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Seu Perfil</h1>
          <p>Atualize suas informações pessoais</p>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              {photoURL ? (
                <img src={photoURL} alt="Foto de perfil" className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <button
              className="change-photo-button"
              onClick={() => fileInputRef.current.click()}
            >
              Enviar Imagem
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomImage}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Grade de Avatares */}
            <div className="avatar-grid">
              {avatars.map((avatar) => (
                <div
                  key={avatar.name}
                  className={`avatar-item ${
                    selectedAvatar?.name === avatar.name ? 'selected' : ''
                  }`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <img src={avatar.src} alt={avatar.name} />
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Idade</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Biografia</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4"></textarea>
            </div>

            <button type="submit" disabled={loading} className="save-profile-button">
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </form>
        </div>

        <div className="profile-stats">
          <h2>Estatísticas do Jogo</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{userProfile?.completedLevels?.length || 0}</div>
              <div className="stat-label">Níveis Completados</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userProfile?.currentLevel || 1}</div>
              <div className="stat-label">Nível Atual</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{Math.floor((userProfile?.completedLevels?.length || 0) * 10)}%</div>
              <div className="stat-label">Progresso Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
