export const initEnquiryForm = () => {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        // Collect form data into JSON
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Send data to our Node.js Backend API
            const response = await fetch('http://localhost:3000/api/enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Hide the form
                form.style.display = 'none';

                // Create success message element
                const successMsg = document.createElement('div');
                successMsg.className = 'enquiry-success-message';
                successMsg.innerHTML = `
                    <div class="success-icon">✓</div>
                    <h3>Request Submitted!</h3>
                    <p>Thank you for your enquiry. We have received your request and our team will reach out to you within 24 hours.</p>
                    <button class="sp-form-submit" style="margin-top: 24px;" onclick="window.location.reload()">Send Another</button>
                `;

                // Insert the success message where the form was
                form.parentNode.insertBefore(successMsg, form.nextSibling);

                // Add small fade-in effect
                setTimeout(() => {
                    successMsg.classList.add('visible');
                }, 50);
            } else {
                throw new Error('Server responded with an error');
            }

        } catch (error) {
            console.error('FAILED...', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            alert('Oops! Something went wrong while sending your request. Please try again later or contact us directly via email/phone.');
        }
    });
};
