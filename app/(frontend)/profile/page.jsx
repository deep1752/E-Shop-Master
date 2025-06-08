"use client"; 


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner"; 
import { Pencil } from "lucide-react"; // Icon for editing
import { useUserContext } from "@/context/UserContext"; 

export default function ProfilePage() {
  
  const { userInfo, setUserInfo, loading, error, setLoading } = useUserContext();
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(""); 
  const [isSaving, setIsSaving] = useState(false); 
  const router = useRouter(); 

  // Update the `newName` state when the `userInfo` is available
  useEffect(() => {
    if (userInfo) setNewName(userInfo.name);
  }, [userInfo]);

  // Redirect user to login page if an error occurs (e.g., session expired)
  useEffect(() => {
    if (error) {
      toast.error(error); 
      router.push("/login"); 
    }
  }, [error, router]);

  // Logout function - clear the token and user info
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userName"); 
    setUserInfo(null); // Clear user info from context
    toast.success("Logged out successfully!");
    router.push("/login"); 
  };

  // Handle the name update logic (sending the new name to the backend)
  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
  
    // Prevent admins from updating their profile
    if (userInfo?.role?.toLowerCase() === "admin") {
      toast.error("Admins are not allowed to edit their profile.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    try {
      setIsSaving(true);
  
      const res = await fetch(
        `https://e-shop-api-1vr0.onrender.com/users/update/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newName,
            email: userInfo.email,
            password: userInfo.password,
            mob_number: userInfo.mob_number,
            role: userInfo.role,
          }),
        }
      );
  
      if (!res.ok) throw new Error("Failed to update name.");
  
      toast.success("Name updated successfully!");
      setUserInfo({ ...userInfo, name: newName });
      localStorage.setItem("userName", newName);
      setIsEditing(false);
    } catch (err) {
      toast.error("Error updating name.");
    } finally {
      setIsSaving(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ReloadIcon className="w-6 h-6 animate-spin" /> 
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="px-6 py-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>

            {/* Conditional rendering: If in editing mode, show input box and save button */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)} // Update the new name as the user types
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNameUpdate} // Trigger the name update function
                  disabled={isSaving} // Disable button when saving
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  {isSaving ? "Saving..." : "Save"} {/* Button text changes based on saving state */}
                </Button>
              </div>
            ) : (
              // Display user name and edit button when not editing
              <div className="flex justify-center items-center gap-2 text-gray-600 text-sm">
                <p>Welcome, {userInfo?.name}</p>
                <button
                  onClick={() => setIsEditing(true)} // Enter editing mode when clicked
                  title="Edit name"
                  className="text-gray-500 hover:text-black"
                >
                  <Pencil size={16} /> {/* Pencil icon for editing */}
                </button>
              </div>
            )}
          </div>

          {/* Display user information like email, mobile, role, and account creation date */}
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Email:</strong> {userInfo?.email}
            </p>
            <p>
              <strong>Mobile:</strong> {userInfo?.mob_number}
            </p>
            <p>
              <strong>Role:</strong> {userInfo?.role}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(userInfo?.created_at).toLocaleString()} {/* Format the creation date */}
            </p>
          </div>

          {/* Logout button */}
          <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
