// ====================
// HubSpot API
// ====================
let hsApiUrl = 'https://api.hsforms.com/submissions/v3/integration/submit/4657307/';
let formData = {
    fields: [],
};
let UTMs = ['utm_medium', 'utm_source', 'utm_campaign', 'utm_term', 'utm_content'];

document.querySelectorAll('[hs-form]').forEach(form => {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let hsFormID = this.getAttribute('hs-form');
        if (!hsFormID) return;
        let hsEndPoint = hsApiUrl + hsFormID;
        let redirectURL = this.getAttribute('redirect-url');
        // Add the form data to the formData object
        this.querySelectorAll('[hs-form-field]').forEach(fieldElement => {
            let field = {
                name: fieldElement.getAttribute('hs-form-field'),
                value: fieldElement.value,
            };
            formData.fields.push(field);
        });
        // Add the UTM parameters to the formData object
        UTMs.forEach(utm => {
            let utmValue = new URLSearchParams(window.location.search).get(utm);
            if (utmValue != null) {
                let field = {
                    name: `${utm}`,
                    value: utmValue,
                };
                formData.fields.push(field);
            }
        });
        console.log('HubSpot Form Data:', formData);
        // Get page information
        let pageName = document.title; // Use the page title as the name
        let pageUrl = window.location.href; // Get the full URL of the page
        let hubspotCookie = document.cookie.match(/(?:^|;\s*)hubspotutk\s*=\s*([^;]*)/);
        let htuk = hubspotCookie ? hubspotCookie[1] : null;
        // Create the hs_context object
        if (htuk) {
            formData.context = {
                hutk: htuk,
                pageUri: pageUrl,
                pageName: pageName,
            };
        }
        // Make a POST request to HubSpot
        fetch(hsEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('HubSpot Form Submission Successful:', data);

                const { redirectUri } = data;

                if (redirectURL != undefined) {
                    setTimeout(() => {
                        window.location = redirectURL;
                    }, 1000);
                } else if (redirectUri != undefined) {
                    setTimeout(() => {
                        window.location = redirectUri;
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('HubSpot Form Submission Error:', error);
                // Handle error, e.g., show an error message to the user
            });
    });
});

// ====================
// Footer Newsletter
// ====================
let footerNewsletterForm;
footerNewsletterForm = document.getElementById('wf-form-Newsletter---Footer');
setTimeout(() => {
    console.log('Newsletter form found');
    if (footerNewsletterForm) {
        console.log('Newsletter form found');
        footerNewsletterForm.addEventListener('submit', function (event) {
            console.log('Newsletter form submitted');
            event.preventDefault();
            document.querySelector('.footer-newsletter_form').style.display = 'none';
            document.querySelector('.footer-newsletter_success-message').style.display = 'block';
            return false;
        });
    }
}, 5000);