import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { UserLayout } from './components/Layout/UserLayout';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserLayout/>}></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
      </Routes>
   </BrowserRouter>
  )
}

export default App