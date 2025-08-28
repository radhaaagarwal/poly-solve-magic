import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Upload, Download } from "lucide-react";

export interface DataPoint {
  x: number;
  y: number;
}

interface DataPointInputProps {
  dataPoints: DataPoint[];
  onDataPointsChange: (points: DataPoint[]) => void;
}

export const DataPointInput = ({ dataPoints, onDataPointsChange }: DataPointInputProps) => {
  const [newX, setNewX] = useState("");
  const [newY, setNewY] = useState("");

  const addDataPoint = () => {
    if (newX && newY) {
      const x = parseFloat(newX);
      const y = parseFloat(newY);
      if (!isNaN(x) && !isNaN(y)) {
        onDataPointsChange([...dataPoints, { x, y }]);
        setNewX("");
        setNewY("");
      }
    }
  };

  const removeDataPoint = (index: number) => {
    onDataPointsChange(dataPoints.filter((_, i) => i !== index));
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(dataPoints, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "polynomial_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            onDataPointsChange(data);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="w-full math-glow border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text">Data Points</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="x value"
            value={newX}
            onChange={(e) => setNewX(e.target.value)}
            className="bg-secondary/50 border-primary/30"
          />
          <Input
            type="number"
            placeholder="y value"
            value={newY}
            onChange={(e) => setNewY(e.target.value)}
            className="bg-secondary/50 border-primary/30"
          />
          <Button 
            onClick={addDataPoint} 
            variant="default"
            className="bg-math-primary hover:bg-math-primary/80"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {dataPoints.map((point, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-primary/20">
              <span className="math-equation">
                ({point.x}, {point.y})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDataPoint(index)}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={exportToJSON}
            variant="outline"
            className="flex-1 border-math-secondary text-math-secondary hover:bg-math-secondary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <label className="flex-1">
            <Button
              variant="outline"
              className="w-full border-math-secondary text-math-secondary hover:bg-math-secondary/10"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importFromJSON}
              className="hidden"
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
};