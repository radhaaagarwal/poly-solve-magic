import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface FunctionEvaluatorProps {
  a: number;
  b: number;
  c: number;
}

export const FunctionEvaluator = ({ a, b, c }: FunctionEvaluatorProps) => {
  const [inputX, setInputX] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const evaluateFunction = () => {
    const x = parseFloat(inputX);
    if (!isNaN(x)) {
      const fx = a * x * x + b * x + c;
      setResult(fx);
    }
  };

  const formatNumber = (num: number): string => {
    return Math.abs(num) < 1e-10 ? "0" : num.toFixed(6);
  };

  return (
    <Card className="w-full math-glow border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text">Function Evaluator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center math-equation text-lg text-muted-foreground">
          f(x) = {formatNumber(a)}x² + {formatNumber(b)}x + {formatNumber(c)}
        </div>
        
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter x value"
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            className="bg-secondary/50 border-primary/30"
            onKeyPress={(e) => e.key === 'Enter' && evaluateFunction()}
          />
          <Button 
            onClick={evaluateFunction}
            className="bg-math-primary hover:bg-math-primary/80"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Compute
          </Button>
        </div>

        {result !== null && (
          <div className="p-4 bg-secondary/30 rounded border border-primary/20">
            <div className="text-center">
              <span className="math-equation text-lg">
                f({inputX}) = <span className="text-math-success text-xl font-bold">{formatNumber(result)}</span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};