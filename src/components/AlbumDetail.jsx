import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/AlbumDetail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchAlbumDetails();
  }, [id]);

  const fetchAlbumDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/albums/${id}`);
      if (response.data.success) {
        setAlbum(response.data.payload);
        setFormData({
          name: response.data.payload.name,
          description: response.data.payload.description || ''
        });
      } else {
        setError('Album not found');
      }
    } catch (error) {
      console.error('Error fetching album details:', error);
      setError('Failed to load album details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/albums/${id}`, formData);
      if (response.data.success) {
        setAlbum(response.data.payload);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating album:', error);
      alert('Failed to update album. Please try again.');
    }
  };

  const handleStatusChange = async () => {
    try {
      const response = await api.patch(`/albums/${id}/status`, {
        isPublic: !album.is_public
      });
      if (response.data.success) {
        setAlbum(response.data.payload);
      }
    } catch (error) {
      console.error('Error updating album status:', error);
      alert('Failed to update album status. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await api.delete(`/albums/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting album:', error);
        alert('Failed to delete album. Please try again.');
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading album details...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <h3>Error</h3>
      <p className="error-message">{error}</p>
      <button className="retry-btn" onClick={fetchAlbumDetails}>
        Try Again
      </button>
    </div>
  );
  
  if (!album) return (
    <div className="not-found-container">
      <div className="not-found-icon">?</div>
      <h3>Not Found</h3>
      <p className="not-found-message">Album not found</p>
      <button className="back-home-btn" onClick={() => navigate('/')}>
        Back to Albums
      </button>
    </div>
  );

  return (
    <div className="album-detail">
      <div className="album-detail-banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1 className="album-title">{album.name}</h1>
        </div>
      </div>
      
      <div className="album-detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <span className="btn-icon">←</span>
          <span className="btn-text">Back to Albums</span>
        </button>
        <div className="album-actions">
          <button 
            className={`edit-btn ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <span className="btn-icon">{isEditing ? '✕' : '✎'}</span>
            <span className="btn-text">{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
          <button 
            className="delete-btn"
            onClick={handleDelete}
          >
            <span className="btn-icon">🗑</span>
            <span className="btn-text">Delete</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-container">
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>Edit Album Details</h3>
              <p>Make changes to your album information below</p>
            </div>
            <div className="form-group">
              <label htmlFor="name">Album Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter album name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your album (optional)"
                rows="4"
              />
            </div>
            <button type="submit" className="save-btn">
              <span className="btn-icon">✓</span>
              <span className="btn-text">Save Changes</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="album-info">
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">{album.name}</h2>
              <div className="album-badge">
                {album.is_public ? 'Public' : 'Private'}
              </div>
            </div>
            
            <div className="description-container">
              <h3 className="section-title">Description</h3>
              <p className="description">
                {album.description || 'No description available'}
              </p>
            </div>
            
            <div className="album-meta">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <div className="meta-content">
                  <p className="meta-label">Created</p>
                  <p className="meta-value">{new Date(album.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
              
              <div className="status-toggle">
                <span className="status-icon">
                  {album.is_public ? '🔓' : '🔒'}
                </span>
                <div className="status-content">
                  <p className="status-label">Visibility</p>
                  <button 
                    className="toggle-btn"
                    onClick={handleStatusChange}
                  >
                    Switch to {album.is_public ? 'Private' : 'Public'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetail;