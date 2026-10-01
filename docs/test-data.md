# Test Data

## Project

Miguel Flor — QA & AI Portfolio

---

# Valid Data

## User 001

First Name:

Miguel

Last Name:

Flor

Email:

valid@example.com

Phone:

1123456789

Consent:

true

---

# Invalid Data

## Invalid Email 001

Email:

miguel@

Expected:

Rejected

---

## Invalid Email 002

Email:

miguel

Expected:

Rejected

---

## Empty Email

Email:

""

Expected:

Rejected

---

## Empty First Name

First Name:

""

Expected:

Rejected

---

## Empty Last Name

Last Name:

""

Expected:

Rejected

---

## Empty Phone

Phone:

""

Expected:

Rejected

---

# Boundary Data

## Long Name

First Name:

AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Expected:

System should handle the input according
to the defined validation rules.

---

# Special Characters

First Name:

Miguel123

Expected:

To be defined according to business rules.

---

# Phone Characters

Phone:

abc

Expected:

Rejected