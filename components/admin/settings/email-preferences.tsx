import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminEmailPreferences() {
  return (
    <div className="space-y-4 text-lg">
      Switches to turn on/off email notifications for each of the following
      events:
      <div className="flex items-center pt-8 space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Request Received</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Post-Screen Completed</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Receipts Uploaded</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Agreement Uploaded</Label>
      </div>
    </div>
  );
}
