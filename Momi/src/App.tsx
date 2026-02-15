import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecipeBooksProvider } from './context/RecipeBooksContext';
import { CategoriesProvider } from './context/CategoriesContext';
import { RecipesProvider } from './context/RecipesContext';
import MainLayout from './components/Layouts/MainLayout';
import Opskrifter from './pages/Opskrifter/Opskrifter';
import Favoritter from './pages/Favoritter/Favoritter';
import Kategorier from './pages/Kategorier/Kategorier';
import CategoryDetail from './pages/Kategorier/CategoryDetail';
import Create from './pages/Create/Create';
import Share from './pages/Share/Share';
import Import from './pages/Import/Import';

function App() {
  return (
    <RecipeBooksProvider>
      <CategoriesProvider>
        <RecipesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Opskrifter />} />
                <Route path="favoritter" element={<Favoritter />} />
                <Route path="kategorier" element={<Kategorier />} />
                <Route path="kategorier/:category" element={<CategoryDetail />} />
                <Route path="opret" element={<Create />} />
                <Route path="opret/:id" element={<Create />} />
                <Route path="del" element={<Share />} />
              </Route>
              <Route path="importer/:shareId" element={<Import />} />
            </Routes>
          </BrowserRouter>
        </RecipesProvider>
      </CategoriesProvider>
    </RecipeBooksProvider>
  )
}

export default App
