import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const AddContact = () => {
  const { dispatch, store } = useGlobalReducer();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Si estamos editando, buscar el contacto en el store
  useEffect(() => {
    if (id) {
      const contactToEdit = store.contacts.find((c) => String(c.id) === id && !c.local);
      if (contactToEdit) {
        setForm({
          full_name: contactToEdit.full_name || "",
          email: contactToEdit.email || "",
          phone: contactToEdit.phone || "",
          address: contactToEdit.address || ""
        });
      }
    }
  }, [id, store.contacts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      // 🛠 EDITAR contacto backend
      try {
        const resp = await fetch(`https://organic-winner-pxx99pq49rqhr7xw-5000.app.github.dev/contacts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        if (!resp.ok) throw new Error("Error al editar contacto en API");

        const updatedContact = await resp.json();
        dispatch({ type: "update_contact", payload: updatedContact });
        navigate("/");
      } catch (err) {
        console.error("❌ Error al editar contacto:", err.message);
        alert("Error al editar contacto. Verifica la conexión con el servidor.");
      }

    } else {
      // ➕ AGREGAR contacto
      try {
        const resp = await fetch("https://organic-winner-pxx99pq49rqhr7xw-5000.app.github.dev/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        if (!resp.ok) throw new Error("Error al guardar contacto en API");

        const newContact = await resp.json();
        dispatch({ type: "add_contact", payload: newContact });
        navigate("/");
      } catch (err) {
        console.error("❌ Error al guardar en API:", err.message);

        // Solo guardar en local si fue un error real de red
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          const localContact = { ...form, id: Date.now(), local: true };
          const local = JSON.parse(localStorage.getItem("offline_contacts") || "[]");
          local.push(localContact);
          localStorage.setItem("offline_contacts", JSON.stringify(local));
          dispatch({ type: "add_contact", payload: localContact });
          navigate("/");
        } else {
          alert("No se pudo guardar el contacto. Revisa si la API está funcionando.");
        }
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h3 className="text-center mb-4">{id ? "Edit contact" : "Add a new contact"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              placeholder="Enter phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              {id ? "Save changes" : "Save contact"}
            </button>
          </div>

          <div className="text-start">
            <Link to="/" className="text-secondary">
              or get back to contacts
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
