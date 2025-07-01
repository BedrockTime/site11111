import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Categories from "./components/categories.jsx"
import Task from "./components/task.jsx"

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="/categories/:id" element={<Categories />} />
      <Route path="/categories/:id/task/:id" element={<Task />} />
    </Routes>
  </BrowserRouter>
);