import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';
import Card from '../components/Card';

function ShowCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all creators on page load
  useEffect(() => {
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

    fetchCreators();
  }, []);

  return (
    <div className="creators-page">
      <h1>All Creators</h1>

      <Link to="/creators/add" className="add-button">
        ADD A CREATOR
      </Link>

      {loading ? (
        <div>Loading...</div>
      ) : creators.length === 0 ? (
        <div className="empty-state">
          <p>NO CREATORS YET 😞</p>
          <Link to="/creators/add">Add Your First Creator</Link>
        </div>
      ) : (
        <div className="creators-grid">
          {creators.map((creator) => (
            <Card key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowCreators;
