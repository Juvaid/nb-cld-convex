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
                    { label: 'Phone', value: '+91 97818 00033', icon: 'Phone' },
                    { label: 'Email', value: 'info@naturesboon.com', icon: 'Mail' },
                    { label: 'Factory Address', value: 'Plot No 123, JLPL Industrial Area, Sector 82, Mohali, Punjab - 140308', icon: 'MapPin' },
                    { label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM', icon: 'Clock' },
                ],
                departmentEmails: [
                    { label: 'Sales', email: 'sales@naturesboon.com' },
                    { label: 'Support', email: 'support@naturesboon.com' },
                    { label: 'Export', email: 'exports@naturesboon.com' },
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
