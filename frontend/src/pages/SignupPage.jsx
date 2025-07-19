import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/axios.js";
import { SIGNUP_ROUTE } from "@/lib/routes.js";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

export default function SignupForm() {

    const navigate = useNavigate();
    const { isAuthenticated } = useAppStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Developer",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post(SIGNUP_ROUTE, formData);
            toast.success("Signup successful!");
            console.log("Signup Response:", response.data);
            navigate("/signin");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="bg-sidebar shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-4 text-center">
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <h2 className="text-2xl font-bold text-center">Sign Up</h2>

                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full text-primary bg-sidebar mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Developer">Developer</option>
                            <option value="Tester">Tester</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                </form>

                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
