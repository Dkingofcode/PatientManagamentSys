import React, { useState } from "react";
import { Home, Stethoscope, FlaskConical, User, Warehouse } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function SettingsSidebar() {
    const [active, setActive] = useState("frontdesk");
    const menuItems = [
        {
            id: "frontdesk",
            label: "Frontdesk Dashboard",
            icon: <Home className="w-5 h-5"/>,
            path: "/front-desk",
        },
        {
            id: "doctor",
            label: "Doctor Dashboard",
            icon: <Stethoscope className="w-5 h-5"/>,
            path: "/doctor",
        },
        {
            id: "labtech",
            label: "LabTech Dashboard",
            icon: <FlaskConical className="w-5 h-5"/>,
            path: "/lab-technician",
        },
        {
            id: "inventory",
            label: "Inventory Dashboard",
            icon: <Warehouse className="w-5 h-5"/>,
            path: "/inventory",
        },
        {
            id: "account",
            label: "Account Dashboard",
            icon: <User className="w-5 h-5"/>,
            path: "/account",
        },
    ];
    return (<motion.aside initial={{ x: -250 }} animate={{ x: 0 }} className="w-64 h-screen bg-blue-50 shadow-xl p-4 flex flex-col gap-4 border-r">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (<Link key={item.id} to={item.path} onClick={() => setActive(item.id)} className={`flex items-center gap-3 p-3 rounded-xl transition 
              ${active === item.id
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-700"}`}>
            {item.icon}
            {item.label}
          </Link>))}
      </nav>
    </motion.aside>);
}
