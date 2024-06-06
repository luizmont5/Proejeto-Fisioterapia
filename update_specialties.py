from app import app, db
from models import Doctor

specialties = [
    'Fisioterapia Ocupacional',
    'Fisioterapia Neurofuncional',
    'Fisioterapia Traumato-Ortopédica',
    'Fisioterapia Esportiva',
    'Fisioterapia Dermatofuncional'
]

with app.app_context():
    doctors = Doctor.query.all()
    for i, doctor in enumerate(doctors):
        doctor.especialidade = specialties[i % len(specialties)]

    db.session.commit()
