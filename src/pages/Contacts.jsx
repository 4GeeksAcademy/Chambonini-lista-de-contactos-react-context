import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ContactCard from "../components/ContactCard";

const Contacts = () => {
  const { store, dispatch } = useGlobalReducer();

  // 🔁 Cargar contactos desde la API al montar el componente
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const resp = await fetch("https://organic-winner-pxx99pq49rqhr7xw-5000.app.github.dev/contacts");
        if (!resp.ok) throw new Error("No se pudo cargar contactos desde API");

        const data = await resp.json();
        dispatch({ type: "set_contacts", payload: data });
      } catch (err) {
        console.warn("❌ API no disponible. Cargando desde localStorage:", err.message);
        const local = JSON.parse(localStorage.getItem("offline_contacts") || "[]");
        dispatch({ type: "set_contacts", payload: local });
      }
    };

    loadContacts();
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-center">Contact List</h2>
        <Link to="/add-contact" className="btn btn-success">
          Add New Contact
        </Link>
      </div>

      {store.contacts.length === 0 ? (
        <p className="text-center">No contacts available.</p>
      ) : (
        store.contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))
      )}
    </div>
  );
};

export default Contacts;
