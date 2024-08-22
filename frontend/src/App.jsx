import { Route, Routes } from "react-router-dom";
import Header from "./components/ui/Header";
import SignUpPage from "./components/pages/SignUpPage";
import NotFound from "./components/pages/NotFound";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import TransactionPage from "./components/pages/TransactionPage";

function App() {
  const authUser = true;

  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/transaction/:id' element={<TransactionPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
