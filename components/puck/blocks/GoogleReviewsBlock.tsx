import { ComponentConfig } from "@puckeditor/core";
import { GoogleReviews, GoogleReviewsProps } from "../../blocks/GoogleReviews";
import { ImagePicker } from "@/components/ImagePicker";

export const GoogleReviewsBlockConfig: ComponentConfig<GoogleReviewsProps> = {
    label: "Google Reviews",
    fields: {
        businessName: { type: "text", label: "Business Name" },
        totalRating: { type: "number", label: "Average Rating" },
        totalReviews: { type: "number", label: "Total Reviews Count" },
        googleMapsUrl: { type: "text", label: "Google Maps URL" },
        badgeText: { type: "text", label: "Badge Label" },
        backgroundColor: {
            type: "select",
            label: "Background Color",
            options: [
                { label: "White", value: "white" },
                { label: "Slate", value: "slate-50" },
                { label: "Sage Green", value: "sage-green" },
                { label: "Soft Gray", value: "soft-gray" },
                { label: "Transparent", value: "transparent" },
            ],
        },
        textAlign: {
            type: "radio",
            label: "Text Alignment",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
            ],
        },
        reviews: {
            type: "array",
            label: "Customer Reviews",
            getItemSummary: (review) => review.author_name || "Review",
            arrayFields: {
                author_name: { type: "text", label: "Reviewer Name" },
                profile_photo_url: {
                    type: "custom",
                    label: "Profile Photo",
                    render: ({ value, onChange }: any) => (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-medium">✨ Upload a custom photo or use a Google URL</span>
                            <ImagePicker value={value} onChange={onChange} />
                        </div>
                    ),
                },
                rating: {
                    type: "number",
                    label: "Rating (1-5)",
                    min: 1,
                    max: 5,
                },
                relative_time_description: { type: "text", label: "Time Ago" },
                text: { type: "textarea", label: "Review Content" },
                verified: {
                    type: "radio",
                    label: "Verified Status",
                    options: [{ label: "Yes", value: true }, { label: "No", value: false }]
                },
            },
        },
    },
    defaultProps: {
        businessName: "Nature's Boon",
        totalRating: 5.0,
        totalReviews: 9,
        googleMapsUrl: "https://maps.app.goo.gl/DHC2D3T28ZRsn7Jx7",
        backgroundColor: "white",
        badgeText: "Most Trusted Manufacturer",
        textAlign: "left",
        reviews: [
            {
                author_name: "Kamaljot Kaur",
                rating: 5,
                relative_time_description: "3 months ago",
                text: "Good 👍",
                verified: true,
            },
            {
                author_name: "Chitkara Exports",
                rating: 5,
                relative_time_description: "10 months ago",
                text: "Best Skincare and Haircare manufacturer in Punjab",
                verified: true,
            },
            {
                author_name: "Shivam Bhasiin",
                rating: 5,
                relative_time_description: "2 years ago",
                text: "Product Range (5/5) They offers an extensive range of cosmetics, spanning from exquisite skincare formulations to stunning skin care essentials. Their products are curated with utmost precision, catering to diverse needs and preferences.",
                verified: true,
            },
            {
                author_name: "Harjot Singh",
                rating: 5,
                relative_time_description: "2 years ago",
                text: "One of the things I loved about this company is that they provided specialized solutions according to our requirements.",
                verified: true
            },
            {
                author_name: "Jass Verma",
                rating: 5,
                relative_time_description: "2 years ago",
                text: "Awesome team that's been helping us bring our products to life.",
                verified: true
            }
        ],
    },
    render: (props: any) => <GoogleReviews {...props} />,
};
