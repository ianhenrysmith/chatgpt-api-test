import random
import secrets
from faker import Faker

fake = Faker()

def generate_employee_data(num_employees=5):
    employees = []
    for _ in range(num_employees):
        name = fake.name()
        hours_worked = random.randint(20, 60)
        employees.append((name, hours_worked))
    return employees

def create_email(employees, pay_period_start, pay_period_end):
    email_subject = f"Employee hours for pay period {pay_period_start} to {pay_period_end}"
    email_body = f"Hello,\n\nHere are the hours worked by employees during the pay period from {pay_period_start} to {pay_period_end}:\n\n"

    for name, hours in employees:
        email_body += f"{name}: {hours} hours\n"

    email_body += "-----------------\n"
    email_body += "ID mappings:\n"

    for name, hours in employees:
        email_body += f"{name}: {secrets.token_hex(8)}\n"

    email_body += "\nPlease process their pay accordingly.\n\nBest regards,\n\n[Your Name]"

    return email_subject, email_body

if __name__ == "__main__":
    employees = generate_employee_data()
    pay_period_start = "2023-04-01"
    pay_period_end = "2023-04-15"

    subject, body = create_email(employees, pay_period_start, pay_period_end)

    print("Subject:")
    print(subject)
    print("\nBody:")
    print(body)
