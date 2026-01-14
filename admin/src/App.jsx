import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { UserLayout } from './components/Layout/UserLayout';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';


function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserLayout/>}></Route>
      </Routes>

  <header>
      <SignedOut>
        <SignInButton mode='modal' />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
   </BrowserRouter>
  )
}

export default App