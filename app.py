# Requisitos: 
# pip install flask flask-cors flask-sqlalchemy
# python3 app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
os.environ['FLASK_APP'] = 'app.py'

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo Contacto
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(120), nullable=True)
    address = db.Column(db.String(120), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address
        }

# Crear las tablas y vaciar todos los contactos al iniciar
with app.app_context():
    db.create_all()
    db.session.query(Contact).delete()
    db.session.commit()

# Obtener todos los contactos
@app.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([c.serialize() for c in contacts]), 200

# Agregar nuevo contacto
@app.route('/contacts', methods=['POST'])
def add_contact():
    data = request.get_json()
    if not data or "full_name" not in data:
        return jsonify({"error": "Datos faltantes"}), 400

    new_contact = Contact(
        full_name=data.get("full_name", ""),
        email=data.get("email", ""),
        phone=data.get("phone", ""),
        address=data.get("address", "")
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.serialize()), 201

# Eliminar contacto
@app.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contacto no encontrado"}), 404
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"msg": "Contacto eliminado"}), 200

# Actualizar contacto
@app.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    data = request.get_json()
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"error": "Contacto no encontrado"}), 404

    contact.full_name = data.get("full_name", contact.full_name)
    contact.email = data.get("email", contact.email)
    contact.phone = data.get("phone", contact.phone)
    contact.address = data.get("address", contact.address)

    db.session.commit()
    return jsonify(contact.serialize()), 200

# Correr el servidor
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
