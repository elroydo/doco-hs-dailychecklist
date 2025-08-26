# Daily Departmental Health & Safety Checklist

This project provides a web-based, interactive form designed to streamline daily health and safety checks within departments. It ensures efficient reporting, compliance, and immediate notification of concerns, enhancing overall workplace safety.

## Features

* **User-Friendly Interface:** A clean, responsive design for easy navigation and data entry on any device.
* **Dynamic Checklist:** Includes 16 comprehensive safety items with options for "YES", "NO", or "N/A" responses.
* **Conditional Inputs:** Automatically displays additional input fields for specific questions (e.g., First Aider's name, timing of checks) when a "YES" response is selected, ensuring all necessary details are captured.
* **Client-Side Validation:** Ensures all required fields, including conditional inputs and a digital signature, are completed before form submission.
* **Digital Signature:** Allows inspectors to sign off electronically on the completed checklist.
* **Automated Email Notifications:** Utilizes EmailJS to send a detailed summary of the checklist submission via email, including a dedicated section for any identified "NO" responses (escalation concerns).
* **Enhanced User Feedback:** Features a loading state on the submit button during submission and enables a "Print Form" button only after successful submission.

## Setup & Usage

To get this form up and running locally and configure its email functionality:

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd daily-safety-checklist # Or whatever your repository folder is named
    ```

2.  **Open in Browser:**
    Simply open the `index.html` file in your preferred web browser.

3.  **EmailJS Configuration:**
    This form uses [EmailJS](https://www.emailjs.com/) to send emails without server-side code.

    * **Sign Up/Log In:** Create an account or log in to EmailJS.
    * **Email Service:** Add an Email Service (e.g., Gmail) in your EmailJS dashboard under "Email Services".
    * **Email Template:** Create a new Email Template in your EmailJS dashboard under "Email Templates".
        * Copy the content of the provided `template.html` into the EmailJS template editor.
        * Ensure the template's fields (e.g., `To`, `From`, `Subject`) are configured as needed. The template expects variables like `{{department}}`, `{{date}}`, `{{time}}`, `{{managerName}}`, `{{inspectorName}}`, `{{inspectorEmail}}`, `{{inspectorSignature}}`, `{{checklistItems}}`, `{{concerns}}`.
        * If you wish to include a logo in the email, ensure the `<img>` tag in `template.html` points to an accessible URL (e.g., `<img src="https://upload.wikimedia.org/wikipedia/tr/f/fd/Do%26Co.png">` or a dynamic `{{logoUrl}}` if you pass it).
    * **Update `form.js`:**
        * Open the `form.js` file.
        * Replace `"UpVAE8xvGXfqw314Q"` with your actual **EmailJS Public Key** (found in your EmailJS Account settings).
        * Replace `"service_n3kiw5g"` with your **EmailJS Service ID**.
        * Replace `"template_3i1mc4g"` with your **EmailJS Template ID**.

4.  **Fill and Submit:** Once configured, fill out the form in your browser and submit it to test the email notification.

## Technologies Used

* **HTML5:** Structure of the web form.
* **Tailwind CSS:** Utility-first CSS framework for styling.
* **JavaScript:** Powers the form logic, dynamic fields, validation, and EmailJS integration.
* **SignaturePad.js:** A JavaScript library for drawing smooth signatures on HTML canvas.
* **EmailJS:** Enables sending emails directly from client-side JavaScript.

## Future Enhancements

* **Inline Validation Feedback:** Provide real-time validation messages as users interact with fields.
* **PDF Report Generation:** Offer an option to generate and download a PDF version of the completed checklist.
* **Draft Saving:** Implement local storage to allow users to save incomplete forms and resume later.
* **Backend Integration:** Connect to a database for persistent storage of all submissions and advanced reporting features.