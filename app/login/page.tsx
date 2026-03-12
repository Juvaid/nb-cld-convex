import { DynamicLoginClient as LoginClient } from "@/components/DynamicClients";

export const metadata = {
    title: "Login | Nature's Boon CMS",
    description: "Login to Nature's Boon CMS to manage your website content.",
};

export default function LoginPage() {
    return <LoginClient />;
}
