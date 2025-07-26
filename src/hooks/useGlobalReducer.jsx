import React, { createContext, useContext, useReducer } from "react";

const Context = createContext();

const initialState = {
  contacts: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case "set_contacts":
      return { ...state, contacts: action.payload };
    case "add_contact":
      return { ...state, contacts: [...state.contacts, action.payload] };
    case "delete_contact":
      return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  return <Context.Provider value={{ store, dispatch }}>{children}</Context.Provider>;
};

const useGlobalReducer = () => useContext(Context);
export default useGlobalReducer;


// ✅ Contacts.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ContactCard from "../components/ContactCard";

const Contacts = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    fetch("https://playground.4geeks.com/apis/fake/contact/agenda/julian_agenda")
      .then(resp => resp.json())
      .then(data => dispatch({ type: "set_contacts", payload: data }))
      .catch(err => console.error("Error al cargar contactos:", err));
  }, [dispatch]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2>Contact List</h2>
        <Link to="/add-contact" className="btn btn-success">
          Add new contact
        </Link>
      </div>

      {store.contacts.length === 0 ? (
        <p>No contacts available.</p>
      ) : (
        store.contacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))
      )}
    </div>
  );
};

export default Contacts;