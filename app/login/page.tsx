import { DynamicLoginClient as LoginClient } from "@/components/DynamicClients";

export const metadata = {
    title: "Login | NatureBoon CMS",
    description: "Login to NatureBoon CMS to manage your website content.",
};

export default function LoginPage() {
    return <LoginClient />;
}
