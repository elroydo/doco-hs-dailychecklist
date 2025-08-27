// --- JavaScript logic for form functionality ---

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('safetyChecklistForm');
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)' // Set background color
    });
    const clearButton = document.getElementById('clear-signature');
    const printButton = document.getElementById('print-form');
    const submitButton = document.getElementById('submit-button');

    // Pre-populate date and time fields
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    document.getElementById('date').value = `${year}-${month}-${day}`;
    document.getElementById('datetime').value = `${hours}:${minutes}`;

    // Function to resize the canvas correctly for different screens
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear(); // Clear signature on resize to prevent distortion
    }

    // Event listeners for window resize and clearing the signature
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    clearButton.addEventListener('click', () => {
        signaturePad.clear();
        document.getElementById('signature-pad').classList.remove('is-invalid');
        document.getElementById('signature-error').classList.add('hidden');
    });
    printButton.addEventListener('click', () => window.print());

    // Add event listeners for conditional fields
    document.getElementById('item3-yes').addEventListener('change', () => {
        document.getElementById('item3-conditional').classList.remove('hidden');
    });
    document.getElementById('item3-no').addEventListener('change', () => {
        document.getElementById('item3-conditional').classList.add('hidden');
    });
    document.getElementById('item3-na').addEventListener('change', () => {
        document.getElementById('item3-conditional').classList.add('hidden');
    });

    document.getElementById('item4-yes').addEventListener('change', () => {
        document.getElementById('item4-conditional').classList.remove('hidden');
    });
    document.getElementById('item4-no').addEventListener('change', () => {
        document.getElementById('item4-conditional').classList.add('hidden');
    });
    document.getElementById('item4-na').addEventListener('change', () => {
        document.getElementById('item4-conditional').classList.add('hidden');
    });

    document.getElementById('item5-yes').addEventListener('change', () => {
        document.getElementById('item5-conditional').classList.remove('hidden');
    });
    document.getElementById('item5-no').addEventListener('change', () => {
        document.getElementById('item5-conditional').classList.add('hidden');
    });
    document.getElementById('item5-na').addEventListener('change', () => {
        document.getElementById('item5-conditional').classList.add('hidden');
    });


    // Form submission logic
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Reset all validation styles
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));

        let allFieldsValid = true;

        // Validate main input fields and show error messages
        const requiredInputFields = ['department', 'date', 'datetime', 'manager-name', 'inspector-name', 'inspector-email'];
        requiredInputFields.forEach(id => {
            const field = document.getElementById(id);
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                document.getElementById(`${id}-error`).classList.remove('hidden');
                allFieldsValid = false;
            }
        });

        // Validate conditional fields if they are visible
        const conditionalFields = [{
            id: 'first-aider-name',
            parentId: 'item3-conditional'
        }, {
            id: 'work-area-timing',
            parentId: 'item4-conditional'
        }, {
            id: 'floors-timing',
            parentId: 'item5-conditional'
        }];

        conditionalFields.forEach(field => {
            const parent = document.getElementById(field.parentId);
            if (!parent.classList.contains('hidden')) {
                const input = document.getElementById(field.id);
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    allFieldsValid = false;
                }
            }
        });


        // Validate signature pad
        if (signaturePad.isEmpty()) {
            canvas.classList.add('is-invalid');
            document.getElementById('signature-error').classList.remove('hidden');
            allFieldsValid = false;
        } else {
            document.getElementById('inspector-signature').value = signaturePad.toDataURL();
        }

        // Validate all checklist response groups
        const checklistItems = form.querySelectorAll('.checklist-item');
        checklistItems.forEach(item => {
            const responseGroup = item.querySelector('.segmented-control');
            const isChecked = item.querySelector(`input[name="${item.dataset.itemId}-response"]:checked`);

            if (!isChecked) {
                responseGroup.classList.add('is-invalid');
                allFieldsValid = false;
            } else {
                responseGroup.classList.remove('is-invalid');
            }
        });

        if (!allFieldsValid) {
            // Stop submission if validation fails
            return;
        }

        // Set loading state on the button
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="loading-spinner"></div>Submitting...';
        submitButton.classList.add('disabled-btn');

        // Prepare data for EmailJS submission
        const formData = new FormData(form);
        const emailParams = {
            department: formData.get('department'),
            date: formData.get('date'),
            time: formData.get('datetime'),
            managerName: formData.get('managerName'),
            inspectorName: formData.get('inspectorName'),
            inspectorEmail: formData.get('inspectorEmail'),
            inspectorSignature: formData.get('inspectorSignature'),
            checklistItems: [],
            concerns: []
        };

        // Collect checklist items and concerns into arrays of objects
        checklistItems.forEach((item, index) => {
            const itemNumber = index + 1;
            const itemText = item.querySelector('.font-medium').innerText;
            const response = item.querySelector(`input[name="item${itemNumber}-response"]:checked`);
            
            // Safely get the comment value, defaulting to an empty string if the element is not found
            const commentEl = item.querySelector(`textarea[name="comment${itemNumber}"]`);
            const comment = commentEl ? commentEl.value : '';

            let details = '';
            if (response && response.value === 'YES') {
                if (itemNumber === 3) {
                    const firstAiderNameEl = document.getElementById('first-aider-name');
                    if (firstAiderNameEl) details = `\nFull Name: ${firstAiderNameEl.value}`;
                } else if (itemNumber === 4) {
                    const timingEl = document.getElementById('work-area-timing');
                    if (timingEl) details = `\nTiming: ${timingEl.value}`;
                } else if (itemNumber === 5) {
                    const timingEl = document.getElementById('floors-timing');
                    if (timingEl) details = `\nTiming: ${timingEl.value}`;
                }
            }

            const checklistItem = {
                itemNumber: itemNumber,
                itemText: itemText,
                itemResponse: response ? response.value : 'N/A',
                comment: comment || '',
                details: details
            };
            emailParams.checklistItems.push(checklistItem);

            if (response && response.value === 'NO') {
                const commentEl = item.querySelector(`textarea[name="comment${itemNumber}"]`);
                const comment = commentEl ? commentEl.value : 'No comment provided';
                emailParams.concerns.push({
                    item: itemText,
                    comment: comment
                });
            }
        });

        // Convert arrays to formatted strings
        emailParams.checklistItems = emailParams.checklistItems.map(item =>
            `#${item.itemNumber}: ${item.itemText}\nResponse: ${item.itemResponse}${item.details}\nComment: ${item.comment}\n`
        ).join('\n');

        emailParams.concerns = emailParams.concerns.map(concern =>
            `Item: ${concern.item}\nComment: ${concern.comment}\n`
        ).join('\n');

        // Send email using EmailJS
        emailjs.send("service_n3kiw5g", "template_3i1mc4g", emailParams)
            .then(function(response) {
                console.log("Email sent successfully!", response.status, response.text);
                console.log("Form submitted successfully!");
                console.log("Form Data:", Object.fromEntries(formData));

                // Re-enable the button and update text
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Form';
                submitButton.classList.remove('disabled-btn');

                // Enable the print button after successful submission
                printButton.disabled = false;
                printButton.classList.remove('disabled-btn');

                if (emailParams.concerns.length > 0) {
                    console.log("Major concerns detected. Escalating...");
                    console.log("Escalation Data:", emailParams.concerns);
                    alert("Form submitted with concerns. Relevant personnel have been notified. You can now print a copy of the form.");
                } else {
                    alert("Form submitted successfully! You can now print a copy of the form.");
                }
            }, function(error) {
                console.error("Email failed to send:", error);

                // Re-enable the button and update text on failure
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Form';
                submitButton.classList.remove('disabled-btn');

                alert("Form submission failed. Please try again.");
            });
    });
});