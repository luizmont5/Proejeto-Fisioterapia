from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Doctor, Appointment

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

    # Criar médicos
    if not Doctor.query.all():
        doctors = [
            Doctor(nome='Dr. João Silva', especialidade='Fisioterapia Ocupacional', crm='123456',
                   horarios_disponiveis='9:00-17:00'),
            Doctor(nome='Dra. Maria Oliveira', especialidade='Fisioterapia Neurofuncional', crm='234567',
                   horarios_disponiveis='9:00-17:00'),
            Doctor(nome='Dr. Pedro Santos', especialidade='Fisioterapia Traumato-Ortopédica', crm='345678', horarios_disponiveis='9:00-17:00'),
            Doctor(nome='Dra. Ana Souza', especialidade='Fisioterapia Esportiva', crm='456789',
                   horarios_disponiveis='9:00-17:00'),
            Doctor(nome='Dr. Carlos Pereira', especialidade='Fisioterapia Dermatofuncional', crm='567890',
                   horarios_disponiveis='9:00-17:00')
        ]
        db.session.bulk_save_objects(doctors)
        db.session.commit()


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(
        nome=data['nome'],
        cpf=data['cpf'],
        password=data['password'],
        idade=data['idade'],
        endereco=data['endereco'],
        dataNascimento=data['dataNascimento'],
        estadoOrigem=data['estadoOrigem'],
        cidade=data['cidade'],
        comorbidades=data.get('comorbidades')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201


@app.route('/login', methods=['POST'])
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    cpf = data.get('cpf')
    password = data.get('password')

    print(f"Received CPF: {cpf}, Password: {password}")  # Adicione esta linha para depuração

    user = User.query.filter_by(cpf=cpf, password=password).first()
    if user:
        return jsonify({"message": "Login successful!", "user_id": user.id}), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'nome': user.nome,
            'cpf': user.cpf,
            'idade': user.idade,
            'endereco': user.endereco,
            'dataNascimento': user.dataNascimento,
            'estadoOrigem': user.estadoOrigem,
            'cidade': user.cidade,
            'comorbidades': user.comorbidades
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404


@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([{
        'id': doctor.id,
        'nome': doctor.nome,
        'especialidade': doctor.especialidade,
        'crm': doctor.crm,
        'horarios_disponiveis': doctor.horarios_disponiveis
    } for doctor in doctors]), 200


@app.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    new_appointment = Appointment(
        user_id=data['user_id'],
        doctor_id=data['doctor_id'],
        data=data['data'],
        hora=data['hora']
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({"message": "Appointment created successfully!"}), 201
@app.route('/appointments/user/<int:user_id>', methods=['GET'])
def get_user_appointments(user_id):
    appointments = Appointment.query.filter_by(user_id=user_id).all()
    result = []
    for appointment in appointments:
        doctor = Doctor.query.get(appointment.doctor_id)
        result.append({
            "appointment_id": appointment.id,
            "doctor_name": doctor.nome,
            "specialty": doctor.especialidade,
            "crm": doctor.crm,
            "date": appointment.data,
            "time": appointment.hora
        })
    return jsonify(result), 200
@app.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if appointment:
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({"message": "Appointment deleted successfully!"}), 200
    else:
        return jsonify({"message": "Appointment not found!"}), 404

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/update_specialties', methods=['POST'])
def update_specialties():
    specialties = [
        'Fisioterapia Ocupacional',
        'Fisioterapia Neurofuncional',
        'Fisioterapia Traumato-Ortopédica',
        'Fisioterapia Esportiva',
        'Fisioterapia Dermatofuncional'
    ]
    
    doctors = Doctor.query.all()
    for i, doctor in enumerate(doctors):
        doctor.especialidade = specialties[i % len(specialties)]
    
    db.session.commit()
    return jsonify({"message": "Specialties updated successfully!"}), 200