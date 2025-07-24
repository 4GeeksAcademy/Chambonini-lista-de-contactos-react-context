import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ContactCard = ({ contact }) => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  if (!contact || !contact.id) return null;

  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de eliminar este contacto?");
    if (!confirm) return;

    if (contact.local) {
      const local = JSON.parse(localStorage.getItem("offline_contacts") || "[]");
      const updated = local.filter((c) => c.id !== contact.id);
      localStorage.setItem("offline_contacts", JSON.stringify(updated));
      dispatch({ type: "delete_contact", payload: contact.id });
    } else {
      try {
        const resp = await fetch(`https://organic-winner-pxx99pq49rqhr7xw-5000.app.github.dev/contacts/${contact.id}`, {
          method: "DELETE"
        });

        if (!resp.ok) throw new Error("Error al eliminar contacto en la API");

        dispatch({ type: "delete_contact", payload: contact.id });
      } catch (err) {
        console.error("❌ Error al eliminar contacto:", err.message);
        alert("Error al eliminar contacto. Verifica la conexión con la API.");
      }
    }
  };

  const handleEdit = () => {
    const url = contact.local ? `/edit-local/${contact.id}` : `/edit/${contact.id}`;
    navigate(url);
  };

  return (
    <div className="container border rounded p-3 my-2 bg-white shadow-sm d-flex align-items-center">
      <img
        src="https://randomuser.me/api/portraits/men/75.jpg"
        alt="contact avatar"
        className="rounded-circle me-3"
        style={{ width: "80px", height: "80px", objectFit: "cover" }}
      />
      <div className="flex-grow-1">
        <h5 className="mb-1">{contact.full_name}</h5>
        <p className="mb-0"><i className="fas fa-map-marker-alt me-2"></i> {contact.address}</p>
        <p className="mb-0"><i className="fas fa-phone me-2"></i> {contact.phone}</p>
        <p className="mb-0"><i className="fas fa-envelope me-2"></i> {contact.email}</p>
      </div>
      <div className="ms-3 d-flex">
        <button className="btn btn-link text-dark me-2" onClick={handleEdit}>
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button className="btn btn-link text-danger" onClick={handleDelete}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
