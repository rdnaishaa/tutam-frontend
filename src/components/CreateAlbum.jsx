import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/CreateAlbum.css';

const CreateAlbum = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/albums', formData);
      
      if (response.data.success) {
        navigate(`/albums/${response.data.payload.id}`);
      } else {
        setError(response.data.message || 'Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      setError(error.response?.data?.message || 'Failed to create album. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-album">
      <h2>Create New Album</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Album Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter a memorable name for your album"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="What's this album about? (optional)"
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
            />
            <span className="checkbox-label">Make this album public</span>
            <span className="checkbox-hint">Public albums can be seen by everyone</span>
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/albums')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlbum;