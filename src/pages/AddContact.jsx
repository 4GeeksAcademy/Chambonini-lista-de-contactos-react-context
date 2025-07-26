import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const AddContact = () => {
  const { dispatch } = useGlobalReducer();
  const [form, setForm] = useState({ full_name: "", email: "", address: "", phone: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const contactData = { ...form, agenda_slug: "julian_agenda" };
    const resp = await fetch("https://playground.4geeks.com/apis/fake/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData)
    });
    const data = await resp.json();
    dispatch({ type: "add_contact", payload: data });
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="full_name" placeholder="Full Name" onChange={handleChange} required />
        <input className="form-control mb-2" name="email" placeholder="Enter email" onChange={handleChange} />
        <input className="form-control mb-2" name="phone" placeholder="Enter phone" onChange={handleChange} />
        <input className="form-control mb-2" name="address" placeholder="Enter address" onChange={handleChange} />
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddContact;