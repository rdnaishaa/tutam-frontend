import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../css/Album.css';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await api.get('/albums');
      setAlbums(response.data.payload || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching albums:', error);
      setError('Failed to load albums. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await api.delete(`/albums/${id}`);
        setAlbums(albums.filter(album => album.id !== id));
      } catch (error) {
        console.error('Error deleting album:', error);
        alert('Failed to delete album. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading albums...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="albums-container">
      <h2>My Albums Collection</h2>
      {albums.length === 0 ? (
        <p className="no-albums">No albums found. Create one!</p>
      ) : (
        <div className="albums-grid">
          {albums.map(album => (
            <div key={album.id} className="album-card">
              <h3>{album.name}</h3>
              <p>{album.description || 'No description'}</p>
              <div className="album-status">
                Status: <span className={album.is_public ? "status-public" : "status-private"}>
                  {album.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="album-actions">
                <Link to={`/albums/${album.id}`} className="view-btn">View Details</Link>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(album.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums;