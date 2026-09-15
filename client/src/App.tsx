import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/toast'
import { Home } from './pages/home'
import { Grades } from './pages/grades'
import { NamesAndRoles } from './pages/names-and-roles'
import { DeepLink } from './pages/deeplink'
import { NoLti } from './pages/no-lti'
import { Register } from './pages/register'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/namesandroles" element={<NamesAndRoles />} />
          <Route path="/deeplink" element={<DeepLink />} />
          <Route path="/nolti" element={<NoLti />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
