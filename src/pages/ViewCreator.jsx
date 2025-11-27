import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import Modal from '../components/Modal';

function ViewCreator() {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load creator data when component mounts or ID changes
  useEffect(() => {
    async function fetchCreator() {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select()
          .eq('id', id) // Find creator with matching ID
          .single(); // Expect one result

        if (error) throw error;
        setCreator(data);
      } catch (error) {
        console.error('Error fetching creator:', error);
        alert('Failed to load creator information');
      } finally {
        setLoading(false);
      }
    }

    fetchCreator();
  }, [id]); // Re-run if ID changes

  // Delete creator from database
  async function handleDelete() {
    try {
      const { error } = await supabase
        .from('creators')
        .delete()
        .eq('id', id); // Delete only this creator

      if (error) throw error;

      setShowDeleteModal(false);
      navigate('/'); // Go back home
    } catch (error) {
      console.error('Error deleting creator:', error);
      alert('Failed to delete creator');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!creator) return <div>Creator not found</div>;

  return (
    <div className="view-creator">
      <Link to="/" style={{ display: 'inline-block', marginBottom: '0.75rem', color: '#4a90e2', fontSize: '0.9rem' }}>
        ← Back to All Creators
      </Link>

      {creator.imageURL ? (
        <div className="view-creator-image">
          <img src={creator.imageURL} alt={creator.name} />
        </div>
      ) : (
        <div className="view-creator-image-placeholder">
          <span>No Image Available</span>
        </div>
      )}

      <h1 className="view-creator-name">{creator.name}</h1>

      <div className="view-creator-description">
        <p>{creator.description}</p>
      </div>

      {(creator.youtube_url || creator.twitter_url || creator.instagram_url) && (
        <div className="view-creator-social-links">
          {creator.youtube_url && (
            <a
              href={creator.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-social-icon"
              title="YouTube"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          )}
          {creator.twitter_url && (
            <a
              href={creator.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-social-icon"
              title="Twitter"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
          {creator.instagram_url && (
            <a
              href={creator.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-social-icon"
              title="Instagram"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          )}
        </div>
      )}

      <div className="view-creator-actions">
        <Link to={`/creators/${id}/edit`} className="view-action-btn edit-btn">
          Edit
        </Link>
        <button onClick={() => setShowDeleteModal(true)} className="view-action-btn delete-btn">
          Delete
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Creator"
        confirmText="Delete"
        onConfirm={handleDelete}
        isDanger={true}
      >
        <p>Are you sure you want to delete <strong>{creator?.name}</strong>?</p>
        <p className="modal-warning">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default ViewCreator;
