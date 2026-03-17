export const contactPageData = {
    content: [
        {
            type: "AboutHero",
            id: "contact-hero",
            props: {
                badgeText: "Contact Us",
                title: "Let's Build Something Great Together",
                description: "Have a question or want to discuss a new project? We're here to help."
            }
        },
        {
            type: "ContactSection",
            id: "contact-section",
            props: {
                heading: "Get in Touch",
                infoItems: [
                    { label: 'Phone', value: '+91-9877659808', icon: 'Phone' },
                    { label: 'Email', value: 'info@naturesboon.net', icon: 'Mail' },
                    { label: 'Factory Address', value: 'Pakhowal Rd, adj. Sri Chaitanya Techno School, Thakkarwal, Ludhiana, Punjab - 142022', icon: 'MapPin' },
                    { label: 'Working Hours', value: 'Mon - Fri: 9:00 AM - 6:00 PM', icon: 'Clock' },
                ],
                departmentEmails: [
                    { label: 'General Inquiry', email: 'info@naturesboon.net' },
                    { label: 'Domestic Sales', email: 'sales@naturesboon.net' },
                    { label: 'Export Sales', email: 'exports@naturesboon.net' },
                    { label: 'Quality Assurance', email: 'quality@naturesboon.net' },
                    { label: 'Purchase/Sourcing', email: 'purchase@naturesboon.net' },
                    { label: 'Artwork & Designing', email: 'artwork@naturesboon.net' },
                    { label: 'Human Resources', email: 'hr@naturesboon.net' },
                ]
            }
        }
    ],
    root: {
        props: {
            title: "Contact Us"
        }
    }
};
