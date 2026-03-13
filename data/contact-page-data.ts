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
                    { label: 'Email', value: 'naturesboon@yahoo.com', icon: 'Mail' },
                    { label: 'Factory Address', value: 'Pakhowal Rd, adj. Sri Chaitanya Techno School, Thakkarwal, Ludhiana, Punjab - 142022', icon: 'MapPin' },
                    { label: 'Working Hours', value: 'Mon - Fri: 9:00 AM - 6:00 PM', icon: 'Clock' },
                ],
                departmentEmails: [
                    { label: 'Inquiry/Info', email: 'naturesboon@yahoo.com' },
                    { label: 'Accounts', email: 'accounts.naturesboon@yahoo.com' },
                    { label: 'Purchase', email: 'purchase.naturesboon@yahoo.com' },
                    { label: 'Sales', email: 'sales.naturesboon@yahoo.com' },
                    { label: 'Artwork/Designing', email: 'artwork.naturesboon@yahoo.com' },
                    { label: 'Exports', email: 'Exports@lustercosmetics.in' },
                    { label: 'Sales (Exports)', email: 'Sales@chitkaraexports.com' },
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
