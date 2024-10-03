import React from "react";
import {
  Wifi,
  Thermometer,
  Clock,
  Lock,
  Zap,
  Speaker,
  Sun,
  Video,
  Edit,
  Share2,
  UserCheck,
  DollarSign,
  Calendar,
  Mouse,
} from "lucide-react";

const BenefitIcon = ({ benefit }) => {
  switch (benefit) {
    case "Strong Wi-Fi":
      return <Wifi size={24} />;
    case "Climate Control":
      return <Thermometer size={24} />;
    case "24/7 Access":
      return <Clock size={24} />;
    case "Secure Space":
      return <Lock size={24} />;
    case "Ergonomic Design":
      return <UserCheck size={24} />;
    case "Power Outlets":
      return <Zap size={24} />;
    case "Noise Cancellation":
      return <Speaker size={24} />;
    case "Adjustable Lighting":
      return <Sun size={24} />;
    case "Video Conferencing":
      return <Video size={24} />;
    case "Whiteboard":
      return <Edit size={24} />;
    case "Screen Sharing":
      return <Share2 size={24} />;
    case "Privacy":
      return <Lock size={24} />;
    case "Hourly Rates":
      return <Clock size={24} />;
    case "Daily Packages":
      return <Calendar size={24} />;
    case "Monthly Plans":
      return <DollarSign size={24} />;
    case "Easy Booking":
      return <Mouse size={24} />;
    default:
      return null;
  }
};

export default BenefitIcon;
