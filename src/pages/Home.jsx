import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import Card from '../components/Card';

function Home() {
  const navigate = useNavigate();

  // State for managing creators list and form visibility
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form input states
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');
  const [youtube_username, setYoutube_username] = useState('');
  const [twitter_username, setTwitter_username] = useState('');
  const [instagram_username, setInstagram_username] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all creators from database
  async function fetchCreators() {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('401')) {
        console.error('Authentication error: Check your Supabase API key and RLS policies');
      }
    } finally {
      setLoading(false);
    }
  }

  // Load creators when page first loads
  useEffect(() => {
    fetchCreators();
  }, []);

  // Smooth scroll to creators section
  const scrollToCreators = () => {
    const creatorsSection = document.getElementById('creators-section');
    if (creatorsSection) {
      creatorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Convert username to full social media URL
  function constructSocialUrl(platform, username) {
    if (!username || !username.trim()) return null;
    const cleanUsername = username.trim().replace(/^@/, ''); // Remove @ if user added it

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

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent page refresh

    // Basic validation
    if (!name || !description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!youtube_username && !twitter_username && !instagram_username) {
      alert('Please provide at least one social media username');
      return;
    }

    setFormLoading(true);

    try {
      // Build full URLs from usernames
      const youtube_url = constructSocialUrl('youtube', youtube_username);
      const twitter_url = constructSocialUrl('twitter', twitter_username);
      const instagram_url = constructSocialUrl('instagram', instagram_username);

      const newCreator = {
        name,
        imageURL: imageURL || null, // Use null if empty
        description,
        youtube_url,
        twitter_url,
        instagram_url,
      };

      // Save to database
      const { data, error } = await supabase
        .from('creators')
        .insert([newCreator])
        .select(); // Return the created record

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Clear form and hide it
      setName('');
      setImageURL('');
      setDescription('');
      setYoutube_username('');
      setTwitter_username('');
      setInstagram_username('');
      setShowAddForm(false);

      // Refresh list and go to new creator's page
      await fetchCreators();
      navigate(`/creators/${data[0].id}`);
    } catch (error) {
      console.error('Error adding creator:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });

      if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('401') || error.code === '42501') {
        alert(`Authentication Error (401):\n\nPlease check:\n1. Your Supabase API key in .env file\n2. Row Level Security (RLS) policies on the 'creators' table\n3. Make sure you're using the 'anon' key, not 'service_role'\n\nCheck the browser console for more details.`);
      } else {
        alert(`Failed to add creator: ${error.message || JSON.stringify(error)}`);
      }
    } finally {
      setFormLoading(false);
    }
  }

  function handleCancel() {
    setName('');
    setImageURL('');
    setDescription('');
    setYoutube_username('');
    setTwitter_username('');
    setInstagram_username('');
    setShowAddForm(false);
  }

  return (
    <div className="home-container">
      <div className="background-image"></div>

      <div className="home-content">
        <h1 className="title">CREATORVERSE</h1>

        <div className="button-group">
          <button onClick={scrollToCreators} className="button">
            VIEW ALL CREATORS
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="button"
          >
            {showAddForm ? 'CANCEL' : 'ADD A CREATOR'}
          </button>
        </div>

        {showAddForm && (
          <div className="home-form-container">
            <h2>Add New Creator</h2>
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
                <h3>SOCIAL MEDIA LINKS</h3>
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
                <button type="submit" disabled={formLoading} className="submit-button">
                  {formLoading ? 'Submitting...' : 'SUBMIT'}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-link">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div id="creators-section" className="home-creators-section">
          {loading ? (
            <div className="loading-message">Loading...</div>
          ) : creators.length === 0 ? (
            <p className="empty-message">NO CREATORS YET 😞</p>
          ) : (
            <div className="home-creators-grid">
              {creators.map((creator) => (
                <Card key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
