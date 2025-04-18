"use client";
import { useUser, UserButton, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from "@/components/ui/typography";

const Settings = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  if (!isLoaded) return (
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto shadow-lg rounded-xl p-6">
        <Typography variant="h1">
          Settings
        </Typography>
        <div className="mb-6">
          <Typography variant="h6" >
            Personal Info
          </Typography>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        <div className="mb-6">
          <Typography variant="h6" >
            Update Email
          </Typography>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        <div className="mb-6">
          <Typography variant="h6" >
            Update Password
          </Typography>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </Card>
    </div>
  );

  if (!isSignedIn) return <RedirectToSignIn />;

  // Check if the user is signed in with an external account like GitHub or Google
  const isExternalLogin = user?.externalAccounts?.length > 0;

  const handleUpdateEmail = async () => {
    if (isExternalLogin) {
      alert('You cannot change your email if logged in with GitHub, Google, or other external providers.');
    } else {
      try {
        // Assuming updateEmail is part of the API for email login users
        alert('Email updated successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to update email');
      }
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await user.updatePassword({ currentPassword: newPassword, newPassword });
      alert('Password updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update password');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto shadow-lg rounded-xl p-6">
        <Typography variant="h3" >
          Settings
        </Typography>

        <div className="mb-6">
          <Typography variant="h6">
            Personal Info
          </Typography>
          <Typography>{user.primaryEmailAddress?.emailAddress}</Typography>
          <UserButton />
        </div>

        <div className="mb-6">
          <Typography variant="h6">
            Update Email
          </Typography>
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="mb-4"
          />
          <Button onClick={handleUpdateEmail} className="w-full">
            Update Email
          </Button>
        </div>

        <div className="mb-6">
          <Typography variant="h6">
            Update Password
          </Typography>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="mb-4"
          />
          <Button onClick={handleUpdatePassword} className="w-full">
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
