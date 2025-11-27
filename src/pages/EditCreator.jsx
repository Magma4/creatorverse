import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import Modal from '../components/Modal';

function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');
  const [youtube_username, setYoutube_username] = useState('');
  const [twitter_username, setTwitter_username] = useState('');
  const [instagram_username, setInstagram_username] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Extract username from full URL (for editing existing creators)
  function extractUsername(platform, url) {
    if (!url) return '';

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      switch (platform) {
        case 'youtube': {
          // Handle different YouTube URL formats
          if (pathname.startsWith('/@')) {
            return pathname.substring(2);
          } else if (pathname.startsWith('/c/')) {
            return pathname.substring(3);
          } else if (pathname.startsWith('/channel/')) {
            return pathname.substring(9);
          } else if (pathname.startsWith('/user/')) {
            return pathname.substring(6);
          }
          return '';
        }
        case 'twitter':
        case 'instagram': {
          // Username is after the first slash
          const username = pathname.substring(1);
          return username || '';
        }
        default:
          return '';
      }
    } catch {
      // Fallback if URL parsing fails
      if (platform === 'youtube' && url.includes('@')) {
        const match = url.match(/@([^/?]+)/);
        return match ? match[1] : '';
      }
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      return lastPart || '';
    }
  }

  // Build full URL from username
  function constructSocialUrl(platform, username) {
    if (!username || !username.trim()) return null;
    const cleanUsername = username.trim().replace(/^@/, '');

    switch (platform) {
      case 'youtube':
        return `https://youtube.com/@${cleanUsername}`;
      case 'twitter':
        return `https://twitter.com/${cleanUsername}`;
      case 'instagram':
        return `https://instagram.com/${cleanUsername}`;
      default:
        return null;
    }
  }

  // Load existing creator data into form
  useEffect(() => {
    async function fetchCreator() {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select()
          .eq('id', id)
          .single();

        if (error) throw error;

        // Populate form fields
        setName(data.name || '');
        setDescription(data.description || '');
        setImageURL(data.imageURL || '');
        // Extract usernames from stored URLs
        setYoutube_username(extractUsername('youtube', data.youtube_url || ''));
        setTwitter_username(extractUsername('twitter', data.twitter_url || ''));
        setInstagram_username(extractUsername('instagram', data.instagram_url || ''));
      } catch (error) {
        console.error('Error fetching creator:', error);
        alert('Failed to load creator information');
      } finally {
        setFetching(false);
      }
    }

    fetchCreator();
  }, [id]);

  // Update creator in database
  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!youtube_username && !twitter_username && !instagram_username) {
      alert('Please provide at least one social media username');
      return;
    }

    setLoading(true);

    try {
      // Convert usernames back to URLs
      const youtube_url = constructSocialUrl('youtube', youtube_username);
      const twitter_url = constructSocialUrl('twitter', twitter_username);
      const instagram_url = constructSocialUrl('instagram', instagram_username);

      const updates = {
        name,
        imageURL: imageURL || null,
        description,
        youtube_url,
        twitter_url,
        instagram_url,
      };

      // Update database
      const { error } = await supabase
          .from('creators')
          .update(updates)
          .eq('id', id); // Update only this creator

      if (error) throw error;

      navigate(`/creators/${id}`);
    } catch (error) {
      console.error('Error updating creator:', error);
      alert('Failed to update creator. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id);

      if (error) throw error;

      setShowDeleteModal(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting creator:', error);
      alert('Failed to delete creator. Please try again.');
    }
  }

  if (fetching) return <div>Loading...</div>;

  return (
    <div className="form-container">
      <h1>Edit Creator</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageURL">Image</label>
          <p className="hint">
            Provide a link to an image of your creator. Be sure to include the http://
          </p>
          <input
            id="imageURL"
            type="url"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="http://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <p className="hint">
            Provide a description of the creator. Who are they? What makes them interesting?
          </p>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <h2>SOCIAL MEDIA LINKS</h2>
          <p className="hint">
            Provide at least one of the creator's social media usernames.
          </p>

          <div className="form-group">
            <label htmlFor="youtube_username">
              <span className="icon">▶️</span> YouTube
            </label>
            <p className="hint">The creator's YouTube handle (without the @)</p>
            <input
              id="youtube_username"
              type="text"
              value={youtube_username}
              onChange={(e) => setYoutube_username(e.target.value)}
              placeholder="channelname"
            />
          </div>

          <div className="form-group">
            <label htmlFor="twitter_username">
              <span className="icon">🐦</span> Twitter
            </label>
            <p className="hint">The creator's Twitter handle (without the @)</p>
            <input
              id="twitter_username"
              type="text"
              value={twitter_username}
              onChange={(e) => setTwitter_username(e.target.value)}
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="instagram_username">
              <span className="icon">📷</span> Instagram
            </label>
            <p className="hint">The creator's Instagram handle (without the @)</p>
            <input
              id="instagram_username"
              type="text"
              value={instagram_username}
              onChange={(e) => setInstagram_username(e.target.value)}
              placeholder="username"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Updating...' : 'UPDATE'}
          </button>
          <Link to={`/creators/${id}`} className="cancel-link">Cancel</Link>
        </div>
      </form>

      <div className="form-delete-section">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="delete-button"
          type="button"
        >
          DELETE
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
        <p>Are you sure you want to delete <strong>{name}</strong>?</p>
        <p className="modal-warning">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default EditCreator;
