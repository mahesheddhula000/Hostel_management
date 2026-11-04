HOSTEL CARE UPDATED FRONTEND

Copy the supplied files into your existing Frontend folder. Keep your existing css/style.css.
Replace js/script.js and replace the HTML pages with these versions.

Final structure:
Frontend/
  css/style.css                 (keep your existing CSS)
  js/script.js
  index.html
  login.html
  complaint.html
  student-dashboard.html
  admin-dashboard.html

Rename old studentdashboard.html to student-dashboard.html and old admindashboard.html
to admin-dashboard.html, or remove the old copies after replacing them.

Open the Frontend folder in VS Code. Right-click index.html and choose Open with Live Server.
Use the same browser and same Live Server address for student and admin pages.

Demo test:
1. Homepage -> Student Login.
2. Enter any non-empty ID and password. Login redirects to student-dashboard.html.
3. Submit a complaint.
4. Open admin-dashboard.html in the same browser/origin.
5. Change staff/status and Save.
6. Return to student dashboard and refresh.

Limitations: this is a frontend demo. Any non-empty credentials are accepted; there is no real
authentication, admin protection, backend database, or saved photo upload. localStorage is
specific to this browser/origin. Do not use real passwords or sensitive student data.
