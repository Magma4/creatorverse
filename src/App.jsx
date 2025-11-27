import { useRoutes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';

function App() {
  // Define all app routes
  const routes = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/creators',
      element: <ShowCreators />
    },
    {
      path: '/creators/:id',
      element: <ViewCreator />
    },
    {
      path: '/creators/add',
      element: <AddCreator />
    },
    {
      path: '/creators/:id/edit',
      element: <EditCreator />
    }
  ]);

  return routes;
}

export default App
