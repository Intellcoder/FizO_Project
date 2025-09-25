import { useState } from "react";

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500 mb-6">
        Manage your account preferences and application settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-2">
          {["profile", "account", "notifications", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                active === tab
                  ? "bg-gray-100 font-medium text-black"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="space-y-6">
          {active === "profile" && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Profile</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border rounded-lg px-3 py-2"
                  defaultValue="John Doe"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-lg px-3 py-2"
                  defaultValue="john@example.com"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-lg">
                  Save Changes
                </button>
              </div>
            </section>
          )}

          {active === "account" && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <input
                type="password"
                placeholder="Change Password"
                className="w-full border rounded-lg px-3 py-2"
              />
              <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg">
                Update Password
              </button>
            </section>
          )}

          {active === "notifications" && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Email Alerts
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Push Notifications
              </label>
            </section>
          )}

          {active === "security" && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Security</h2>
              <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50">
                Log out of all devices
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
